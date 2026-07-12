# CS Vertex Enterprise Platform

Welcome to the CS Vertex platform repository. This Next.js (Turbopack) application powers the primary corporate website, client portal, and enterprise backend for CS Vertex.

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS V4 + Vanilla CSS + Framer Motion
- **Database**: Prisma ORM (SQLite for Dev, PostgreSQL intended for Prod)
- **Email**: Resend (`src/lib/emailService.ts`)
- **PWA**: Fully installable Progressive Web App with offline caching

## Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cs-vertex-webpage
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Fill in your secure SMTP passwords, API keys, and database URL.
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Production Deployment Checklist

A new developer should follow these steps to deploy:
1. Ensure all environment variables are securely stored in your provider (Vercel/AWS).
2. Ensure `DATABASE_URL` points to a production PostgreSQL/MySQL instance (Do not use SQLite in serverless production).
3. Run `npm run build` to compile the optimized production bundle.
4. Run `npm run start` to boot the Node server.

## Scripts
- `npm run dev` - Starts the development server with Turbopack.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint.

## Contact
For infrastructure issues, contact `admin@csvertex.com`.
