# -----------------------------------------------------------------------
# Create Turso Sync with Bun
# -----------------------------------------------------------------------
FROM oven/bun:1.1-alpine AS turso-sync

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production
COPY index.ts .

RUN bun build --compile --minify index.ts --outfile turso-sync

CMD ["/app/turso-sync"]

LABEL org.opencontainers.image.source=https://github.com/flexchar/turso-sync

