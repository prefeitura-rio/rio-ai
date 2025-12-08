# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Vite application
RUN npm run build

# Production image - runs both static files and proxy
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built static files
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist

# Copy proxy server
COPY --from=builder --chown=appuser:nodejs /app/server ./server
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/package-lock.json ./package-lock.json

# Install production dependencies only (for Express proxy)
RUN npm ci --omit=dev

USER appuser

EXPOSE 3001

# Start the Express proxy server (which also serves static files)
CMD ["node", "server/proxy.mjs"]
