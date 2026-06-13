import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, property_id } = await req.json();
    if (!name || !email) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    await sql`
      INSERT INTO vr_leads (property_id, name, email, phone, message)
      VALUES (${property_id || null}, ${name}, ${email}, ${phone || null}, ${message || null})
    `;

    // Email de notificación al agente
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'V-Realty <no-reply@vmomentums.info>',
      to: ['luisdelator@vmomentums.info'],
      subject: `Nuevo lead: ${name} | V-Realty`,
      html: \`
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#e8e8e8;padding:32px;border-radius:12px">
          <h1 style="color:#C9A84C;font-size:24px">Nuevo Lead — V-Realty</h1>
          <p><strong>Nombre:</strong> \${name}</p>
          <p><strong>Email:</strong> \${email}</p>
          <p><strong>Teléfono:</strong> \${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong> \${message || '—'}</p>
          \${property_id ? \`<p><strong>Propiedad ID:</strong> \${property_id}</p>\` : ''}
          <hr style="border-color:#333;margin:24px 0"/>
          <p style="color:#6b6b6b;font-size:12px">V-Realty — Sistema de propiedades</p>
        </div>
      \`,
    });

    // Email de confirmación al lead
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'V-Realty <no-reply@vmomentums.info>',
      to: [email],
      subject: 'Recibimos tu solicitud — V-Realty',
      html: \`
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#e8e8e8;padding:32px;border-radius:12px">
          <h1 style="color:#C9A84C">Hola \${name},</h1>
          <p>Recibimos tu solicitud. Uno de nuestros asesores se pondrá en contacto contigo en menos de 24 horas.</p>
          <p style="color:#6b6b6b;font-size:12px;margin-top:32px">V-Realty — vmomentums.info</p>
        </div>
      \`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
