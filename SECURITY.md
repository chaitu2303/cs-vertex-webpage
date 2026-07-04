# Security Policy

## Supported Versions
Only the latest major version (v1.x) of the CS Vertex platform receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Security is a top priority for CS Vertex. If you discover a security vulnerability within this project, please send an email to **admin@csvertex.com**. 
We will respond within 24 hours.

**Please do not report security vulnerabilities through public GitHub issues.**

## Environment Security
- Never commit `.env` files.
- Always use `npm audit` to check for dependency vulnerabilities.
- Ensure all API routes are protected using appropriate Server Actions / Middleware authentication checks.
