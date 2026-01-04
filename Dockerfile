# Use official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy source and run
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1))" || exit 1

# Run the server directly with Bun (no build step needed!)
CMD ["bun", "run", "src/server.ts"]
