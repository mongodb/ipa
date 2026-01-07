#!/bin/bash

# Script to update external documentation from mongodb/openapi repository
# This ensures agents have access to the latest IPA validation documentation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_EXTERNAL_DIR="$REPO_ROOT/docs/external"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Updating external documentation...${NC}"

# Create docs/external directory if it doesn't exist
mkdir -p "$DOCS_EXTERNAL_DIR"

# Fetch IPA Validation README from mongodb/openapi
echo -e "${BLUE}Fetching IPA Validation README...${NC}"
curl -s https://raw.githubusercontent.com/mongodb/openapi/main/tools/spectral/ipa/README.md \
  -o "$DOCS_EXTERNAL_DIR/ipa-validation-README.md.tmp"

# Add header note about auto-sync
cat > "$DOCS_EXTERNAL_DIR/ipa-validation-README.md" << 'EOF'
# IPA Validation

> **Note**: This file is automatically synced from the [mongodb/openapi repository](https://github.com/mongodb/openapi/blob/main/tools/spectral/ipa/README.md).
> To update this file, run `./scripts/update-external-docs.sh` from the repository root.

EOF

# Append the fetched content (skip the first line which is the title)
tail -n +2 "$DOCS_EXTERNAL_DIR/ipa-validation-README.md.tmp" >> "$DOCS_EXTERNAL_DIR/ipa-validation-README.md"

# Clean up temp file
rm "$DOCS_EXTERNAL_DIR/ipa-validation-README.md.tmp"

echo -e "${GREEN}✓ Updated: docs/external/ipa-validation-README.md${NC}"
echo -e "${GREEN}External documentation updated successfully!${NC}"

