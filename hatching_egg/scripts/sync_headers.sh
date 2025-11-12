#!/bin/bash
# Sync ONLY servo_mapping.h to sketch folders
#
# Why: arduino-cli cannot use parent directory includes (../)
# Solution: Each sketch needs local copies of servo_mapping.h
# Source of truth: Parent arduino/servo_mapping.h
#
# NOTE: Do NOT sync *_logic.h files - they have different includes:
#   - Parent: #include "../servo_mapping.h" (for local C++ testing)
#   - Sketch: #include "servo_mapping.h" (for arduino-cli)
#   These are INTENTIONALLY DIFFERENT.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Syncing servo_mapping.h to sketch folders..."
echo ""

# Track what we sync
SYNCED=0

# Source file
SOURCE="arduino/servo_mapping.h"

if [ ! -f "$SOURCE" ]; then
    echo "❌ ERROR: Source not found: $SOURCE"
    exit 1
fi

# Function to sync to a destination
sync_to() {
    local dest="$1"

    # Create destination directory if needed
    mkdir -p "$(dirname "$dest")"

    # Check if already synced
    if cmp -s "$SOURCE" "$dest" 2>/dev/null; then
        echo "✓ Already synced: $dest"
    else
        cp "$SOURCE" "$dest"
        echo "✅ Updated: $dest"
        SYNCED=$((SYNCED + 1))
    fi
}

# Sync to all sketches that need it
sync_to "arduino/servo_tester/servo_mapping.h"
sync_to "arduino/servo_sweep_test/servo_mapping.h"
# hatching_egg doesn't need servo_mapping.h (uses animation_config.h)

# Summary
echo ""
echo "================================"
if [ $SYNCED -eq 0 ]; then
    echo "✅ All files already synced"
else
    echo "✅ Synced $SYNCED file(s)"
    echo ""
    echo "⚠️  WARNING: Files were updated"
    echo "   Review changes before uploading to hardware"
fi
echo "================================"

exit 0
