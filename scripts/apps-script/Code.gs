/**
 * Lead capture backend — KJ Augusta Rentals
 * ─────────────────────────────────────────────
 * Receives the site's email signups, appends them to a Google Sheet, adds
 * them to a Resend audience, and sends the welcome email.
 *
 * SETUP
 * 1. Create a Google Sheet. Row 1 headers: Timestamp | Email | Source | Page
 * 2. Extensions → Apps Script. Paste this file in, replacing Code.gs.
 * 3. Project Settings → Script Properties, add:
 *      RESEND_API_KEY      re_xxxxxxxx           (resend.com → API Keys)
 *      FROM_EMAIL          KJ Augusta Rentals <hello@kjaugustarentals.com>
 *      GUIDE_URL           https://kjaugustarentals.com/augusta-guide.pdf
 *      RESEND_AUDIENCE_ID  (optional — enables broadcasts later)
 * 4. Verify kjaugustarentals.com in Resend → Domains, and add the SPF and
 *    DKIM records it gives you. Sending from an unverified domain will fail.
 * 5. Deploy → New deployment → Web app.
 *      Execute as:     Me
 *      Who has access: Anyone
 *    Copy the /exec URL into ENDPOINT in src/lib/leadCapture.ts.
 *
 * Re-deploy (Deploy → Manage deployments → Edit → New version) after any
 * edit here, or the live URL keeps serving the old code.
 */

const SHEET_NAME = 'Leads';

function prop(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json({ ok: true, service: 'kj-lead-capture' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const email = String(body.email || '').trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return json({ ok: false, error: 'invalid email' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    // A visitor who signs up twice should not get the email twice, and the
    // Sheet is the list KJ actually looks at.
    const existing = sheet.getRange(1, 2, Math.max(sheet.getLastRow(), 1), 1)
      .getValues()
      .map(function (r) { return String(r[0]).trim().toLowerCase(); });

    if (existing.indexOf(email) !== -1) {
      return json({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      new Date(),
      email,
      body.source || '',
      body.page || '',
    ]);

    addToAudience(email);
    sendWelcome(email);

    return json({ ok: true });
  } catch (err) {
    // Logged to Executions in the Apps Script console. The browser cannot
    // read this response anyway, so failures are diagnosed here.
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

/** Adds the contact to a Resend audience so broadcasts can reach them later. */
function addToAudience(email) {
  const audienceId = prop('RESEND_AUDIENCE_ID');
  if (!audienceId) return;

  UrlFetchApp.fetch('https://api.resend.com/audiences/' + audienceId + '/contacts', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + prop('RESEND_API_KEY') },
    payload: JSON.stringify({ email: email, unsubscribed: false }),
    muteHttpExceptions: true,
  });
}

function sendWelcome(email) {
  const guideUrl = prop('GUIDE_URL');

  const html =
    '<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1C1C1A">' +
      '<p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;' +
        'text-transform:uppercase;color:#9A7B3F;margin:0 0 14px">Free Augusta Guide</p>' +
      '<h1 style="font-size:27px;line-height:1.2;font-weight:600;margin:0 0 18px">' +
        'Here is your Augusta guide</h1>' +
      '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;margin:0 0 18px">' +
        'Thanks for asking for it. Inside you will find the restaurants locals actually ' +
        'book, how to handle Masters Week parking and traffic, and the best spots along ' +
        'the Savannah River.</p>' +
      (guideUrl
        ? '<p style="margin:0 0 24px"><a href="' + guideUrl + '" ' +
          'style="display:inline-block;background:#1C1C1A;color:#FAF7F2;text-decoration:none;' +
          'font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1.5px;' +
          'text-transform:uppercase;padding:14px 26px">Read the guide</a></p>'
        : '') +
      '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;margin:0 0 18px">' +
        'When you are ready to visit, we are three private acres on the river, fifteen ' +
        'minutes from Augusta National on a back route that skips the traffic. ' +
        '<a href="https://kjaugustarentals.com" style="color:#9A7B3F">See the dates that are open</a>.</p>' +
      '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;margin:0">' +
        'KJ<br><span style="color:#6B6B66">KJ Augusta Rentals</span></p>' +
    '</div>';

  const res = UrlFetchApp.fetch('https://api.resend.com/emails', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + prop('RESEND_API_KEY') },
    payload: JSON.stringify({
      from: prop('FROM_EMAIL'),
      to: [email],
      subject: 'Your Augusta guide',
      html: html,
    }),
    muteHttpExceptions: true,
  });

  if (res.getResponseCode() >= 300) {
    console.error('Resend send failed: ' + res.getContentText());
  }
}
