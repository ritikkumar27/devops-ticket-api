# Stage 1: Dependencies Resolution

FROM node:22-alpine AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Application Build & Production Pruning


FROM node:22-alpine AS builder
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build
RUN pnpm prune --prod





# Stage 3: Production Runtime

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init wget

RUN addgroup --system --gid 10001 appgroup && \
    adduser --system --uid 10001 --ingroup appgroup appuser

ENV NODE_ENV=production \
    PORT=3000

COPY --chown=appuser:appgroup --from=builder /app/package.json ./
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist

USER appuser
EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]