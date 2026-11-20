#!/bin/bash
# Monthly draft of "Therese's Field Notes".
#
# macOS runs this every Thursday morning (see the .plist beside it). It does
# nothing unless the coming Tuesday, five days out, is the first Tuesday of
# the month. On that Thursday it asks Claude Code to draft the issue in Kit,
# as a draft only, and shows a Mac notification with the result. James then
# reviews it in Kit, sends himself a test, and schedules it.
#
# Usage:
#   draft.sh                       normal weekly run (checks the date first)
#   draft.sh --dry-run 2027-01-05  drafts in the log only, saves nothing to Kit
#   draft.sh --force 2027-01-05    saves a real Kit draft for that date now
#
# It uses this Mac's existing Kit connection. For Claude itself, a normal
# sign-in expires, so the job reads a long-lived Claude Code token from the
# Mac's Keychain (item "field-notes-claude-token"). James creates it once:
#   claude setup-token
#   security add-generic-password -a "$USER" -s field-notes-claude-token -w
# (the second command asks for the token and stores it; nothing is written
# to a file). Without it the job falls back to the normal sign-in.
# Output goes to ~/Library/Logs/field-notes.log.

set -euo pipefail

CLAUDE=/Users/jameschang/.local/bin/claude
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"

mode=create
issue_date=""
case "${1:-}" in
  --dry-run) mode=dry-run; issue_date="${2:?give the issue date, YYYY-MM-DD}" ;;
  --force)   issue_date="${2:?give the issue date, YYYY-MM-DD}" ;;
  "")
    issue_date="$(date -v+5d +%F)"
    weekday="$(date -v+5d +%u)"   # 2 = Tuesday
    day="$(date -v+5d +%d)"
    if [ "$weekday" != 2 ] || [ "$((10#$day))" -gt 7 ]; then
      echo "$(date '+%F %T') $issue_date is not a first Tuesday; nothing to do."
      exit 0
    fi
    ;;
  *) echo "Unknown option: $1" >&2; exit 64 ;;
esac

echo "$(date '+%F %T') Drafting Field Notes for $issue_date ($mode)."

tools="mcp__kit__kit_list_broadcasts,mcp__kit__kit_get_broadcast,Read,Bash(curl -s https://www.theresewhite.com/blog-feed.xml)"
[ "$mode" = create ] && tools="$tools,mcp__kit__kit_create_broadcast"

settings=$(cat <<JSON
{"hooks":{"PreToolUse":[{"matcher":"mcp__kit__.*","hooks":[{"type":"command","command":"/opt/homebrew/bin/python3 $HERE/block-send.py"}]}]}}
JSON
)

if token="$(/usr/bin/security find-generic-password -s field-notes-claude-token -w 2>/dev/null)"; then
  export CLAUDE_CODE_OAUTH_TOKEN="$token"
fi

cd "$REPO"
output="$("$CLAUDE" -p "$(cat "$HERE/prompt.md")

ISSUE_DATE: $issue_date
MODE: $mode" \
  --allowedTools "$tools" \
  --disallowedTools "mcp__kit__kit_update_broadcast,mcp__kit__kit_delete_broadcast,Edit,Write" \
  --settings "$settings" 2>&1)" || true

echo "$output"
result="$(printf '%s\n' "$output" | grep -E '^(DRAFTED|DRY RUN|ALREADY DRAFTED|FAILED):' | tail -1)"
[ -n "$result" ] || result="FAILED: no result line; see ~/Library/Logs/field-notes.log"

# Mac notification. The text is passed as arguments, not pasted into the
# script, so quotes in a subject line can't break it.
/usr/bin/osascript - "$result" <<'APPLESCRIPT' || true
on run argv
  display notification (item 1 of argv) with title "Therese's Field Notes" sound name "Glass"
end run
APPLESCRIPT

echo "$(date '+%F %T') $result"
