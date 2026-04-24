---
'@freecodecamp/uikit-docs': patch
---

Polish the `/showcase` scroll-spy: de-dupe DOM writes so `data-active`
only flips when the section actually changes (was churning on every
intersection tick), pick the topmost visible section when several
overlap the central band, and promote a clicked sidebar link to active
immediately so the eye doesn't catch a stale highlight while the
browser smooth-scrolls.
