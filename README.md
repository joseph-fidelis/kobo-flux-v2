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
- **Secure API proxy** — Your Kobo API token stays on the server; the browser never calls Kobo directly

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

- **Node.js** 20+
- **pnpm** 10+ (recommended; see `packageManager` in `package.json`)
- A [KoboToolbox](https://www.kobotoolbox.org/) account with an API token

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/your-org/kobo-flux-v2.git
cd kobo-flux-v2
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required — create at https://kf.kobotoolbox.org/token/ (or your server equivalent)
NUXT_KOBO_API_TOKEN=your_token_here

# Kobo host — use kf.kobotoolbox.org (global) or eu.kobotoolbox.org (EU)
NUXT_KOBO_BASE_URL=https://kf.kobotoolbox.org

# Shown in the sidebar
NUXT_PUBLIC_APP_NAME=KoboFlux

# Leave empty — API calls use same-origin Nitro proxy routes
NUXT_PUBLIC_BASE_URL=
```

### 3. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
pnpm build
pnpm preview
```

Deploy the `.output` directory to any Node-compatible host (Nitro `node-server` preset).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NUXT_KOBO_API_TOKEN` | Yes | Server-only Kobo API token. Never exposed to the client. |
| `NUXT_KOBO_BASE_URL` | No | Kobo server base URL. Default: `https://kf.kobotoolbox.org` |
| `NUXT_PUBLIC_APP_NAME` | No | Application name in the UI. Default: `KoboFlux` |
| `NUXT_PUBLIC_BASE_URL` | No | Optional API base for `useApi`. Leave empty for same-origin proxy. |

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
