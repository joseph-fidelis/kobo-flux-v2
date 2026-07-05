# Docker Hub listing copy


---

## Short description (Overview — max ~100 characters)

```
Open-source web UI for KoboToolbox: forms, submissions, bulk upload. Node 22, port 3000.
```

Alternative (shorter):

```
KoboFlux v2 — modern KoboToolbox dashboard. Run with docker compose and your API token.
```

---

## Full description

Copy everything below into **Full description**:

---

# KoboFlux v2

**KoboFlux v2** is an open-source web interface for [KoboToolbox](https://www.kobotoolbox.org/). Browse forms, view submissions, export data, and bulk-upload Excel rows — with your Kobo API token kept on the server, never in the browser.

> Independent project — not affiliated with KoboToolbox.

## Image

| Registry | Tag examples |
|----------|----------------|
| `josephfidelis/koboflux-v2` | `latest`, `1.0.0`, git SHA |

## Requirements

- Docker 24+ or Docker Compose v2
- A [KoboToolbox API token](https://kf.kobotoolbox.org/token/) (global server) or [EU token](https://eu.kobotoolbox.org/token/)

## Quick start — Docker Compose (recommended)

**1.** Create a `.env` file next to `docker-compose.yml`:

```env
NUXT_KOBO_API_TOKEN=your_kobo_api_token_here
NUXT_KOBO_BASE_URL=https://kf.kobotoolbox.org
NUXT_PUBLIC_APP_NAME=KoboFlux
NUXT_PUBLIC_BASE_URL=
```

**2.** Use the compose file from the [GitHub repo](https://github.com/joseph-fidelis/kobo-flux-v2) or this minimal version:

```yaml
services:
  kobo-flux:
    image: josephfidelis/koboflux-v2:latest
    container_name: koboflux-v2
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      HOST: 0.0.0.0
      PORT: 3000
```

**3.** Start:

```bash
docker compose pull
docker compose up -d
```

Open **http://localhost:3000**

### Compose commands

```bash
docker compose logs -f      # logs
docker compose ps           # status
docker compose restart      # after editing .env
docker compose down         # stop
```

**Custom port:**

```bash
KOBOFLUX_PORT=8080 docker compose up -d
```

(requires `ports: - "${KOBOFLUX_PORT:-3000}:3000"` in compose)

## Quick start — Docker CLI

**Pull and run:**

```bash
docker pull josephfidelis/koboflux-v2:latest

docker run -d \
  --name koboflux-v2 \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NUXT_KOBO_API_TOKEN=your_kobo_api_token_here \
  -e NUXT_KOBO_BASE_URL=https://kf.kobotoolbox.org \
  -e NUXT_PUBLIC_APP_NAME=KoboFlux \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  josephfidelis/koboflux-v2:latest
```

**Using an env file (preferred):**

```bash
docker run -d \
  --name koboflux-v2 \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  josephfidelis/koboflux-v2:latest
```

**Pin a version:**

```bash
docker pull josephfidelis/koboflux-v2:1.0.0
docker run -d --name koboflux-v2 -p 3000:3000 --env-file .env josephfidelis/koboflux-v2:1.0.0
```

**Stop and remove:**

```bash
docker stop koboflux-v2 && docker rm koboflux-v2
```

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_KOBO_API_TOKEN` | **Yes** | — | Kobo API token (server-only) |
| `NUXT_KOBO_BASE_URL` | No | `https://kf.kobotoolbox.org` | Kobo host (`https://eu.kobotoolbox.org` for EU) |
| `NUXT_PUBLIC_APP_NAME` | No | `KoboFlux` | Name shown in the UI |
| `NUXT_PUBLIC_BASE_URL` | No | *(empty)* | Leave empty for same-origin API proxy |
| `KOBOFLUX_PORT` | No | `3000` | Host port (Compose only) |

**Never** bake tokens into the image. Pass them at runtime with `-e` or `--env-file`.

## What’s included

- Dashboard and forms library
- Form detail, deployment links, downloads (JSON / XML / XLSX)
- Submissions browser and exports
- Excel bulk upload (OpenRosa)
- Organization team view

## Links

- **Source:** https://github.com/joseph-fidelis/kobo-flux-v2
- **Issues:** https://github.com/joseph-fidelis/kobo-flux-v2/issues
- **License:** MIT

## Supported tags

- `latest` — current `main` branch
- `1.0.0`, `0.1.0`, … — matches `version` in `package.json` on each release
- Short git SHA tags from CI

---
