# Contributing to KoboFlux v2

Thank you for your interest in contributing. This document explains how to get set up and what we expect from pull requests.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Ways to contribute

- **Bug reports** — Open an issue with steps to reproduce, expected vs actual behavior, and your Kobo server (e.g. `kf` vs `eu`)
- **Feature requests** — Describe the problem and proposed solution before large changes
- **Pull requests** — Bug fixes, features, docs, and tests (when applicable)
- **Documentation** — Improvements to README, architecture notes, or inline comments for non-obvious Kobo API behavior

## Development setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and set `NUXT_KOBO_API_TOKEN`
4. Run the dev server: `pnpm dev`
5. Verify your change: `pnpm build`

## Branch and commit guidelines

- Create a feature branch from `main` (e.g. `fix/upload-header-validation`, `feat/submission-filters`)
- Write clear commit messages in the imperative mood (e.g. `Add export retry for failed Kobo jobs`)
- Keep PRs focused — one logical change per pull request when possible

## Code style

- **TypeScript** — Prefer explicit types for API payloads and composable return values
- **Vue** — Use `<script setup lang="ts">`; match existing patterns in neighboring files
- **Layers** — Pages → composables → services → `useApi` → Nitro proxy. Avoid calling `$fetch` to Kobo directly from the browser
- **Scope** — Do not refactor unrelated code in the same PR
- **Secrets** — Never commit `.env`, API tokens, or real submission data

## Project conventions

| Concern | Convention |
|---------|------------|
| API access | `app/services/*.service.ts` |
| Shared logic | `app/lib/helpers/` |
| Types | `app/lib/models/` |
| Kobo proxy | `server/utils/proxy-kobo.ts` |
| New server routes | Under `server/routes/`; keep tokens server-side |

## Submission upload changes

Uploads go through OpenRosa (`POST /api/openrosa/{username}/submission`). If you touch upload or `id_string` resolution, test against a **deployed** form with a small XLSX file.

## Pull request checklist

- [ ] `pnpm build` succeeds
- [ ] Changes are documented in README or `docs/` if behavior or setup changed
- [ ] No secrets or generated `.nuxt` / `.output` artifacts committed
- [ ] CHANGELOG.md updated for user-visible changes (under `## Unreleased`)

## Questions

Open a [GitHub Discussion](https://github.com/your-org/kobo-flux-v2/discussions) or issue if you are unsure about approach before investing in a large change.
