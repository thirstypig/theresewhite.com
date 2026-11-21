#!/usr/bin/env bash
# Sets the password for /admin and the style bible pages (/stylebible).
#
# Run it in your own terminal, not through Claude, so the password is never
# written into a chat log:
#
#   scripts/set-admin-password.sh
#
# It asks for the password twice without showing it, and stores only a
# scrambled copy (a SHA-256 hash) as the NEXT_PUBLIC_ADMIN_PASSWORD_HASH
# repository variable. The next deploy builds that hash into the site, and
# src/lib/admin-password.ts scrambles what someone types the same way and
# compares. The comparison is exact: capitals and spaces count.
#
# To go back to the built-in password, delete the variable (GitHub, Settings,
# Secrets and variables, Actions, Variables) and run the deploy.
#
# This lock keeps visitors and search engines out. It is not real security:
# see src/components/admin-gate.tsx. A short or common password can be worked
# out from its hash, which ships in the page, so a few random words are
# better than one. Never write the password itself into any file here.
set -euo pipefail

# IFS= keeps spaces at either end. The password screen compares exactly what
# is typed, so trimming here would save a password nobody could enter.
IFS= read -r -s -p "New admin password: " first; echo
IFS= read -r -s -p "Type it again: " second; echo
if [[ "$first" != "$second" ]]; then echo "They didn't match. Nothing changed." >&2; exit 1; fi
if [[ -z "$first" ]]; then echo "The password can't be empty. Nothing changed." >&2; exit 1; fi
if [[ ${#first} -lt 8 ]]; then echo "Note: that is under 8 characters, which is easy to guess. Saving it anyway." >&2; fi

# macOS has shasum; most Linux machines have sha256sum. Both print the same hash.
if command -v shasum >/dev/null 2>&1; then
  hash="$(printf '%s' "$first" | shasum -a 256 | cut -d' ' -f1)"
else
  hash="$(printf '%s' "$first" | sha256sum | cut -d' ' -f1)"
fi

gh variable set NEXT_PUBLIC_ADMIN_PASSWORD_HASH --body "$hash"
echo "Saved. It takes effect on the next deploy: push to main, or run 'gh workflow run deploy.yml'."
