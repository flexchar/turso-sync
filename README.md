# turso-sync

Packages: https://github.com/flexchar/turso-sync/pkgs/container/turso-sync
GitHub: https://github.com/flexchar/turso-sync

To install dependencies:

```bash
bun install
cp .env.example .env
```

To test docker locally:

```bash
docker build -t turso-sync:local . && docker run --rm -it --env-file .env -v turso-volume:/turso turso-sync:local
```

To build:

```bash
now=$(date +%s)
tag="ghcr.io/flexchar/turso-sync:$now"
echo "building image for tag: $tag"
docker build --platform=linux/amd64 -t $tag .
docker push $tag
```

To use in Docker Compose

```
services:
    ...other services
    turso-sync:
        image: ghcr.io/flexchar/turso-sync:1712519894
        volumes:
            - turso_data:/turso
        environment:
            - LIBSQL_DB_URL=${LIBSQL_DB_URL}
            - LIBSQL_DB_AUTH_TOKEN=${LIBSQL_DB_AUTH_TOKEN}
            - OUTPUT_DB_PATH=${OUTPUT_DB_PATH}
            - SYNC_INTERVAL=60

volumes:
    turso_data:

```
