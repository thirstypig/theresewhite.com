#!/usr/bin/env python3
"""Safety catch for the monthly Field Notes draft job.

Claude Code runs this before every Kit tool call the job makes. It refuses
any call that would schedule or publish an email (a `send_at` date, or
`public: true`), so the job can only ever leave a draft for James to send.
Exit code 2 tells Claude Code to block the call and show Claude the reason.
"""

import json
import sys

call = json.load(sys.stdin)
args = call.get("tool_input") or {}

if args.get("send_at") or args.get("public") is True:
    print(
        "Blocked: the Field Notes job may only save drafts. "
        "Do not pass send_at or public.",
        file=sys.stderr,
    )
    sys.exit(2)

sys.exit(0)
