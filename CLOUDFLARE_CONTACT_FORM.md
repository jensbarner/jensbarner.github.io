# Cloudflare contact form setup

The contact form posts to `/api/contact`, which is handled by the Cloudflare
Pages Function in `functions/api/contact.js`.

## Required Cloudflare setup

1. Enable Cloudflare Email Service / Email Sending for `jensbarner.com`.
2. Verify the sender address used by the function:
   `info@jensbarner.com`
3. Create a Cloudflare API token with permission to send emails.
4. In the Cloudflare Pages project, add these production environment variables:

   - `CF_ACCOUNT_ID`
   - `CF_EMAIL_API_TOKEN`

5. Redeploy the Pages project after adding the variables.

Messages are sent to:

`info@jensbarner.com`

The visitor's email address is included in the message body.
