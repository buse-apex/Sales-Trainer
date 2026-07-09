// Apex Objection Playbook — session gate (Google sign-in)
// Same pattern as the Apex Proof Finder. Verifies the signed session cookie
// before serving the app. Login page, auth endpoints, and static build assets
// stay open so the sign-in screen can load.
//
// Required environment variable:
//   SESSION_SECRET — a long random string used to sign session cookies.

export const config = {
  matcher: ['/((?!assets/|login.html|favicon.svg|api/auth|api/config|api/logout).*)'],
};

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

export default async function middleware(req) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return new Response(
      'This site is not configured yet. In Vercel, open Settings, then Environment Variables, and add SESSION_SECRET, GOOGLE_CLIENT_ID, and ALLOWED_EMAILS or ALLOWED_DOMAIN, then redeploy.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  if (await validSession(req.headers.get('cookie'), secret)) return;

  return Response.redirect(new URL('/login.html', req.url), 302);
}
