# Environment Variables

The platform requires the following environment variables to function correctly in production.

## Database
`DATABASE_URL` - The connection string to your PostgreSQL / SQLite database.

## Admin Authentication
`JWT_SECRET` - A strong, random string used to sign JSON Web Tokens for the Admin Portal.
(e.g., `openssl rand -base64 32`)

## Brevo SMTP (Emails)
`SMTP_HOST` = smtp-relay.brevo.com
`SMTP_PORT` = 587
`SMTP_USER` = your-brevo-login-email
`SMTP_PASS` = your-brevo-smtp-key
`MAIL_FROM` = hello@csvertex.com
`MAIL_FROM_NAME` = "CS Vertex"

## Cloudinary (Media Uploads)
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = Your Cloud Name
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = An unsigned upload preset name

## Supabase (Customer Portal Auth)
`NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
`NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
