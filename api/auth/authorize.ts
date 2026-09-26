export default function handler(req: Request): Response {
  const clientId = process.env.HOSPITABLE_CLIENT_ID;
  if (!clientId) {
    return new Response('HOSPITABLE_CLIENT_ID not set', { status: 500 });
  }

  const redirectUri = process.env.HOSPITABLE_REDIRECT_URI
    ?? new URL('/api/auth/callback', new URL(req.url).origin).toString();

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         'properties:read bookings:read bookings:write',
  });

  return Response.redirect(
    `https://auth.hospitable.com/oauth/authorize?${params}`,
    302
  );
}
