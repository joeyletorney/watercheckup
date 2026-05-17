import { stateLabel } from '@/lib/us-state-names';

export type UtilityClaimPayload = {
  utilityName: string;
  pwsid: string;
  state: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  utilityWebsite?: string;
  message?: string;
  authorized: boolean;
  ccrPdf?: { filename: string; contentBase64: string } | null;
};

export type UtilityClaimValidation = {
  ok: true;
  data: UtilityClaimPayload;
} | {
  ok: false;
  error: string;
};

function str(v: unknown, max = 500): string {
  const t = typeof v === 'string' ? v.trim() : '';
  if (t.length > max) return t.slice(0, max);
  return t;
}

export function parseUtilityClaimFromJson(body: Record<string, unknown>): UtilityClaimValidation {
  const utilityName = str(body.utilityName, 200);
  const pwsid = str(body.pwsid, 32).toUpperCase();
  const state = str(body.state, 4).toUpperCase();
  const contactName = str(body.contactName, 120);
  const contactTitle = str(body.contactTitle, 120);
  const email = str(body.email, 320);
  const phone = str(body.phone, 40);
  const utilityWebsite = str(body.utilityWebsite, 500);
  const message = str(body.message, 4000);
  const authorized = body.authorized === true || body.authorized === 'true' || body.authorized === 'on';

  if (!utilityName || !pwsid || !state || !contactName || !contactTitle || !email.includes('@') || !phone) {
    return {
      ok: false,
      error:
        'Utility name, PWSID, state, contact name, title, email, and phone are required.',
    };
  }

  if (!authorized) {
    return { ok: false, error: 'You must confirm you are an authorized representative of this utility.' };
  }

  return {
    ok: true,
    data: {
      utilityName,
      pwsid,
      state,
      contactName,
      contactTitle,
      email,
      phone,
      utilityWebsite: utilityWebsite || undefined,
      message: message || undefined,
      authorized: true,
      ccrPdf: null,
    },
  };
}

export async function parseUtilityClaimMultipart(req: Request): Promise<UtilityClaimValidation> {
  const form = await req.formData();
  const body: Record<string, unknown> = {
    utilityName: form.get('utilityName'),
    pwsid: form.get('pwsid'),
    state: form.get('state'),
    contactName: form.get('contactName'),
    contactTitle: form.get('contactTitle'),
    email: form.get('email'),
    phone: form.get('phone'),
    utilityWebsite: form.get('utilityWebsite'),
    message: form.get('message'),
    authorized: form.get('authorized'),
  };

  const parsed = parseUtilityClaimFromJson(body);
  if (!parsed.ok) return parsed;

  const file = form.get('ccrPdf');
  if (!file || !(file instanceof File) || file.size === 0) {
    return parsed;
  }

  const maxBytes = 4 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, error: 'CCR PDF must be 4 MB or smaller.' };
  }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { ok: false, error: 'CCR upload must be a PDF file.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^\w.\-]+/g, '_').slice(0, 120) || 'ccr.pdf';

  return {
    ok: true,
    data: {
      ...parsed.data,
      ccrPdf: {
        filename: safeName,
        contentBase64: buffer.toString('base64'),
      },
    },
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendUtilityClaimNotification(
  data: UtilityClaimPayload,
  meta: { clientIp: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const notifyTo = process.env.UTILITY_CLAIM_NOTIFY_EMAIL?.trim() || 'joe@watercheckup.com';
  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'WaterCheckup <onboarding@resend.dev>';
  const stateName = stateLabel(data.state);

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — utility claim logged only', {
      utility: data.utilityName,
      pwsid: data.pwsid,
    });
    return { ok: true };
  }

  const rows: [string, string][] = [
    ['Utility name', data.utilityName],
    ['PWSID', data.pwsid],
    ['State', `${data.state} (${stateName})`],
    ['Contact name', data.contactName],
    ['Title / role', data.contactTitle],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Utility website', data.utilityWebsite || '—'],
    ['CCR PDF attached', data.ccrPdf ? `Yes (${data.ccrPdf.filename})` : 'No'],
    ['Authorized representative', 'Yes'],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#94a3b8;vertical-align:top;">${esc(label)}</td><td style="padding:8px 0;color:#e2e8f0;">${label === 'Email' ? `<a href="mailto:${esc(value)}" style="color:#22d3ee;">${esc(value)}</a>` : esc(value)}</td></tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#0a1628;font-family:system-ui,sans-serif;color:#e2e8f0;padding:24px;">
  <h1 style="font-size:18px;color:#67e8f9;">New utility CCR claim — WaterCheckup</h1>
  <table style="border-collapse:collapse;font-size:14px;max-width:560px;">${tableRows}</table>
  ${
    data.message
      ? `<p style="margin-top:20px;font-size:14px;"><strong style="color:#cbd5e1;">Message / notes</strong><br/>${esc(data.message).replace(/\n/g, '<br/>')}</p>`
      : ''
  }
  <p style="margin-top:24px;font-size:12px;color:#64748b;">IP: ${esc(meta.clientIp)} · ${new Date().toISOString()}</p>
</body></html>`;

  const payload: Record<string, unknown> = {
    from,
    to: [notifyTo],
    reply_to: data.email,
    subject: `New Utility Claim: ${data.utilityName} - ${data.state}`,
    html,
  };

  if (data.ccrPdf) {
    payload.attachments = [
      {
        filename: data.ccrPdf.filename,
        content: data.ccrPdf.contentBase64,
      },
    ];
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const resBody = (await r.json().catch(() => ({}))) as { message?: string };
  if (!r.ok) {
    return { ok: false, error: resBody.message || 'Could not send claim notification.' };
  }

  return { ok: true };
}
