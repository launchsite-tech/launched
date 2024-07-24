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

echo "----------------------------------------"
echo "Copying files..."
echo "----------------------------------------"

shopt -s globstar
for file in src/**/*.css; do
    source="$file"
    relative="${file/src/$DIST}"
    destination="$relative"
    mkdir -p "$(dirname "$destination")"
    cp "$source" "$destination"
done

echo "----------------------------------------"
echo "Generating UMD bundle..."
echo "----------------------------------------"

npx rollup -c rollup.config.js || { echo "UMD build failed"; exit 1; }

echo "----------------------------------------"
echo "Building project..."
echo "----------------------------------------"

npx tsc --outDir "$DIST" && npx tsc-alias --outDir "$DIST" || { echo "TSC build failed"; exit 1; }
