# Formspree contact form setup

The contact forms on `/de/kontakt/` and `/en/contact/` submit directly to
Formspree.

## Required setup

1. Create a Formspree form.
2. Copy its endpoint. It looks like:

   `https://formspree.io/f/xxxxxxxx`

3. Replace `FORM_ID_EINTRAGEN` in both files:

   - `de/kontakt/index.html`
   - `en/contact/index.html`

4. Commit and deploy.
5. Submit the form once and confirm the Formspree activation email if required.

The form includes a honeypot field named `_gotcha` and sends the visitor's
name, email, subject, message, language, and page URL.
