// GET /api/config — exposes public front-end configuration.
// The Google client ID and the PostHog project key are both public by design;
// secrets never pass through here. Serving these at runtime means changing
// them in Vercel takes effect on refresh, with no code change or rebuild.
export const config = { runtime: 'edge' };
export default function handler() {
  return new Response(JSON.stringify({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    posthogKey: process.env.POSTHOG_KEY || process.env.VITE_POSTHOG_KEY || '',
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
