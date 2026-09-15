import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const dynamic = "force-dynamic";

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const json = (body: object, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return json({ success: false, message: "Please complete all fields." }, 400);
    }

    if (name.length > 120 || email.length > 320 || message.length > 10000) {
      return json({ success: false, message: "One or more fields are too long." }, 400);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return json({ success: false, message: "Please enter a valid email address." }, 400);
    }

    const from = process.env.SES_FROM_EMAIL;
    const to = process.env.SES_TO_EMAIL;

    if (!from || !to) {
      console.error("Missing SES_FROM_EMAIL or SES_TO_EMAIL environment variable.");
      return json({ success: false, message: "Email service is not configured yet." }, 500);
    }

    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: [email],
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: `Portfolio contact from ${name}`,
          },
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            },
          },
        },
      }),
    );

    return json({ success: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return json(
      { success: false, message: "Couldn't send your message right now. Please try again later." },
      500,
    );
  }
}
