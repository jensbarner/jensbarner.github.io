# Formspree contact form setup

The contact forms on `/de/kontakt/` and `/en/contact/` submit directly to
Formspree:

`https://formspree.io/f/mzdlpgqe`

## Required setup

1. Keep the Formspree endpoint active.
2. Submit the form once after deployment.
3. Confirm the Formspree activation email if required.

The form includes a honeypot field named `_gotcha` and sends the visitor's
name, email, subject, message, language, and page URL.
