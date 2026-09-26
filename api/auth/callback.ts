export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return html(`<h2>Authorization failed</h2><p>${error ?? 'No code received'}</p>`);
  }

  const clientId     = process.env.HOSPITABLE_CLIENT_ID;
  const clientSecret = process.env.HOSPITABLE_CLIENT_SECRET;
  const redirectUri  = process.env.HOSPITABLE_REDIRECT_URI
    ?? new URL('/api/auth/callback', url.origin).toString();

  if (!clientId || !clientSecret) {
    return html('<h2>Server error</h2><p>OAuth credentials not configured.</p>');
  }

  const tokenRes = await fetch('https://auth.hospitable.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type:    'authorization_code',
      code,
      client_id:     clientId,
      client_secret: clientSecret,
      redirect_uri:  redirectUri,
    }),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok) {
    return html(`<h2>Token exchange failed</h2><pre>${JSON.stringify(data, null, 2)}</pre>`);
  }

  const { access_token, refresh_token, expires_in } = data;

  return html(`
    <h2 style="color:#2d6a4f">✓ Hospitable account connected</h2>
    <p>Copy the values below into Vercel → Settings → Environment Variables,
       then redeploy. The access token expires in ${Math.round(expires_in / 3600)}h —
       use the refresh token to renew it.</p>
    <table>
      <tr><td><b>HOSPITABLE_API_KEY</b></td><td><code>${access_token}</code></td></tr>
      <tr><td><b>HOSPITABLE_REFRESH_TOKEN</b></td><td><code>${refresh_token ?? '(none)'}</code></td></tr>
    </table>
    <style>
      body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      td { padding: 10px; border: 1px solid #ccc; word-break: break-all; }
      code { font-size: 12px; background: #f4f4f4; padding: 2px 4px; }
    </style>
  `);
}

function html(body: string) {
  return new Response(`<!doctype html><html><body>${body}</body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
