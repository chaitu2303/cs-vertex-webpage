# Environment Variables

The platform requires the following environment variables to function correctly in production.

## Database
`DATABASE_URL` - The connection string to your PostgreSQL / SQLite database.

## Admin Authentication
`JWT_SECRET` - A strong, random string used to sign JSON Web Tokens for the Admin Portal.
(e.g., `openssl rand -base64 32`)

## Resend (Emails)
`RESEND_API_KEY` = re_xxxxxxxxxxxxx
`EMAIL_FROM` = CS Vertex <hello@csvertex.com>
`EMAIL_REPLY_TO` = hello@csvertex.com

## Cloudinary (Media Uploads)
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = Your Cloud Name
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = An unsigned upload preset name

## Supabase (Customer Portal Auth)
`NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
`NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
