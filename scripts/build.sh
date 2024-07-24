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

build_mode="$2"

generate_umd_bundle() {
    echo "----------------------------------------"
    echo "Generating UMD bundle..."
    echo "----------------------------------------"
    npx rollup -c rollup.config.js -o "$DIST/bundle.js" || { echo "UMD build failed"; exit 1; }
}

build_project() {
    echo "----------------------------------------"
    echo "Building project..."
    echo "----------------------------------------"
    npx tsc --outDir "$DIST" && npx tsc-alias --outDir "$DIST" || { echo "TSC build failed"; exit 1; }
}

case "$build_mode" in
    umd)
        generate_umd_bundle
        ;;
    tsc)
        build_project
        ;;
    *)
        generate_umd_bundle
        build_project
        ;;
esac