// Validation for review comments. Kept apart from index.js because the
// Workers runtime accepts only handlers as named exports of the main module.

// "<site>:<lang>:<page>", lowercase slugs: book:en:home, calculator:en:home.
const SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";
export const THREAD_RE = new RegExp(`^${SLUG}:${SLUG}:${SLUG}$`);
export const MAX_THREAD = 80;
export const MAX_TEXT = 2000;
export const MAX_BODY = 8192;
export const MAX_PER_THREAD = 500;

export function validThread(t) {
  return typeof t === "string" && t.length <= MAX_THREAD && THREAD_RE.test(t);
}

const pct = v => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100;

// Returns { comment } or { error }. id and createdAt come from the caller so tests are deterministic.
export function parseComment(body, { id, createdAt }) {
  if (!body || typeof body !== "object") return { error: "Body must be a JSON object" };
  if (!validThread(body.thread)) return { error: "Invalid thread" };
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return { error: "Comment is empty" };
  if (text.length > MAX_TEXT) return { error: `Comment is longer than ${MAX_TEXT} characters` };
  const hasX = body.xPercent !== undefined && body.xPercent !== null;
  const hasY = body.yPercent !== undefined && body.yPercent !== null;
  if (hasX !== hasY) return { error: "A pin needs both xPercent and yPercent" };
  const comment = { id, text, createdAt };
  if (hasX) {
    if (!pct(body.xPercent) || !pct(body.yPercent)) return { error: "Pin position must be 0–100" };
    comment.xPercent = Math.round(body.xPercent * 100) / 100;
    comment.yPercent = Math.round(body.yPercent * 100) / 100;
  }
  return { comment };
}

export const newestFirst = list => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
