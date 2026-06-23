# Nuxt 3 + Shadcn-Vue + VeeValidate/Zod Template

A production-ready starter template combining Nuxt 3, Shadcn-Vue, and VeeValidate + Zod for type-safe form validation. Dark theme by default.

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 + Vue 3 |
| UI Components | Shadcn-Vue (Reka-UI primitives) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide Vue Next |
| Forms | VeeValidate + Zod |
| State | Pinia + pinia-plugin-persistedstate |
| Tables | TanStack Vue Table |
| Charts | ApexCharts / vue3-apexcharts |
| Toasts | Vue Sonner |
| Theme | Dark (forced via @nuxtjs/color-mode) |

## Features

- **Shadcn-Vue** components pre-configured with no prefix
- **Dark theme only** — forced via `@nuxtjs/color-mode` with `preference: 'dark'`
- **VeeValidate + Zod** — schema-based form validation out of the box
- **Pinia** with persisted state plugin
- **TanStack Vue Table** for data-heavy views
- **useApi composable** — wraps `$fetch` with JWT auth, auto-refresh on 401
- **Auth middleware** — redirects unauthenticated users to `/auth/login`
- JWT Bearer token auth via `access_token` + `refresh_token` cookies

## Project Structure

```
app/
├── components/        # Shared UI components
├── composables/
│   └── util/
│       └── useApi.ts  # Authenticated fetch wrapper
├── layouts/           # AdminLayout, AuthLayout
├── middleware/
│   └── auth.ts        # Route protection
├── pages/             # File-based routing
├── stores/            # Pinia stores
└── assets/
    └── css/
        └── tailwind.css
```

## Setup

Install dependencies:

```bash
pnpm install
```

Copy the environment file and configure:

```bash
cp .env.example .env
```

Key env var:

```env
NUXT_PUBLIC_API_BASE=http://localhost:5000
```

## Development

```bash
pnpm dev
```

Runs on `http://localhost:3000`.

## Production

```bash
pnpm build
pnpm preview
```

## useApi Composable

Wraps `$fetch` with automatic JWT injection and token refresh on 401:

```ts
const { get, post, put, patch, delete: del, useFetch } = useApi()

// GET with query params
const data = await get('/users/', { page: 1, size: 20 })

// POST
const result = await post('/auth/login', { username, password })

// Use with Nuxt's useFetch (SSR-compatible)
const { data, pending } = useFetch('/locations/')
```

## Form Validation Pattern

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
}))

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const onSubmit = handleSubmit(values => { /* submit */ })
</script>
```

## Dialog / Modal Pattern

All dialogs follow a consistent structure — see `CLAUDE.md` for the full spec including script pattern, field styling, and footer button labels.

## Design Tokens

```
Page background:    #0A0E1A
Card background:    #161b27
Row background:     #1D293D
Default border:     #1e2535
Primary accent:     blue-500 / blue-600
Border radius:      0.625rem
```
