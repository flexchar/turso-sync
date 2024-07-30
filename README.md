# turso-sync

Packages: https://github.com/flexchar/turso-sync/pkgs/container/turso-sync
GitHub: https://github.com/flexchar/turso-sync

> This is to solve personal problem but could also be made for others. To do so, I'd like to build a dedicated image for each platform.

To install dependencies:

```bash
bun install
cp .env.example .env
```

To test docker locally:

```bash
docker build -t turso-sync:local . && docker run --rm -it --env-file .env -v turso-volume:/turso turso-sync:local
```

using docker compose:

```bash
docker compose up --build --force-recreate
```

To build:

```bash
now=$(date +%s)
tag="ghcr.io/flexchar/turso-sync:$now"
echo "building image for tag: $tag"
docker build --platform=linux/amd64 -t $tag -t ghcr.io/flexchar/turso-sync:latest .
docker push $tag
```

To use in Docker Compose

```yaml
services:
    #...other services
    turso-sync:
        image: ghcr.io/flexchar/turso-sync:latest
        volumes:
            - turso_data:/turso
        environment:
            - LIBSQL_DB_URL=${LIBSQL_DB_URL}
            - LIBSQL_DB_AUTH_TOKEN=${LIBSQL_DB_AUTH_TOKEN}
            - OUTPUT_DB_PATH=${OUTPUT_DB_PATH}
            - SYNC_INTERVAL=${SYNC_INTERVAL}

volumes:
    turso_data:
```
