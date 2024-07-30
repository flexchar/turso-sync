#!/bin/bash

# Get the current timestamp
now=$(date +%s)

# Define tags
tag="ghcr.io/flexchar/turso-sync:$now"
latest="ghcr.io/flexchar/turso-sync:latest"

# Print message about building image
echo "Building multi-platform image for tags: $tag and $latest"

# Create and use a new builder instance
builder_name=$(docker buildx create --use)

# Check if the buildx command was successful
if [ $? -ne 0 ]; then
  echo "Failed to create and use the buildx builder instance"
  exit 1
fi

# Build and push the multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 -t $tag -t $latest --push .

# Check if the buildx command was successful
if [ $? -ne 0 ]; then
  echo "Failed to build and push the multi-platform image"
  docker buildx rm $builder_name
  exit 1
fi

# Remove the builder instance
docker buildx rm $builder_name

echo "Multi-platform image built and pushed successfully with tags: $tag and $latest"