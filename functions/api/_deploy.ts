/**
 * Triggers a Cloudflare Pages Deploy Hook to rebuild the static Astro storefront
 * after an authenticated admin makes a product mutation in D1.
 *
 * Requirements:
 * - Read deploy hook URL exclusively from CF_DEPLOY_HOOK_URL or CLOUDFLARE_DEPLOY_HOOK_URL secret
 * - Never log or expose the secret URL in logs, responses, or client payloads
 * - Non-blocking / fail-safe: if trigger fails, do not throw or rollback D1 mutation
 */
export async function triggerStorefrontDeploy(env: any, reason: string): Promise<boolean> {
  const hookUrl = env?.CF_DEPLOY_HOOK_URL || env?.CLOUDFLARE_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    console.warn(`[Deploy] No deploy hook URL configured in environment secrets. Skipping storefront build trigger for: ${reason}`);
    return false;
  }

  try {
    const res = await fetch(hookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'fitmonk-admin-d1',
        reason
      })
    });

    if (!res.ok) {
      console.warn(`[Deploy] Deploy hook returned HTTP ${res.status} for: ${reason}`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`[Deploy] Failed to trigger deploy hook for: ${reason}`, err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
}
