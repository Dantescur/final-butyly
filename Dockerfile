FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache redis && \
  corepack enable && \
  corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY butyly/package.json butyly/
COPY ui-butyly/package.json ui-butyly/

RUN pnpm install --frozen-lockfile

COPY butyly ./butyly
COPY ui-butyly ./ui-butyly

RUN pnpm --filter ui-butyly build && pnpm --filter butyly build

RUN mkdir -p butyly/dist/public && \
  cp -r ui-butyly/dist/* butyly/dist/public/

EXPOSE 6379 3000

CMD redis-server --daemonize yes && node butyly/dist/app.js
