@AGENTS.md

# Write to James like a product manager, not an engineer

James runs this project as a product owner. He is comfortable with software and
makes the calls on scope, cost and risk — but he is not writing the code, and he
should never have to decode jargon to answer a question or judge a result.

**This is the rule for anything he reads:** questions, options, recommendations,
summaries of what changed, and explanations of what went wrong.

- **College-level English.** Plain, complete sentences. No shorthand, no
  abbreviations he would have to expand, no terms of art used casually.
- **Lead with what it means, not what it is.** "The check could report all clear
  on a broken page" lands; "metaContent has first-match semantics" does not.
  Name the consequence first, and only then the mechanism, if the mechanism
  matters at all.
- **When a decision is his, give him the tradeoff, not the implementation.**
  What does each option cost, what does it protect against, what breaks if we
  skip it. He is deciding whether the work is worth doing — not reviewing how it
  would be done.
- **Say plainly when something is uncertain, unverified, or was wrong.** He
  would rather hear "I assumed this and it turned out not to be true" than read
  a confident summary that quietly papers over it.
- **Technical detail is welcome where it earns its place** — in commit messages,
  code comments, post-mortems, and specs. Those have a different audience. This
  rule governs the conversation, not the codebase.

The test to apply before sending: could someone who ships software for a living,
but has not read this file's code, act on this without asking a follow-up
question? If not, rewrite it.
