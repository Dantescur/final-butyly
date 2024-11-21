FROM node:20-alpine

WORKDIR /app

# Install build dependencies (including Redis)
RUN apk add --no-cache redis && \
  corepack enable && \
  corepack prepare pnpm@latest --activate

# Cache dependency installation
COPY pnpm-workspace.yaml ./          
COPY pnpm-lock.yaml ./              
COPY butyly/package.json butyly/   
COPY ui-butyly/package.json ui-butyly/

RUN pnpm install --frozen-lockfile   # Install dependencies

# Copy source files and build
COPY butyly ./butyly
COPY ui-butyly ./ui-butyly
RUN pnpm --filter ui-butyly build && pnpm --filter butyly build

# Expose ports for Redis and the app
EXPOSE 6379 3000

# Start Redis and then the app
CMD redis-server --daemonize yes && node butyly/dist/app.js

