# Project Rules (RULES.md)

This file tracks rules and instructions before starting work.

## Current Task: Security Hardening & Performance Optimization
- [ ] Identify potential attack vectors.
- [ ] Audit Supabase RLS (Row Level Security).
- [ ] Implement Rate Limiting and Anti-spam measures.
- [ ] Optimize asset loading and bundle size.

## General Rules
1. Focus only on the rule block relevant to the current task.
2. Read only the specific section being worked on to maintain focus.
3. **DO NOT CHANGE EXISTING DESIGN, VISUALS, OR CORE MECHANICS.** The project is considered "Ready" (Production). Focus strictly on security (behind the scenes), speed, and SEO improvements.

## Security (Completed)
- **Hardened Upload API**: Authentication requirement, file size limits (5MB), and mime-type whitelist.
- **Secure Order Flow**: Moved order calculation to the server to prevent price manipulation.
- **Rate Limiting**: Implemented IP-based limit for order submissions.
- **Database RLS**: Prepared SQL script for mandatory Supabase Row Level Security.
- **Security Headers**: Implemented nosniff, HSTS, XSS Protection, and Frame Options in `next.config.js`.
- **SEO Ready**: Dynamic robots.txt and sitemap.xml implemented.
- **Optimized Assets**: Replaced massive 870KB favicon with 276KB version.
