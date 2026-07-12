# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-04
### Added
- Complete Progressive Web App (PWA) architecture.
- Advanced Service Worker with offline caching.
- Secure environment configuration and Next.js strict headers.
- GitHub Actions CI/CD pipelines.
- Prisma Database (`EmailLog`) schema.
- Resend Email Infrastructure with exponential backoff queuing.

### Secured
- Verified `.gitignore` prevents SQLite (`*.db`) leakage.
- Verified Zero hardcoded API keys in `src/`.
