# Multi-stage Dockerfile for JanSetu on Cloud Run
FROM node:20-alpine AS base

# Step 1: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Step 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run precomputation seed to ensure static assets and data exist
RUN npm run seed:data
RUN npm run seed:requests
RUN npm run seed:ai

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm run build

# Step 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone server and public files
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure data directory has write permissions for persistence
RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
