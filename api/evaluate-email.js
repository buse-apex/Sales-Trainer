// POST /api/evaluate-email — verifies the Apex session cookie, then proxies
// the email evaluation to Claude. Same session scheme as the Proof Finder.
export const config = { runtime: 'edge' };

async function hmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function validSession(cookieHeader, secret) {
  const m = /(?:^|;\s*)apex_session=([^;]+)/.exec(cookieHeader || '');
  if (!m) return false;
  const parts = m[1].split('.');
  if (parts.length !== 3) return false;
  const [emailB64, exp, sig] = parts;
  if (Date.now() / 1000 > Number(exp)) return false;
  const expect = await hmac(secret, emailB64 + '.' + exp);
  return sig === expect;
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json' }
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secret = process.env.SESSION_SECRET;
  if (!secret) return json({ error: 'Server not configured' }, 503);

  // Gate on the signed session cookie.
  if (!(await validSession(req.headers.get('cookie'), secret))) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'API key not configured' }, 500);

  let prompt = '';
  try { prompt = (await req.json()).prompt || ''; } catch (e) {}
  if (!prompt) return json({ error: 'Missing prompt' }, 400);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) {
      const t = await response.text();
      console.error('Anthropic API error:', response.status, t);
      return json({ error: 'AI evaluation unavailable. Try again.' }, 502);
    }
    const data = await response.json();
    const text = (data.content || []).map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    try {
      return json(JSON.parse(clean), 200);
    } catch (e) {
      console.error('Parse fail:', clean);
      return json({ error: 'AI returned an unexpected format. Try again.' }, 502);
    }
  } catch (err) {
    console.error('Function error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
}
