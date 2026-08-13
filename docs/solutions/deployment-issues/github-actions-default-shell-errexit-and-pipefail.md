---
title: 'Two confident claims about how bash behaves inside GitHub Actions, both wrong, both settled in under a minute'
date: 2026-08-12
category: deployment-issues
problem_type: incorrect_assumption / ci_shell_semantics
component: github-actions / workflow-run-steps / bash
severity: medium
symptoms:
  - 'a code review reports that a retry loop in a workflow step is broken, with a detailed and plausible explanation'
  - 'the claim is about how the shell behaves at runtime, and nothing in the file contradicts it'
  - 'the proposed fix would quietly weaken the check it was meant to protect'
  - 'no failing test, no error, no red run — the disagreement is entirely about what would happen'
stack:
  - GitHub Actions
  - 'bash (the default shell for `run:` steps)'
  - GitHub Pages deploy workflow
time_to_diagnose: 'under a minute each — one documentation lookup and one throwaway command. Neither was settled by thinking harder.'
recurrence_risk: 'high — the wrong version is widely repeated, sounds authoritative, and is correct for the *other* configuration, so a person who has met it before is more likely to be confidently wrong, not less'
tags:
  - github-actions
  - bash
  - errexit
  - pipefail
  - default-shell
  - ci-scripting
  - code-review
  - false-positive
  - verify-dont-infer
related:
  - './link-previews-open-graph-inheritance-and-image-content-type.md'
  - './nextjs-static-export-github-pages-source-and-subpath.md'
---

# Two confident claims about bash in GitHub Actions, both wrong

## What happened

A new deploy check was added to `.github/workflows/deploy.yml`. It fetches the
site's link-preview image after publishing and fails if the server sends it back
as the wrong file type. Because the image can take a few seconds to appear
everywhere, it tries up to five times before giving up:

```bash
for attempt in 1 2 3 4 5; do
  ct=$(curl -sI --max-time 10 "$url" | tr -d '\r' \
       | awk -F': ' 'tolower($1)=="content-type"{print tolower($2)}')
  case "$ct" in
    image/png*) echo "og.png served as $ct"; exit 0 ;;
  esac
  ...
done
echo "::error::og.png is served as '${ct:-<none>}', not image/png. ..."
exit 1
```

Two separate claims were then made about this loop. Both were confident, both
were detailed, and both were wrong. Together they would have made the check
worse than the version they were meant to improve.

## Claim 1: "the retry loop aborts on the first network hiccup"

A reviewer said that GitHub Actions runs every step with two safety settings
turned on:

- **errexit** — stop the script the moment any command fails.
- **pipefail** — when commands are chained with `|`, count the whole chain as
  failed if *any* link failed, not just the last one.

If both were on, the reasoning went, then a failed `curl` would make the whole
`curl | tr | awk` chain count as failed, which would make the line assigning
`ct` count as failed, which would stop the script dead — on attempt one, before
any retry happened and before the helpful error message at the bottom ever
printed.

The reasoning is sound. The premise is not.

### What is actually true

GitHub Actions uses two different shells depending on whether the workflow says
which one it wants:

| What the step says | What GitHub actually runs | errexit | pipefail |
|---|---|---|---|
| nothing — no `shell:` key | `bash -e {0}` | yes | **no** |
| `shell: bash` | `bash --noprofile --norc -eo pipefail {0}` | yes | **yes** |

This workflow names no shell anywhere, and has no `defaults:` block setting one,
so it gets the first row. **pipefail is off.**

With pipefail off, the chain's result is whatever the last command returned.
The last command is `awk`, and `awk` succeeds even when it is handed nothing at
all. So a failed `curl` produces an empty `ct`, the script carries on, and the
loop retries exactly as designed.

Confirmed by running the real thing against a host that does not exist:

```bash
$ bash -e -c 'ct=$(curl -sI "https://this-host-does-not-exist-xyz.invalid/og.png" \
    | tr -d "\r" | awk -F": " "tolower(\$1)==\"content-type\"{print tolower(\$2)}"); \
    echo "survived errexit; ct=[${ct}]"'
survived errexit; ct=[]
exit=0
```

### Why acting on it would have hurt

The suggested fix was to add `|| true` to the end of the assignment, which tells
the shell to ignore any failure on that line. That would have papered over
genuine `curl` failures as well as imaginary ones — making a check whose entire
job is to notice problems slightly better at not noticing them.

## Claim 2: "`[ test ] && command` will swallow the error report"

The second claim was made while fixing something unrelated. The loop needed to
stop sleeping after its final attempt, and the obvious short form was:

```bash
[ "$attempt" -lt 5 ] && sleep 10
```

The worry: on the fifth pass the test is false, so the whole line reports
failure, so errexit stops the script — and the error message below it never
prints. This is a genuinely well-known bash trap, and it is real in other
places, most famously as the last line of a script.

It does not apply here. Bash explicitly excuses a command that fails at the
*head* of an `&&` chain; only the final command in the chain can trigger
errexit. Tested both ways:

```bash
$ bash -e -c 'for a in 1 2; do echo "attempt $a"; [ "$a" -lt 2 ] && sleep 0; done; \
    echo "REACHED THE ERROR REPORT"'
attempt 1
attempt 2
REACHED THE ERROR REPORT
exit=0
```

Both forms are safe. The `if` form was used anyway, because it reads more
clearly:

```bash
if [ "$attempt" -lt 5 ]; then sleep 10; fi
```

### Why acting on it would have hurt

Not the code — the code is fine either way. The damage would have been a comment
in the deploy file confidently explaining a hazard that does not exist. Wrong
code eventually fails a test. A wrong explanation sitting in a file is believed,
and it steers whoever reads it next, for as long as the file lives.

## The pattern underneath both

Both claims came from reasoning correctly about the wrong runtime. Nothing in
the file being read was misunderstood. The mistake in each case was about what
would happen when something else — GitHub's runner, bash's own rules — got
involved.

This is the same shape as the two failures already documented in this folder. A
static export looked correct on disk and was served wrongly by GitHub Pages. A
preview image had perfectly valid contents and was labelled wrongly by GitHub
Pages. Reading the source told the wrong story every time; only running
something told the right one.

## Prevention

**Check which shell a workflow actually gets before reasoning about failures.**
One command answers it:

```bash
grep -n "shell:\|defaults:" .github/workflows/*.yml
```

No output means every step is running under `bash -e {0}`, with pipefail off.

**Make a claim about runtime behaviour cheap to test, then test it.** Both of
these took one throwaway command. Neither would have been resolved by more
careful reading, because both were about behaviour that is not visible in the
file.

**Treat a review finding as a hypothesis, not a verdict.** The first claim was
detailed, well-argued, and wrong. Sending it straight to a fix would have
weakened the check. A finding worth acting on is worth one minute of checking
first.

**Be most careful with claims that are true somewhere else.** Both of these are
correct in a neighbouring situation — pipefail really is on when a workflow says
`shell: bash`, and the `&&` trap really does bite at the end of a script.
Half-right knowledge is more dangerous than no knowledge, because it comes with
confidence attached.

## Also worth knowing

- **The default shell is a per-step decision, and adding `shell: bash` changes
  behaviour retroactively.** Any workflow that later adopts `shell: bash` turns
  pipefail on for that step, and the first claim above becomes true. If that
  ever happens here, the retry loop genuinely will need `|| true` or an
  equivalent guard.
- **`awk` succeeding on empty input is what makes the loop safe**, and that is
  quiet, load-bearing behaviour rather than a deliberate design choice. It is
  worth knowing it is doing the work.
- **`curl` without `-f` treats an HTTP error page as success.** A 404 is not a
  curl failure; the command exits 0 and reports whatever type the error page
  was. This is fine for this check — the wrong type does not match, and the loop
  retries — but it means "curl succeeded" and "the file is there" are different
  statements.

## Sources

- [Workflow syntax for GitHub Actions — `jobs.<job_id>.steps[*].shell`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell) — the table of what each shell option runs, including the unspecified default.
- `./link-previews-open-graph-inheritance-and-image-content-type.md` — the failure this deploy check exists to prevent.
- `./nextjs-static-export-github-pages-source-and-subpath.md` — the same shape again: correct locally, wrong once GitHub is serving it.
