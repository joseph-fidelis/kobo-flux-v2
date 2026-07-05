# Security policy

## Supported versions


| Version         | Supported |
| --------------- | --------- |
| `main` (latest) | Yes       |
| Older tags      | No        |


## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security issue, report it privately to **[work@fidelisuwem.com](mailto:security@koboflux.example)**. Include:

- Description of the vulnerability
- Steps to reproduce
- Impact assessment (e.g. token exposure, SSRF, data leak)
- Affected version or commit hash

We aim to acknowledge reports within **5 business days** and provide a timeline for a fix when possible.

## Security model

KoboFlux is designed so that:

- **`NUXT_KOBO_API_TOKEN` is server-only** when set via environment variables — not exposed via `NUXT_PUBLIC_*`
- **Settings UI** (`/settings`) stores credentials in **HttpOnly session cookies**; the token is not readable by client JavaScript
- **Resolution order:** browser cookies override env vars when both token and base URL are present in cookies
- **Browser requests** go to same-origin routes (`/api/*`, `/me/*`), which proxy to Kobo with the resolved credentials
- **No end-user authentication** is built into v2 yet — anyone who can reach your deployment uses the configured Kobo token's permissions
- **Optional analytics** — when enabled, anonymous usage events and (after Kobo login) Kobo username/email may be sent to [PostHog](https://posthog.com) for product improvement. Set `NUXT_PUBLIC_POSTHOG_ENABLED=false` or omit `NUXT_PUBLIC_POSTHOG_KEY` to disable. Kobo API tokens and submission data are never sent.



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