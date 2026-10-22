#!/usr/bin/env bash
# Sets the review password for book.theresewhite.com and
# calculator.theresewhite.com.
#
# Run it in your own terminal, not through Claude, so the password is never
# written into a chat log:
#
#   scripts/set-review-passphrase.sh
#
# It asks for the password without showing it, and stores only a scrambled
# version (a SHA-256 hash) as the REVIEW_PASSPHRASE_HASH repository variable.
# The next deploy puts that hash in both pages; review/gate.js scrambles what a
# reviewer types the same way and compares. Spaces at the ends and capital
# letters are ignored, so "Blue Heron" and "blue heron" both work.
#
# Changing it locks every reviewer out until they enter the new one. Choose a
# password that does not appear anywhere in the pages' own text.
set -euo pipefail

read -r -s -p "New review password: " first; echo
read -r -s -p "Type it again: " second; echo
if [[ "$first" != "$second" ]]; then echo "They didn't match. Nothing changed." >&2; exit 1; fi

normalized="$(printf '%s' "$first" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' | tr '[:upper:]' '[:lower:]')"
if [[ ${#normalized} -lt 8 ]]; then echo "Use at least 8 characters. Nothing changed." >&2; exit 1; fi

hash="$(printf '%s' "theresewhite-review:$normalized" | shasum -a 256 | cut -d' ' -f1)"
gh variable set REVIEW_PASSPHRASE_HASH --body "$hash"
echo "Saved. Run the deploy (or push to main) for it to take effect."
