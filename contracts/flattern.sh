#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT"

# Create or clear codebase.md in the contracts directory
rm -f "$SCRIPT_DIR/codebase.md"

# Start the codebase.md file
echo "# Codebase Contents" > "$SCRIPT_DIR/codebase.md"

# Add the tree structure to the file
echo "## Project Structure" >> "$SCRIPT_DIR/codebase.md"
echo '```' >> "$SCRIPT_DIR/codebase.md"
tree -I "node_modules" >> "$SCRIPT_DIR/codebase.md"
echo '```' >> "$SCRIPT_DIR/codebase.md"
echo "" >> "$SCRIPT_DIR/codebase.md"

# Function to add file contents
add_file_contents() {
    local source_file="$1"
    local target_file="$2"
    echo "## File: $source_file" >> "$target_file"
    echo '```' >> "$target_file"
    cat "$source_file" >> "$target_file"
    echo '```' >> "$target_file"
    echo "" >> "$target_file"
}

# Add package.json and tsconfig.json
add_file_contents "./package.json" "$SCRIPT_DIR/codebase.md"
add_file_contents "./tsconfig.json" "$SCRIPT_DIR/codebase.md"

# Add all Solidity files from contracts directory
find "$SCRIPT_DIR" -type f -name "*.sol" | while read -r file; do
    add_file_contents "$file" "$SCRIPT_DIR/codebase.md"
done

# Add all TypeScript files from the root
find . -maxdepth 1 -type f -name "*.ts" | while read -r file; do
    add_file_contents "$file" "$SCRIPT_DIR/codebase.md"
done

echo "Documentation generated in $SCRIPT_DIR/codebase.md"