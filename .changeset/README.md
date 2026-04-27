# Changesets

This directory is the release control plane for the public npm packages.

Use `pnpm changeset` for package-visible changes. When a release is ready,
run `pnpm changeset version`, review the version and changelog updates, commit
that version bump, then publish from a clean checkout.

The config publishes scoped packages as public packages and keeps private
workspaces out of versioning and npm publishing.
