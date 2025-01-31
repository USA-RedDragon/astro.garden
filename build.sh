#!/bin/bash

set -euo pipefail

rm -rf ./public ./content/gallery ./static/gallery
mkdir -p ./content/gallery/my-data
mkdir -p ./content/gallery/other-data
mkdir -p ./static/gallery
mkdir -p .build-cache

# renovate: datasource=github-releases depName=USA-RedDragon/astro.garden-images
GALLERY_VERSION=41

if [ ! -f .build-cache/gallery-${GALLERY_VERSION}.tar.gz ]; then
  curl -fSsL https://github.com/USA-RedDragon/astro.garden-images/releases/download/${GALLERY_VERSION}/gallery.tar.gz -o .build-cache/gallery-${GALLERY_VERSION}.tar.gz
fi
tar -xzf .build-cache/gallery-${GALLERY_VERSION}.tar.gz -C ./static/gallery
mv ./static/gallery/generated/my-data.json data/my.json
mv ./static/gallery/generated/other-data.json data/other.json

# We have a clean gallery directory
python generate.py

hugo --gc --minify
