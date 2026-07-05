# KoboFlux v2

A modern, open-source web interface for [KoboToolbox](https://www.kobotoolbox.org/). KoboFlux v2 helps teams browse forms, inspect deployments, export and upload submission data, and manage organization members — all through a clean Nuxt app that talks to Kobo's APIs via a secure server-side proxy.

> **Note:** KoboFlux is an independent open-source project. It is not affiliated with, endorsed by, or maintained by the KoboToolbox team.

## Features

- **Dashboard** — KPI overview and recently modified forms
- **Forms library** — List, search, and open any survey asset you have access to
- **Form detail** — Deployment status, collection links, settings, and downloads (JSON, XML, XLSX)
- **Submissions** — Paginated submission table with validation status and exports (JSON, XML, XLSX)
- **Bulk upload** — Import rows from an Excel file; headers are validated against Kobo export labels before upload
- **Team** — Organization members, roles, and pending invites (via `/me` and org APIs)
- **Secure API proxy** — Kobo API token stays on the server; configure via **Settings** (HttpOnly session cookies) or environment variables

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Nuxt 4](https://nuxt.com/) + Vue 3 |
| UI | [shadcn-vue](https://www.shadcn-vue.com/) (Reka UI primitives) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide Vue Next, Nuxt Icon |
| Tables | TanStack Vue Table |
| Spreadsheets | SheetJS (`xlsx`) |
| Server | Nitro (Node) |

## Architecture

```
Browser  →  Nuxt pages / composables  →  services  →  useApi  →  Nitro proxy  →  KoboToolbox
```

- **Pages** (`app/pages/`) — Route-level UI
- **Composables** (`app/composables/`) — State, data loading, and user actions
- **Services** (`app/services/`) — Typed wrappers around Kobo API v2 (and OpenRosa upload)
- **Models** (`app/lib/models/`) — TypeScript types aligned with Kobo responses
- **Server** (`server/`) — Proxies `/api/*` and `/me/*` to your configured Kobo host

Submission uploads use the **OpenRosa** endpoint `POST /{username}/submission` (not the removed Kobo v1 `submissions.json` API).

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for more detail.

## Requirements

**Local development**

- **Node.js** 20+
- **pnpm** 10+ (recommended; see `packageManager` in `package.json`)

**Docker**

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+ (included with Docker Desktop)

**All setups**

- A [KoboToolbox](https://www.kobotoolbox.org/) account with an API token

## Quick start (local development)

### 1. Clone and install

```bash
git clone https://github.com/josephfidelis/kobo-flux-v2.git
cd kobo-flux-v2
pnpm install
```

### 2. Configure Kobo credentials

**Option A — Settings UI (no `.env` required)**

```bash
pnpm dev
```

Open [http://localhost:3000/settings](http://localhost:3000/settings), enter your Kobo API token and base URL, then **Save & test connection**. Values are stored in **HttpOnly session cookies** for this browser.

**Option B — Environment variables (Docker / server deploy)**

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Optional if using Settings UI — required for Docker unless users configure in browser
NUXT_KOBO_API_TOKEN=your_token_here

# Kobo host — use kf.kobotoolbox.org (global) or eu.kobotoolbox.org (EU)
NUXT_KOBO_BASE_URL=https://kf.kobotoolbox.org

# Shown in the sidebar
NUXT_PUBLIC_APP_NAME=KoboFlux

# Leave empty — API calls use same-origin Nitro proxy routes
NUXT_PUBLIC_BASE_URL=
```

Cookie credentials **override** env vars when both are set in the same browser session.

### 3. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build (Node)

```bash
pnpm build
pnpm preview
```

Deploy the `.output` directory to any Node-compatible host (Nitro `node-server` preset).

## Running with Docker

The published image is **`josephfidelis/koboflux-v2`**. The API token is read from environment variables at runtime — never bake secrets into the image.

### 1. Configure environment

From the project root:

```bash
cp .env.example .env
```

Set at minimum:

```env
NUXT_KOBO_API_TOKEN=your_token_here
```

Other variables (`NUXT_KOBO_BASE_URL`, `NUXT_PUBLIC_APP_NAME`, etc.) are optional; see [Environment variables](#environment-variables).

### 2. Docker Compose (recommended)

Pull the latest image from Docker Hub and start the app:

```bash
docker compose pull
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000).

**Useful commands:**

```bash
docker compose logs -f          # follow logs
docker compose ps               # status + health
docker compose restart          # restart after .env changes
docker compose down             # stop and remove container
docker compose down -v          # also remove the data volume
```

**Custom host port** (default `3000`):

```bash
KOBOFLUX_PORT=8080 docker compose up -d
# → http://localhost:8080
```

**Build from source instead of pulling:**

```bash
docker compose build
docker compose up -d
```

> To build locally with Compose, add a `build: .` section to `docker-compose.yml` or use the plain `docker` commands below.

**Volumes** (defined in `docker-compose.yml`):

| Volume | Mount | Purpose |
|--------|--------|---------|
| `kobo_flux_data` | `/data` | Named volume for optional persistent runtime data |
| `./.env` | `/config/.env` (read-only) | Keeps env file visible inside the container |

Environment variables are injected via `env_file: .env` — edit `.env` on the host and run `docker compose restart`.

### 3. Docker (without Compose)

**Pull and run** from Docker Hub:

```bash
docker pull josephfidelis/koboflux-v2:latest

docker run -d \
  --name koboflux-v2 \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  josephfidelis/koboflux-v2:latest
```

**Build and run** from this repository:

```bash
docker build -t josephfidelis/koboflux-v2:latest .

docker run -d \
  --name koboflux-v2 \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  josephfidelis/koboflux-v2:latest
```

**Pin a version** instead of `latest`:

```bash
docker pull josephfidelis/koboflux-v2:0.1.0
docker run -d --name koboflux-v2 -p 3000:3000 --env-file .env josephfidelis/koboflux-v2:0.1.0
```

**Stop and remove:**

```bash
docker stop koboflux-v2
docker rm koboflux-v2
```

### CI-published images

Every push to `main` publishes to Docker Hub:

| Tag | When |
|-----|------|
| `latest` | Every merge to `main` |
| `0.1.0` | Every merge to `main` (matches `version` in `package.json`) |
| `0.1.0`, `0.1`, … | Git tags like `v0.1.0` |

GitHub Actions secrets required: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`. See [`.github/workflows/docker-publish.yml`](./.github/workflows/docker-publish.yml).

**One-time setup (fixes `Username and password required`):**

1. Create repository **`josephfidelis/koboflux-v2`** on [Docker Hub](https://hub.docker.com/) (if it does not exist).
2. Create an access token: [Docker Hub → Account Settings → Security → New Access Token](https://hub.docker.com/settings/security)  
   - Scope: **Read, Write** (or Read & Write) so CI can push images.
3. In your **GitHub repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

   | Name | Value |
   |------|--------|
   | `DOCKERHUB_USERNAME` | `josephfidelis` (exact Docker Hub username) |
   | `DOCKERHUB_TOKEN` | The token from step 2 (`dckr_pat_…`) — **not** your Docker Hub password |
   | `POSTHOG_API_KEY` | PostHog project API key (`phc_…`) for analytics in official Docker builds (optional but recommended) |

4. Re-run the failed workflow (Actions → failed run → **Re-run jobs**).

The `punycode` deprecation line in logs is a harmless Node warning from an action dependency; it is not the cause of the login failure.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NUXT_KOBO_API_TOKEN` | No* | Server-only Kobo API token. *Required unless users configure via **Settings** or you rely on cookies only. |
| `NUXT_KOBO_BASE_URL` | No | Kobo server base URL. Default: `https://kf.kobotoolbox.org` |
| `NUXT_PUBLIC_APP_NAME` | No | Application name in the UI. Default: `KoboFlux` |
| `NUXT_PUBLIC_BASE_URL` | No | Optional API base for `useApi`. Leave empty for same-origin proxy. |
| `KOBOFLUX_PORT` | No | Host port for Docker Compose. Default: `3000` |
| `NUXT_PUBLIC_POSTHOG_KEY` | No | PostHog project API key (`phc_…`). Enables client-side analytics when set. |
| `NUXT_PUBLIC_POSTHOG_HOST` | No | PostHog ingest host. Default: `https://us.i.posthog.com` |
| `NUXT_PUBLIC_POSTHOG_ENABLED` | No | Set to `false` to disable analytics. Default: `true` |

**Browser Settings** (alternative to env): open `/settings` to save token and base URL in HttpOnly session cookies. Cookie values take precedence over env when present.

## Analytics

Official Docker images may include maintainer PostHog analytics to understand how KoboFlux is used across deployments. When enabled, the app sends page views and feature events to PostHog — including Kobo username/email (from `/me/`) after you configure credentials, plus deployment hostname and geo (via PostHog).

**What is not collected:** Kobo API tokens, submission data, or uploaded file contents.

**Opt out** (self-hosted):

```env
NUXT_PUBLIC_POSTHOG_ENABLED=false
```

Or leave `NUXT_PUBLIC_POSTHOG_KEY` empty. For local testing with your own PostHog project, set the key in `.env`.

Official CI builds use the `POSTHOG_API_KEY` GitHub Actions secret (see [CI / Docker Hub](#ci--docker-hub)).

## Uploading submissions

1. Open a **deployed** form → **Upload data**
2. Download the **template** (column headers match Kobo label export)
3. Fill rows in Excel and upload
4. Each row is posted individually via OpenRosa; results appear in the upload log

The form must be deployed and active. The app resolves `id_string` from deployment metadata, content settings, or XForm XML.

## Project structure

```
app/
├── components/
│   ├── app-specific/     # App shell (sidebar, nav)
│   └── ui/               # shadcn-vue components
├── composables/          # Feature logic (forms, upload, dashboard, …)
├── layouts/              # AdminLayout
├── lib/
│   ├── helpers/          # Export, upload, id resolution, xlsx
│   └── models/           # TypeScript API types
├── pages/                # File-based routes
└── services/             # Kobo API client layer

server/
├── routes/
│   ├── api/[...path].ts           # Kobo v2 API proxy
│   ├── api/openrosa/...           # Submission upload
│   └── me/[[...path]].ts          # Current user proxy
└── utils/proxy-kobo.ts            # Shared proxy helper
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm generate` | Static site generation (if applicable) |

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before opening a pull request.

## Security

To report a vulnerability, see [SECURITY.md](./SECURITY.md). **Do not** open public issues for security problems.

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgements

- [KoboToolbox](https://www.kobotoolbox.org/) for the data collection platform and APIs
- [shadcn-vue](https://www.shadcn-vue.com/) for the component system
