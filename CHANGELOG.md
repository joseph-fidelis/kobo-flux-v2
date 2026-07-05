# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open-source documentation (README, CONTRIBUTING, SECURITY, architecture guide)
- Dashboard with form KPIs and recent forms table
- Forms library, form detail, submissions browser, and Excel bulk upload
- Organization team page (members and invites)
- Nitro proxy for Kobo API v2 and `/me`
- OpenRosa submission upload route (`POST /api/openrosa/{username}/submission`)

### Changed

- Migrated submission upload from removed Kobo v1 API to OpenRosa
- Removed unused dependencies (Pinia, VeeValidate, Zod, and others)
- Default Kobo base URL set to `https://kf.kobotoolbox.org`

### Removed

- Deprecated v1 `submissions.json` proxy and `forms.json` client fallbacks

## [0.1.0] - 2026-07-05

Initial public release of KoboFlux v2.

[Unreleased]: https://github.com/your-org/kobo-flux-v2/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/kobo-flux-v2/releases/tag/v0.1.0
