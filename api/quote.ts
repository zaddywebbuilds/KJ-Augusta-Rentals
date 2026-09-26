export const config = { runtime: 'edge' };

const BASE = 'https://public.api.hospitable.com/v2';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const key = process.env.HOSPITABLE_API_KEY;
  if (!key) {
    return json({ error: 'Booking not configured' }, 500);
  }

  let body: { propertyId?: string; checkinDate?: string; checkoutDate?: string; adults?: number };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { propertyId, checkinDate, checkoutDate, adults = 2 } = body;
  if (!propertyId || !checkinDate || !checkoutDate) {
    return json({ error: 'propertyId, checkinDate and checkoutDate are required' }, 400);
  }

  const upstream = await fetch(`${BASE}/properties/${propertyId}/quote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      guests: { adults, children: 0, infants: 0 },
    }),
  });

  const data = await upstream.json();
  return json(data, upstream.status);
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
