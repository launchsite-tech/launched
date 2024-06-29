#!/opt/homebrew/bin/bash

if [ -z "$1" ]; then
    echo "No output directory specified."
    exit 1
fi

DIST="$1"

if [ -d "$DIST" ]; then
    echo "Output directory already exists."
    exit 1
fi
mkdir "$DIST"

echo "Copying files..."

shopt -s globstar
for file in src/**/*.css; do
    source="$file"
    relative="${file/src/$DIST}"
    destination="$relative"
    mkdir -p "$(dirname "$destination")"
    cp "$source" "$destination"
done

echo "Building project..."

npx tsc --outDir "$DIST" && npx tsc-alias --outDir "$DIST" || { echo "Build failed"; exit 1; }
