# Deployment Guide

This platform is designed to be deployed seamlessly on **Vercel** with a managed PostgreSQL database.

## Prerequisites
1. A Vercel Account linked to your GitHub repository.
2. A managed PostgreSQL Database (Vercel Postgres, Supabase, Neon, or PlanetScale).
3. Cloudinary Account for Media Storage.
4. Brevo Account for SMTP Emails.

## Deployment Steps

1. **Push to GitHub**
   Ensure your latest code is on the `main` branch.

2. **Create Vercel Project**
   - Import the repository into Vercel.
   - Leave the Framework Preset as `Next.js`.
   - Leave the Build Command as `npm run build`.

3. **Configure Environment Variables**
   Before clicking "Deploy", add all the required environment variables found in `ENV_VARIABLES.md`.

4. **Initialize the Database**
   Once Vercel deploys, the site might error out if the DB isn't synced.
   - Connect to your Postgres DB locally or via Vercel's terminal.
   - Run `npx prisma db push` (or `npx prisma migrate deploy` if using migration files) targeting your Production `DATABASE_URL`.

5. **Verify Middleware**
   Ensure the `middleware.ts` is functioning correctly on the live domain, blocking unauthenticated `/api/admin` requests.

## Post-Deployment Checklist
- [ ] Submit a test Lead Form (`/contact`).
- [ ] Receive the confirmation email via Brevo.
- [ ] Log into `/admin/login` using your secure credentials.
- [ ] Upload an image in the Testimonial or Team section to test Cloudinary uploads.
