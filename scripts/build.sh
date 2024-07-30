#!/bin/bash

now=$(date +%s)
tag="ghcr.io/flexchar/turso-sync:$now"
latest="ghcr.io/flexchar/turso-sync:latest"
echo "building image for tag: $tag"
docker build --platform=linux/amd64 -t $tag -t $latest .
docker push $tag