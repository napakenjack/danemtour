// Уведомление на email о новой заявке с сайта.
// Триггерится Database Webhook на INSERT в public.leads
// (настраивается в Supabase Dashboard → Database → Webhooks, см. README).
//
// Требует секрет: supabase secrets set RESEND_API_KEY=<ключ с resend.com>

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_TO = Deno.env.get('LEAD_NOTIFY_EMAIL') ?? 'danemtour@gmail.com';
const FROM_EMAIL = Deno.env.get('LEAD_FROM_EMAIL') ?? 'danem tour <onboarding@resend.dev>';

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  tour_title: string | null;
  message: string | null;
  source: string;
  created_at: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: LeadRecord;
  schema: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Email service is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const lead = payload.record;
  if (!lead?.name || !lead?.phone) {
    return new Response(JSON.stringify({ error: 'Malformed lead record' }), { status: 400 });
  }

  const html = `
    <h2>Новая заявка с сайта danem tour</h2>
    <p><strong>Имя:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(lead.phone)}</p>
    ${lead.tour_title ? `<p><strong>Направление:</strong> ${escapeHtml(lead.tour_title)}</p>` : ''}
    ${lead.message ? `<p><strong>Комментарий:</strong> ${escapeHtml(lead.message)}</p>` : ''}
    <p><strong>Источник:</strong> ${escapeHtml(lead.source)}</p>
    <p style="color:#888;font-size:12px">Заявка №${lead.id} · ${lead.created_at}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_TO],
      subject: `Новая заявка: ${lead.name}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Resend error', res.status, text);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
