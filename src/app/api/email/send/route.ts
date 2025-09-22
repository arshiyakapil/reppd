import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject,
      html
    });
    
    return NextResponse.json({ success: true, messageId: data.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

