import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, message, hp } = await req.json();

    // Honeypot (spam trap)
    if (hp) return new Response("OK", { status: 200 });

    if (!full_name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    // Nodemailer transporter for Zoho
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: String(process.env.ZOHO_SMTP_SECURE) === "true", // true for 465, false for 587
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    const to = process.env.CONTACT_TO || process.env.ZOHO_USER!;
    const from = process.env.CONTACT_FROM || `Trackify <${process.env.ZOHO_USER}>`;

    const html = `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(full_name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from,
      to,
      replyTo: email, // so you can reply directly to sender
      subject: `Contact Form — ${full_name}`,
      html,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact api error:", err);
    return new Response("Server error", { status: 500 });
  }
}

// basic HTML escape
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
