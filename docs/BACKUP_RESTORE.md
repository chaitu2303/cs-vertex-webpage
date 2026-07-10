# Backup & Restore Guide

Because the application relies heavily on Prisma ORM and a relational database, backups are managed at the database level.

## PostgreSQL Environments (Production)
If you are using Vercel Postgres, Supabase, or another managed provider:
1. **Automated Backups**: Most managed providers include automated daily backups. Check your provider's dashboard for retention periods.
2. **Manual Exports**: Use `pg_dump` to extract a raw SQL copy of your database:
   ```bash
   pg_dump -U username -h hostname -d databasename > cs_vertex_backup.sql
   ```
3. **Restoring**:
   ```bash
   psql -U username -h hostname -d databasename < cs_vertex_backup.sql
   ```

## SQLite Environments (Local / Dev)
In local development, the database is stored in `prisma/dev.db`.
1. **Backup**: Simply copy and paste the `dev.db` file to a secure location.
2. **Restore**: Replace the active `dev.db` with your backup copy.

## Media Files
All images and PDFs uploaded via the CMS are stored in **Cloudinary**.
To backup media, you can use Cloudinary's built-in backup solutions or write a script to download assets by parsing the database URLs.
