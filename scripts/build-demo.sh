#!/opt/homebrew/bin/bash

# Define the directory to search in as the first argument to the script
SEARCH_DIR=$1

# Find all .ts and .tsx files in the specified directory and its subdirectories
find "$SEARCH_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    # Replace "./dist/components" or "../dist/components" within double quotes with "launched/components"
    sed -i '' -E 's@(\"\.\/dist|\"\.\./dist)/components"@\"launched/components"@g' "$file"
    # Replace any "./dist" or "../dist" within double quotes with "launched", regardless of what follows
    sed -i '' -E 's@(\"\.\/dist|\"\.\./dist)(/[^ ]*)?"@\"launched"@g' "$file"
done

echo "Replacement complete."