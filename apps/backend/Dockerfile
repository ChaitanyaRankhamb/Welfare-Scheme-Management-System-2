# builder (first stage)

# builder stage. This stage installs everything required for the application.
# Also, it will compile the TS code into JS.
FROM node:22-slim AS builder

# it sets working directory inside the container
WORKDIR /backend

# it copies package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# installs dependencies exactly as per lock file (production-reproducible)
RUN npm ci

# copy backend source code required for build
# RUN npm install --omit=dev
COPY tsconfig.json ./
COPY src ./src

# compile TypeScript → JavaScript
RUN npm run build

# prune dev dependencies to keep only production dependencies
RUN npm prune --omit=dev && npm cache clean --force

# production (final image)

# fresh lightweight container for production (no TS, no dev tools)
FROM node:22-slim AS production

# working directory
WORKDIR /backend

# production mode enabled
ENV NODE_ENV=production

# expose the port that the application will run on. This is the port that the application will listen to for incoming requests.
ENV PORT=6001

# copy only production dependencies and package.json from builder stage
COPY --chown=node:node --from=builder /backend/node_modules ./node_modules
COPY --chown=node:node --from=builder /backend/package.json ./package.json

# Copy compiled JavaScript output with non-root user ownership
COPY --chown=node:node --from=builder /backend/dist ./dist

# switch to non-root user
USER node

# expose backend port
EXPOSE 6001

# Production Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:6001/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# start the application using the compiled JavaScript entry point (dist/app.js) when the container starts. This is the command that will be executed when the container is run.
CMD ["node", "dist/app.js"]