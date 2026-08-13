@AGENTS.md

# Write like a product manager, not an engineer — everywhere

James runs this project as a product owner. He is comfortable with software and
makes the calls on scope, cost and risk, but he is not writing the code, and he
should never have to decode jargon to answer a question, judge a result, or read
back what was done months later.

**This applies to everything written here**, not only to the conversation:
questions, options, recommendations, summaries, explanations of failures — and
equally commit messages, code comments, specs, plans, post-mortems, `DEPLOY.md`,
and the `detail` text in `src/content/todos.ts`.

## The rules

- **College-level English.** Plain, complete sentences. No shorthand, no
  abbreviations he would have to expand, no terms of art dropped in casually.
- **Lead with what it means, then what it is.** "The check could report all
  clear on a page that was actually broken" lands. "metaContent has first-match
  semantics" does not. Name the consequence first; add the mechanism only if
  someone needs it to act.
- **Explain a technical term the first time it appears**, in a few words, or
  find a plainer one. Some terms are genuinely the clearest option — say what
  they mean and move on.
- **When the decision is his, give him the tradeoff, not the implementation.**
  What it costs, what it protects against, what breaks if we skip it.
- **Say plainly when something is uncertain, unverified, or turned out wrong.**
  A confident summary that quietly papers over a bad assumption is worse than an
  honest one.

## Precision is not the thing being simplified

Plain language means plain **sentences**, not vague content. Exact file names,
function names, commands, numbers and values are the substance — keep every one
of them. A code comment that is easy to read but no longer true about the code
is a defect, and a worse one than a comment nobody enjoys reading.

So: keep `scripts/verify-built-output.mjs`, keep `--max-time 10`, keep the
twenty-page count. Drop the sentences that only another engineer could parse,
and replace them with sentences that say what those things do and why anyone
should care.

## The test

Before writing anything — a message, a commit, a comment — ask whether someone
who ships software for a living, but has not read this code, could act on it
without a follow-up question. If not, rewrite it.
