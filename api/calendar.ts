export const config = { runtime: 'edge' };

const BASE = 'https://public.api.hospitable.com/v2';

export default async function handler(req: Request): Promise<Response> {
  const key = process.env.HOSPITABLE_API_KEY;
  if (!key) return json({ error: 'Booking not configured' }, 500);

  const url = new URL(req.url);
  const propertyId = url.searchParams.get('propertyId');
  const startDate  = url.searchParams.get('startDate');
  const endDate    = url.searchParams.get('endDate');

  if (!propertyId || !startDate || !endDate) {
    return json({ error: 'propertyId, startDate and endDate are required' }, 400);
  }

  const upstream = await fetch(
    `${BASE}/properties/${propertyId}/calendar?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
    }
  );

  const raw = await upstream.json();
  if (!upstream.ok) return json(raw, upstream.status);

  // Strip internal pricing — only send availability status to the browser
  const days = (raw?.data?.days ?? []).map((d: {
    date: string;
    status: { available: boolean };
    closed_for_checkin: boolean;
    closed_for_checkout: boolean;
  }) => ({
    date: d.date,
    available: d.status?.available ?? false,
    noCheckin:  d.closed_for_checkin,
    noCheckout: d.closed_for_checkout,
  }));

  return json({ days });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
