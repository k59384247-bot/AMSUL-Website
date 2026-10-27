# Cache invalidation rollout

1. Deploy the dashboard API and all seven editorial triggers from the dashboard integration commit (use a clean checkout to exclude unrelated edits):

```sh
cd /Users/mac/Desktop/StruktHQ/AMSUL-Dashboard
AMSUL_DEPLOY_DIR="$(mktemp -d /tmp/amsul-cache-deploy.XXXXXX)"
git worktree add --detach "$AMSUL_DEPLOY_DIR" f36713a
cd "$AMSUL_DEPLOY_DIR"
npm ci
npm --prefix functions ci
npx -y firebase-tools@latest deploy --project mt-cms-dashboard-staging --only functions:api,functions:onWebsitePostChanged,functions:onWebsiteCategoryChanged,functions:onWebsiteEventChanged,functions:onWebsiteProgramChanged,functions:onWebsiteExecutiveChanged,functions:onWebsiteMediaChanged,functions:onWebsiteSponsorChanged
```

2. Verify the new public endpoint before deploying the website:

```sh
curl 'https://us-central1-mt-cms-dashboard-staging.cloudfunctions.net/api/v1/website/version?tenantId=amsul'
```

Expected: the central success envelope with `data.revision` (a string, initially `"0"` if no trigger has run).

3. Push the website commit to its Pages build branch. Keep `NEXT_PUBLIC_WEBSITE_DATA_SOURCE=api` for dashboard data. The existing API URL, tenant, signing secret and storage-origin settings are unchanged; build command remains `npm run build`, output `out`. No dashboard editor/App Hosting, rules or index deployment is needed for this change.

4. Open a published blog record on the website, then edit its title/body in the dashboard. Confirm the dashboard version increases, and within roughly 60–75 seconds after the trigger completes the open page reflects the edit. The same applies to events, leadership, galleries and sponsors. Focus the tab to check sooner (the edge version may still be cached for up to 15 seconds). Test an unpublish/delete as well: the record should disappear from lists after refresh.

5. For an image replacement at the same storage URL, ensure the corresponding dashboard record is saved. Confirm the rendered `/api/website/asset` URL changes its `v` and signature parameters. The first read of the new URL fills the server cache; subsequent reads reuse it. Editing storage directly without saving a watched dashboard record is outside this invalidation flow.

6. A second feed request with an unchanged version should use `X-Website-Cache: HIT`. Feed responses also expose `X-Website-Revision`. Content remains cached for an hour between edits; version checks are small shared edge reads, not full content downloads. Browser tabs may throttle checks while in the background.

The favicon uses the same PNG as the header logo. Browsers sometimes retain the previous favicon until the tab is reopened. Shared editorial card titles use two lines and summaries three lines, with ellipses for overflow. Full text remains on the detail page.
