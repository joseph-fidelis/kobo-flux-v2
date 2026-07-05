# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` (latest) | Yes |
| Older tags | No |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security issue, report it privately to **security@koboflux.example** (replace with your project contact). Include:

- Description of the vulnerability
- Steps to reproduce
- Impact assessment (e.g. token exposure, SSRF, data leak)
- Affected version or commit hash

We aim to acknowledge reports within **5 business days** and provide a timeline for a fix when possible.

## Security model

KoboFlux is designed so that:

- **`NUXT_KOBO_API_TOKEN` is server-only** — configured in Nitro `runtimeConfig`, not exposed via `NUXT_PUBLIC_*`
- **Browser requests** go to same-origin routes (`/api/*`, `/me/*`), which proxy to Kobo with the server token
- **No end-user authentication** is built into v2 yet — anyone who can reach your deployment uses the configured Kobo token's permissions

### Deployment recommendations

- Run KoboFlux behind HTTPS in production
- Restrict network access (VPN, IP allowlist, or internal network) if the app is not intended to be public
- Use a Kobo API token with the **minimum permissions** required for your use case
- Rotate tokens if you suspect compromise
- Do not commit `.env` or tokens to version control

## Out of scope

The following are generally **not** considered vulnerabilities in this project:

- Issues that require an attacker to already have access to your server environment variables
- Misconfiguration when operators deploy with overly permissive tokens or public internet exposure by choice
- Vulnerabilities in upstream KoboToolbox servers (report those to KoboToolbox directly)

Thank you for helping keep KoboFlux and its users safe.
