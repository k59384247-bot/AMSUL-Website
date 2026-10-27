# Change-driven cache invalidation (no polling)

The website does not poll Firebase or run hourly content refreshes. A published dashboard change sends a signed notification to the website; Cloudflare increments a tiny local cache revision. Existing feed, detail and media caches use that revision, so the next actual page request reads the updated content. Unchanged browser and edge caches are reused. A cold/evicted cache still needs an initial API read; transactional registration checks intentionally remain fresh.

A page already open remains as rendered until navigation or reload. Instant changes in idle tabs would require a separate push connection; no such connection or polling is installed.

## One-time Cloudflare setup

1. Create a D1 database named `amsul-website-cache` in Cloudflare **Storage & databases → D1**.
2. In its SQL console, run the SQL in `cloudflare/cache-schema.sql` (one table containing only tenant ID, numeric cache revision and last event ID; no website content).
3. In **Workers & Pages → your Pages project → Settings → Bindings**, add a D1 binding named **AMSUL_CACHE_DB** pointing to that database. Repeat for any Preview environment that uses API mode; keep preview and production databases separate.
4. Generate a secret locally with `openssl rand -hex 32`. Add it as the encrypted Pages secret **AMSUL_CACHE_WEBHOOK_SECRET**. Keep it stable and do not use a NEXT_PUBLIC prefix. Use the same value in Firebase below.
5. Existing API URL, tenant, media-signing secret and asset-origin settings stay unchanged. Build `npm run build`; output `out`.

## One-time Firebase setup

From `/Users/mac/Desktop/StruktHQ/AMSUL-Dashboard`:

```sh
npx -y firebase-tools@latest functions:secrets:set WEBSITE_CACHE_WEBHOOK_SECRET --project mt-cms-dashboard-staging
```

Enter the same secret when prompted. Append these non-secret values to `functions/.env.mt-cms-dashboard-staging`, preserving its other settings:

```dotenv
WEBSITE_CACHE_WEBHOOK_URL=https://amsul-website.pages.dev/api/website/invalidate
WEBSITE_CACHE_TENANT_ID=amsul
```

The canonical Pages hostname avoids custom-domain error-page rewriting. The destination must be HTTPS and end in `/api/website/invalidate`. Only the Firebase emulator permits HTTP loopback destinations. Do not point deployed triggers at localhost; Cloud Functions cannot reach your computer.

## Deploy

Configure D1 and the Pages secret, then deploy the website before the dashboard triggers. Avoid editorial changes during this short transition: the previous trigger version updates Firestore counters while the new website uses Cloudflare state. The first new website request fills a new cache namespace.

```sh
cd /Users/mac/Desktop/AMSUL-Website
git push origin main
```

After the Pages build succeeds, deploy the seven updated dashboard triggers from the clean commit below. No public API or App Hosting deployment is required:

```sh
cd /Users/mac/Desktop/StruktHQ/AMSUL-Dashboard
AMSUL_DEPLOY_DIR="$(mktemp -d /tmp/amsul-cache-push.XXXXXX)"
git worktree add --detach "$AMSUL_DEPLOY_DIR" d654019
cd "$AMSUL_DEPLOY_DIR"
npm ci
npm --prefix functions ci
cat >> functions/.env.mt-cms-dashboard-staging <<'ENV'
WEBSITE_CACHE_WEBHOOK_URL=https://amsul-website.pages.dev/api/website/invalidate
WEBSITE_CACHE_TENANT_ID=amsul
ENV
npx -y firebase-tools@latest deploy --project mt-cms-dashboard-staging --only functions:onWebsitePostChanged,functions:onWebsiteCategoryChanged,functions:onWebsiteEventChanged,functions:onWebsiteProgramChanged,functions:onWebsiteExecutiveChanged,functions:onWebsiteMediaChanged,functions:onWebsiteSponsorChanged
```

The deployment needs the new Firebase secret and the two non-secret environment values. No Firestore rules/index changes or migration/deletion of the old version documents are needed. The old `/v1/website/version` endpoint is legacy compatibility only; the new website never requests it.

## Verify

- Request `/api/website/version` on the website: this reads Cloudflare state, never Firebase.
- Load the feed twice: the second should report `X-Website-Cache: HIT` with no additional dashboard reads.
- Leave a tab idle or refocus it: no content/version checks should run.
- Edit/publish/unpublish a dashboard post, or change an event, executive, gallery or sponsor. Confirm the website revision changes; navigate/reload and verify updated content.
- Draft-to-draft edits of posts/events/programmes do not invalidate the public website.
- Repeat the same signed delivery: immediate retries do not increment again. Invalid signatures, wrong tenants and expired timestamps are rejected.
- Failed notifications throw so the Firebase trigger retries. Monitor trigger errors: a failed notification leaves old content cached until delivery succeeds.

## Local preview

```sh
cd /Users/mac/Desktop/AMSUL-Website
NEXT_PUBLIC_WEBSITE_DATA_SOURCE=api npm run dev
```

Open `http://127.0.0.1:3001`. The dev server uses live API reads with a local SQLite version table and local-only signing secrets inside ignored `.cloudflare/`. It needs no Cloudflare database or deployed webhook to preview the UI. React/CSS changes use the normal development hot reload. Gateway/server changes require restarting the local server.

After a dashboard data edit, simulate the notification locally, then navigate/reload:

```sh
npm run cache:invalidate
```

This affects only localhost, does not write to Firebase, and does not invalidate production. To use fictional fixtures instead, start with `NEXT_PUBLIC_WEBSITE_DATA_SOURCE=local npm run dev`. Production webhooks cannot automatically reach localhost; doing that requires an explicitly configured tunnel or local Firebase emulator.

References: [Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases), [D1 binding API](https://developers.cloudflare.com/d1/worker-api/).
