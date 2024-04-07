
# -----------------------------------------------------------------------
# Create Turso executable with Bun
# -----------------------------------------------------------------------
FROM oven/bun:1 as turso-sync

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production && apt update && apt install -y ca-certificates && rm -rf /var/lib/apt/lists/*


COPY index.ts .

RUN bun build --compile --minify index.ts --outfile turso-sync

CMD ["/app/turso-sync"]


