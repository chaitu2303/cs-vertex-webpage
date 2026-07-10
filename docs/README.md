# CS Vertex Platform

Welcome to the CS Vertex Platform repository. This repository contains the Next.js frontend, Admin Dashboard, Customer Portal, and automated Email (Brevo SMTP) integrations for CS Vertex.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database**: Prisma ORM with SQLite (local/dev) / PostgreSQL (production)
- **Styling**: Tailwind CSS
- **Authentication**: Next.js Middleware + custom JWT (Admin) & Supabase Auth (Portal)
- **Email**: Brevo SMTP integration
- **Storage**: Cloudinary (Image/PDF uploads)

## Project Structure
- `src/app`: Next.js App Router (Public site, `/admin`, `/portal`)
- `src/components`: Reusable UI components
- `src/lib`: Core utilities (Prisma client, Auth, Email, Uploaders)
- `prisma`: Database schema and migrations
- `docs`: Documentation guides

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the required keys. See `ENV_VARIABLES.md`.

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to view the site.
