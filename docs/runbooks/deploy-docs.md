# Runbook — Deploy the docs site to Cloudflare Pages

This is the operator playbook for `apps/docs` (the
`@freecodecamp/uikit-docs` Astro site) on Cloudflare Pages. Cite this
file from any incident, secret rotation, or first-deploy ticket.

Decision context: [ADR-0007](../adr/0007-cloudflare-pages-docs-deploy.md).
Repository wiring: `.github/workflows/deploy-docs.yml`,
`.github/workflows/deploy-docs-preview.yml`,
`apps/docs/wrangler.jsonc`, `apps/docs/public/{_headers,_redirects,robots.txt}`,
`apps/docs/scripts/verify-dist-pages-artefacts.mjs`.

## Glossary

- **Project**: Cloudflare Pages project named `fcc-design`. Direct
  upload mode (no Git integration on the CF side).
- **Production branch**: `main`. CF treats deployments tagged
  `--branch=main` as production.
- **Custom domain**: `design.freecodecamp.org`. Maps to the
  project via CF Pages → Custom Domains.
- **Direct upload**: deploy mode where GitHub Actions runs the
  build and uploads the artefact directory using
  `cloudflare/wrangler-action`. CF does not run a build.
- **Preview**: deployment to `https://<branch>.fcc-design.pages.dev`
  for any non-production `--branch=$REF` pushed via the action.

## Prerequisites (one-time, user-owned)

1. **Cloudflare account access**. Operator must hold a role with
   `Pages: Edit` permission on the freeCodeCamp Cloudflare account.
2. **GitHub repository admin** for `freeCodeCamp/UIkit` (to add
   secrets / environments).
3. **DNS access** for `freecodecamp.org` (or whichever zone owns
   `design.freecodecamp.org`).

## First-deploy procedure

Run in order. Stop and triage if any step fails — do **not** skip.

### 1. Provision the Cloudflare Pages project

In the Cloudflare dashboard:

1. Workers & Pages → Create → Pages → **Direct upload**.
2. Project name: `fcc-design` (must match `apps/docs/wrangler.jsonc`
   and `--project-name` in the deploy workflow).
3. Production branch: `main`.
4. Skip the "upload sample" step — the first real upload comes from
   the GitHub Actions workflow.

CLI alternative (requires local `wrangler` login):

```bash
pnpm dlx wrangler pages project create fcc-design \
  --production-branch=main
```

### 2. Provision the GitHub secrets

In `freeCodeCamp/UIkit` → Settings → Secrets and variables →
Actions, add:

| Secret                  | Source                                                   | Scope                                |
| ----------------------- | -------------------------------------------------------- | ------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | CF dashboard → My Profile → API Tokens → Create token    | `Account` → `Cloudflare Pages: Edit` |
| `CLOUDFLARE_ACCOUNT_ID` | CF dashboard → any zone → "Account ID" in the right rail | n/a (it is a public-ish identifier)  |

The token must be account-scoped (not zone-scoped) and limited to
`Cloudflare Pages: Edit` on the freeCodeCamp account.

### 3. (Optional) Wire a `production` environment with a reviewer gate

The deploy workflow targets `environment: production`. To require a
human to approve every prod deploy:

1. Settings → Environments → New environment → name: `production`.
2. Required reviewers: at least one core maintainer.
3. Move both `CLOUDFLARE_*` secrets from the repo scope into the
   environment scope.

If skipped, deploys run unattended; that is acceptable for a docs
site but loses the gate.

### 4. Trigger the first deploy

Two paths:

- **Manual**: GitHub → Actions → "Deploy docs" → Run workflow on
  `main`.
- **Push-driven**: any merge to `main` that touches `apps/docs/**`,
  `packages/**`, `pnpm-lock.yaml`, or
  `.github/workflows/deploy-docs.yml` triggers the workflow
  automatically.

Verify in the workflow log:

- `pnpm build:docs` exits 0 and the post-build gate prints
  `✓ Cloudflare Pages artefacts present in dist/ (6 files)`.
- The `Deploy to Cloudflare Pages` step prints a deployment URL
  ending in `.fcc-design.pages.dev`.

Smoke-test that URL in a browser:

- `/` renders the landing page.
- `/components/` renders the components index.
- `/handbook/`, `/brand/`, `/playground/` render.
- `/sitemap-index.xml` returns 200.
- `/robots.txt` shows the absolute `Sitemap:` line.
- DevTools → Network → check the `/_astro/<hash>.js` response:
  `Cache-Control: public, max-age=31536000, immutable`.
- DevTools → Network → check `/`: every security global from
  `_headers` is present (`Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Content-Security-Policy-Report-Only`).

### 5. Attach the custom domain

In CF dashboard → `fcc-design` project → Custom Domains → **Set up
a domain** → enter `design.freecodecamp.org`.

Cloudflare will:

- If `freecodecamp.org` is already a CF zone, auto-create the CNAME
  record `design.freecodecamp.org → fcc-design.pages.dev` on the
  zone.
- If not, print the CNAME content for your DNS provider; add it
  manually.

Wait for the certificate provisioning indicator to turn green
(usually < 10 minutes). Then verify:

```bash
dig +short design.freecodecamp.org
curl -I https://design.freecodecamp.org
```

The `curl` output should show a `cf-ray:` header and a `200`
status. The HTTPS handshake completing without warning confirms the
SSL provision.

Re-run the smoke checks from step 4 against the apex URL.

## PR previews

PR previews land via `.github/workflows/deploy-docs-preview.yml`
once the workflow file exists on `main`. Behaviour:

- Triggered by `pull_request` events with the same path filters as
  the production workflow.
- Deploys to `https://<branch>.fcc-design.pages.dev`.
- The deployment URL appears under "Deployments" on the PR sidebar
  via the `gitHubToken` integration in `cloudflare/wrangler-action`.
- Forks are rejected by an `if:` guard — GitHub denies secret access
  from fork PRs by default.

To take a fork-originated PR through preview, push a copy of the
branch to the canonical repo first (with permission from the
contributor).

## Rollback

In order of preference:

### Option A — CF dashboard rollback (fastest)

1. CF dashboard → `fcc-design` project → Deployments.
2. Find the last known-good deployment.
3. "Manage deployment" → "Rollback to this deployment".

This is instant and does not require a rebuild.

### Option B — `wrangler` CLI rollback

```bash
pnpm dlx wrangler pages deployment list --project-name=fcc-design
pnpm dlx wrangler pages deployment rollback <deployment-id> \
  --project-name=fcc-design
```

### Option C — Git-side rollback

`git revert <commit>` on `main`, push. The push trigger redeploys
automatically. Use this when the bad change is in the source rather
than in `_headers` / config.

### Option D — DNS detach (last resort)

Custom Domains → `design.freecodecamp.org` → Remove. The site
returns DNS-NXDOMAIN until reattached. Use only when the entire
project is compromised and Options A–C cannot help.

## Cache-poisoning awareness

`_headers` entries for `/_astro/*` and `/assets/*` declare
`max-age=31536000, immutable`. A bad CSP / HSTS sticks for up to a
year on browsers that already cached an asset. Mitigations:

- CSP ships in `Content-Security-Policy-Report-Only` for the first
  deploy window. Promotion to enforce-mode is a separate, explicit
  follow-up commit only after observed violation reports = 0 for
  ≥ 7 days.
- HSTS uses `max-age=63072000; includeSubDomains; preload` on day
  one. Removing HSTS once shipped is hard; verify the policy is
  correct _before_ the first cutover.

## Promote CSP from Report-Only to enforce mode

After the observation window:

1. Set up a CSP report endpoint (e.g. CF logs, GlitchTip,
   self-hosted) and add the URI to the policy via `report-to`.
2. Wait ≥ 7 days. Read the report stream end-to-end.
3. If violations = 0, open a PR that swaps
   `Content-Security-Policy-Report-Only:` for
   `Content-Security-Policy:` in `apps/docs/public/_headers`.
   Update `apps/docs/src/_meta/pages-config.test.ts` accordingly.
4. Land it on `main` with `feat(docs): enforce CSP …` and watch the
   first prod deploy.
5. If violations appear post-flip, revert immediately (Option C
   above) and re-tune the policy in Report-Only first.

## Secret rotation

`CLOUDFLARE_API_TOKEN` should be rotated:

- Annually as a baseline.
- Immediately on any suspected leak.
- When the maintainer who created it leaves the project.

Procedure:

1. CF dashboard → My Profile → API Tokens → create a new token
   with the same scope (`Cloudflare Pages: Edit`,
   account-scoped).
2. GitHub → Settings → Secrets → update `CLOUDFLARE_API_TOKEN` to
   the new value.
3. Trigger a `workflow_dispatch` of `Deploy docs` and confirm the
   new token works.
4. CF dashboard → revoke the old token.

`CLOUDFLARE_ACCOUNT_ID` is not a secret in the cryptographic sense
but is treated as one in repo settings to avoid leaking it through
log echo. Rotation only happens if the freeCodeCamp account itself
is replaced.

## Diagnostics

| Symptom                                              | First check                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| Workflow fails at `Deploy to Cloudflare Pages`       | Token scope (`Pages: Edit`); account ID matches; project name matches       |
| `Could not find pages project`                       | Project not provisioned, or `--project-name` typo in workflow vs. dashboard |
| 404 on `/_astro/<hash>.js`                           | `pages_build_output_dir` mismatch; verify post-build gate ran               |
| 500 / blank page after deploy                        | CSP enforce blocked a runtime asset; re-deploy with Report-Only             |
| `cf-ray` header missing on `design.freecodecamp.org` | DNS not yet pointed at CF Pages; confirm CNAME                              |
| Preview shows up but Deployments tab is empty        | `gitHubToken` not passed to the action; check workflow `with:` block        |

## Hand-off contract

This file is the operator's source of truth for everything that
lives outside the repo (CF dashboard state, secrets, DNS). Repo
state is the source of truth for everything inside the repo.
Disagreements between the two are bugs; reconcile by reading
ADR-0007 and following the procedures here.
