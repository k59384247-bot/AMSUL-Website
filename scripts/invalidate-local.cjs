// Manual local notification for testing dashboard edits without a public tunnel.
const { loadEnvConfig } = require('@next/env');
const { readFileSync } = require('node:fs');
const { createHmac, randomUUID } = require('node:crypto');
loadEnvConfig(process.cwd(), true);
async function main() {
  const secrets = JSON.parse(readFileSync('.cloudflare/local-secrets.json', 'utf8'));
  const secret = process.env.AMSUL_CACHE_WEBHOOK_SECRET || secrets.webhook;
  const body = JSON.stringify({ tenantId: process.env.AMSUL_TENANT_ID || 'amsul', eventId: `local-${randomUUID()}` });
  const timestamp = new Date().toISOString();
  const response = await fetch(`http://127.0.0.1:${process.env.PORT || 3001}/api/website/invalidate`, {
    method: 'POST', body, headers: { 'Content-Type': 'application/json', 'X-AMSUL-Webhook-Timestamp': timestamp, 'X-AMSUL-Webhook-Signature': `v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('base64')}` },
  });
  if (!response.ok) throw new Error(`Local invalidation failed (${response.status}). Start the dev server in API mode first.`);
  console.log('Local website cache invalidated. Reload or navigate to see fresh dashboard content.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
