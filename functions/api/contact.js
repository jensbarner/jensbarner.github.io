const CONTACT_TO = "info@jensbarner.com";
const CONTACT_FROM = "info@jensbarner.com";
const MAX_FIELD_LENGTH = 2000;

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse({ ok: false, message: "Invalid request." }, 415);
    }

    const payload = await request.json();
    const submittedAt = Number(payload.submittedAt || 0);
    const elapsed = Date.now() - submittedAt;

    if (payload.website) {
      return jsonResponse({ ok: true });
    }

    if (!submittedAt || elapsed < 2500) {
      return jsonResponse({ ok: false, message: "Please try again." }, 400);
    }

    const name = cleanField(payload.name, 120);
    const email = cleanField(payload.email, 180);
    const subject = cleanField(payload.subject, 160) || "Kontaktformular";
    const message = cleanField(payload.message, MAX_FIELD_LENGTH);
    const pageLanguage = cleanField(payload.language, 12);

    if (!name || !email || !message || !isValidEmail(email)) {
      return jsonResponse(
        { ok: false, message: "Please complete all required fields." },
        400
      );
    }

    if (!context.env.CF_ACCOUNT_ID || !context.env.CF_EMAIL_API_TOKEN) {
      console.error("Missing Cloudflare Email Service credentials.");
      return jsonResponse(
        { ok: false, message: "Email service is not configured yet." },
        500
      );
    }

    const userAgent = request.headers.get("user-agent") || "Unknown";
    const ipCountry = request.cf?.country || "Unknown";
    const createdAt = new Date().toISOString();

    const text = [
      "Neue Nachricht vom Kontaktformular",
      "",
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Betreff: ${subject}`,
      `Sprache: ${pageLanguage || "unknown"}`,
      `Land: ${ipCountry}`,
      `Zeitpunkt: ${createdAt}`,
      "",
      "Nachricht:",
      message,
      "",
      `User-Agent: ${userAgent}`
    ].join("\n");

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${context.env.CF_ACCOUNT_ID}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${context.env.CF_EMAIL_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: CONTACT_TO,
          from: CONTACT_FROM,
          subject: `Kontaktformular: ${subject}`,
          text
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare Email Service error:", errorText);
      return jsonResponse(
        { ok: false, message: "The message could not be sent." },
        502
      );
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonResponse(
      { ok: false, message: "The message could not be sent." },
      500
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function cleanField(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://jensbarner.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
