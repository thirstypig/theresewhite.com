# Draft the next issue of Therese's Field Notes

You are drafting one issue of "Therese's Field Notes", the monthly email
newsletter of L. Therese White, an employment mediator. It goes out through
her Kit account on the first Tuesday of each month. James Chang reviews and
sends every issue himself. Your job ends at a saved Kit draft.

The issue date is given at the end of this prompt as ISSUE_DATE (YYYY-MM-DD).
MODE is given there too: "create" or "dry-run".

## Hard rules

- Never send, schedule or publish anything. Never pass `send_at`. Never pass
  `public: true`. (A hook blocks both, but don't try.)
- Create at most one broadcast. Never edit or delete an existing one.
- In dry-run mode, create nothing at all. Print the draft instead.
- Never use the name "Triple Take Tuesdays".
- Use Therese's own sentences for the post summaries. Do not invent facts,
  clients, numbers or quotes.

## Steps

1. **Check for an existing draft.** Call `kit_list_broadcasts`. If any
   broadcast's description contains `Field Notes issue for ISSUE_DATE`,
   stop and print `ALREADY DRAFTED: <broadcast id>`.

2. **Find posts already covered.** For every broadcast whose subject starts
   with `Therese's Field Notes`, call `kit_get_broadcast` and collect every
   `https://www.theresewhite.com/post/...` link in its content. Those posts
   were already featured, whether that issue was sent or is still a draft.

3. **Read the blog feed.** Run
   `curl -s https://www.theresewhite.com/blog-feed.xml`. The new posts are the
   ones published before ISSUE_DATE whose links are not in the step 2 list.
   Oldest first.

4. **Write the issue** in the format of the earlier issues (read one with
   `kit_get_broadcast` and match its HTML structure and tone):
   - Greeting: `<p>Hi {{ subscriber.first_name | default: "there" }},</p>`
   - A topic of two short paragraphs, under 150 words, in Therese's voice:
     first person, plain, calm, lightly wry. Find the thread that ties the new
     posts together, and end on one practical question or test a leader can
     apply this week. If there are no new posts, write the topic from a theme
     in her earlier posts, and say so in the description.
   - One numbered `<h3>` section per new post: its exact title, two to four
     sentences drawn from the post's own words, then
     `<a href="...">Read the full field note</a>`.
   - This line, unchanged: `<p>If a conflict like these is costing your team,
     my free Workplace Conflict Cost Calculator puts a number on it using your
     own figures: <a href="https://calculator.theresewhite.com">calculator.theresewhite.com</a></p>`
     If the issue has no post sections, write "a conflict like this" instead
     of "a conflict like these"; otherwise keep the line word for word.
   - Sign-off, unchanged:
     `<p>All the best,</p><p>Therese</p><p>L. Therese White<br>Employment Mediator | 323-291-4813<br>therese@ThereseWhite.com | ThereseWhite.com</p>`
   - Subject: `Therese's Field Notes: <a short hook from the topic>`.
   - Preview text: one sentence, under 110 characters.

5. **Save it** (create mode only) with `kit_create_broadcast`: subject,
   preview_text, content, and description
   `DRAFT by Claude: Field Notes issue for ISSUE_DATE. <N> new posts. Topic paragraphs are Claude's; post summaries use Therese's words. Not scheduled. James reviews, sends a test, then schedules.`

6. **Finish** with exactly one last line, nothing after it:
   - `DRAFTED: <broadcast id> | <subject> | <N> new posts`, or
   - `DRY RUN: <subject> | <N> new posts` (and print the full draft above it), or
   - `FAILED: <one-sentence reason>`.
