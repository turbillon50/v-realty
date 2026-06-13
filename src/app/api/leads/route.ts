import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL || 'V-Realty <no-reply@vmomentums.info>';
const ADMIN_EMAIL = 'luisdelator@vmomentums.info';

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, property_id } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Save lead to DB
    await sql`
      INSERT INTO vr_leads (property_id, name, email, phone, message)
      VALUES (${property_id || null}, ${name}, ${email}, ${phone || null}, ${message || null})
    `;

    const propLine = property_id ? `<p><strong>Propiedad ID:</strong> ${property_id}</p>` : '';

    // Notify admin
    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `Nuevo lead: ${name} | V-Realty`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#e8e8e8;padding:32px;border-radius:12px">
          <h1 style="color:#C9A84C">Nuevo Lead — V-Realty</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
          <p><strong>Mensaje:</strong> ${message || '—'}</p>
          ${propLine}
        </div>`,
    });

    // Confirm to lead
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: 'Recibimos tu solicitud — V-Realty',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#e8e8e8;padding:32px;border-radius:12px">
          <h1 style="color:#C9A84C">Hola ${name},</h1>
          <p>Recibimos tu solicitud. Un asesor te contactará en menos de 24 horas.</p>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
