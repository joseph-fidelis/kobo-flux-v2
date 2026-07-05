FROM node:22-alpine AS base
RUN corepack enable \
  && corepack prepare pnpm@10.24.0 --activate
WORKDIR /app

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nuxtjs

WORKDIR /app
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

USER nuxtjs
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
