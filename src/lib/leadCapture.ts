// Apps Script Web App URL — Deploy → New deployment → Web app,
// "Execute as: Me", "Who has access: Anyone". See scripts/apps-script/Code.gs.
//
// Until a real URL is pasted here the capture form never renders, so no
// visitor is shown a form that would silently drop their address.
const PLACEHOLDER = 'PASTE_APPS_SCRIPT_WEB_APP_URL';
// Typed as string, not inferred: otherwise the literal narrows and the
// comparison below stops compiling the moment a real URL is pasted in.
const ENDPOINT: string = PLACEHOLDER;

export const leadCaptureEnabled =
  ENDPOINT !== PLACEHOLDER && ENDPOINT.startsWith('https://');

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export async function submitLead(email: string, source: string) {
  // Apps Script Web Apps do not answer CORS preflight, so this goes as a
  // "simple" request — text/plain, no custom headers — in no-cors mode. The
  // POST arrives and is recorded, but the response is opaque and cannot be
  // read, so success here means "sent", not "stored". The Sheet is the
  // source of truth if a delivery is ever disputed.
  await fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      email: email.trim(),
      source,
      page: window.location.pathname,
      ts: new Date().toISOString(),
    }),
  });
}
