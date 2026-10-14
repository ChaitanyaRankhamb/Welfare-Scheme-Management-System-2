# builder (stage first)

# builder stage. This stage installs everything required for the application.
# Also, it will compile the TS code into JS.
FROM node:22-slim AS builder

# use frontend as the working directory. After the compilation, everything will live on this directory
WORKDIR /frontend

# Disable Next.js telemetry during build for privacy and faster builds
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js reads `NEXT_PUBLIC_*` env vars during `next build` and inlines them
# into the client bundle. We set a default so the build always succeeds.
ARG NEXT_PUBLIC_API_URL=http://localhost:6001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_API_URL=https://localhost
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies exactly as per lock file
RUN npm ci

# Copy project files
COPY . .

# Build Next.js app. it use to compile code from TS to JS.
RUN npm run build


# production (stage final)

# fresh node image.
FROM node:22-slim AS production

# working directory in production stage
WORKDIR /frontend

# sets environment mode
ENV NODE_ENV=production

# it defines the application port where the application will run
ENV PORT=3001

# Bind to all network interfaces so container receives external requests
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output and static assets with non-root ownership
COPY --chown=node:node --from=builder /frontend/public ./public
COPY --chown=node:node --from=builder /frontend/.next/standalone ./
COPY --chown=node:node --from=builder /frontend/.next/static ./.next/static

# Use the pre-existing non-root user `node` (UID/GID 1000)
# Create cache directory with correct ownership
RUN mkdir -p .next/cache && chown -R node:node /frontend

# switch to non-root user
USER node

# Expose port
EXPOSE 3001

# Production Container Healthcheck (matches backend pattern)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3001) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start Next.js in production mode
CMD ["node", "server.js"]