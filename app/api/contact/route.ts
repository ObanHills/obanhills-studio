// app/api/contact/route.ts
// POST /api/contact — validates the inquiry form and sends an email via Resend.
// Requires RESEND_API_KEY in environment variables.
// Falls back gracefully with a clear error if the key is missing.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT = "Obanhillsconnect@gmail.com";
const FROM = "ObanHills Studio <onboarding@resend.dev>"; // swap to your verified domain once set up

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured. Please contact directly." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  // Server-side validation
  if (
    typeof name !== "string" || name.trim().length < 2 ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof message !== "string" || message.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Please fill in all fields correctly." },
      { status: 400 }
    );
  }

  // Content length guard — prevent abuse
  if (name.length > 120 || email.length > 200 || message.length > 4000) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM,
    to: RECIPIENT,
    replyTo: email.trim(),
    subject: `Project Inquiry from ${name.trim()} — ObanHills Studio`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
        <div style="background:#07090e;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#00e5a3;font-size:20px;margin:0;letter-spacing:0.05em">
            OBAN<span style="color:#fff">HILLS</span>
          </h1>
          <p style="color:#ffffff80;font-size:11px;margin:4px 0 0;letter-spacing:0.15em;text-transform:uppercase">
            New Project Inquiry
          </p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:600;color:#64748b;width:100px;text-transform:uppercase;letter-spacing:0.05em">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a">${escapeHtml(name.trim())}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a">
                <a href="mailto:${escapeHtml(email.trim())}" style="color:#0d9488">${escapeHtml(email.trim())}</a>
              </td>
            </tr>
          </table>
          <h3 style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 10px">Message</h3>
          <p style="font-size:14px;line-height:1.7;color:#334155;white-space:pre-wrap;margin:0;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">${escapeHtml(message.trim())}</p>
          <p style="margin:24px 0 0;font-size:11px;color:#94a3b8">
            Sent via obanhills.vercel.app contact form
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("[contact/route]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or contact directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
