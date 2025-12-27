#!/bin/bash

# SuperTables - Build Script for Chrome Web Store
# Creates a clean .zip file for submission

set -e

# Configuration
EXTENSION_NAME="supertables"
VERSION=$(grep '"version"' manifest.json | sed 's/.*: "\(.*\)".*/\1/')
OUTPUT_DIR="dist"
ZIP_NAME="${EXTENSION_NAME}-v${VERSION}.zip"

echo "Building SuperTables v${VERSION}..."

# Create output directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Files and directories to include
INCLUDE=(
  "manifest.json"
  "offscreen.html"
  "offscreen.js"
  "_locales"
  "background"
  "content"
  "icons"
  "popup"
)

# Files and patterns to exclude
EXCLUDE=(
  ".DS_Store"
  "*.map"
  "generate-icons.html"
  "logo.png"
)

# Create temporary build directory
BUILD_DIR="$OUTPUT_DIR/build"
mkdir -p "$BUILD_DIR"

# Copy files
for item in "${INCLUDE[@]}"; do
  if [ -e "$item" ]; then
    cp -r "$item" "$BUILD_DIR/"
  fi
done

# Remove excluded files
for pattern in "${EXCLUDE[@]}"; do
  find "$BUILD_DIR" -name "$pattern" -delete 2>/dev/null || true
done

# Create zip file
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" . -x "*.DS_Store"
cd ../..

# Cleanup
rm -rf "$BUILD_DIR"

# Show result
echo ""
echo "Build complete!"
echo "Output: $OUTPUT_DIR/$ZIP_NAME"
echo ""

# Verify zip contents
echo "Package contents:"
unzip -l "$OUTPUT_DIR/$ZIP_NAME"

echo ""
echo "File size: $(du -h "$OUTPUT_DIR/$ZIP_NAME" | cut -f1)"
echo ""
echo "Ready to upload to Chrome Web Store!"
