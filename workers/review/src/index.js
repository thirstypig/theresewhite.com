// Review comments for the two one-page subdomains, book.theresewhite.com and
// calculator.theresewhite.com, while they are still unpublicized. Adapted from
// the VIPOK project's review Worker (~/Projects/vipok/worker).
//
//   GET  /comments?thread=book:en:home      → { comments: [...] } newest first
//   POST /comments {thread, text, xPercent?, yPercent?} → { comment }
//
// KV key = thread id, value = JSON array of comments. The thread regex is the
// only thing standing between a request and the rest of the namespace, so keep
// it strict. Remove this Worker when the pages launch (see DEPLOY.md, "Reviewer feedback").

import { validThread, parseComment, newestFirst, MAX_BODY, MAX_PER_THREAD } from "./lib.js";

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });

async function readList(env, thread) {
  const raw = await env.COMMENTS.get(thread);
  if (!raw) return [];
  try { const list = JSON.parse(raw); return Array.isArray(list) ? list : []; } catch { return []; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = cors(request.headers.get("Origin") || "", env);
    // Browsers from any other origin get no CORS headers and are refused outright.
    // (This stops other sites, not curl: the endpoint is open by design.)
    if (!corsHeaders) return json({ error: "Origin not allowed" }, 403);
    if (url.pathname !== "/comments") return json({ error: "Not found" }, 404, corsHeaders);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

    if (request.method === "GET") {
      const thread = url.searchParams.get("thread");
      if (!validThread(thread)) return json({ error: "Invalid thread" }, 400, corsHeaders);
      return json({ comments: newestFirst(await readList(env, thread)) }, 200, corsHeaders);
    }

    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > MAX_BODY) return json({ error: "Request too large" }, 413, corsHeaders);
      let body;
      try { body = JSON.parse(raw); } catch { return json({ error: "Body must be JSON" }, 400, corsHeaders); }
      const { comment, error } = parseComment(body, { id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      if (error) return json({ error }, 400, corsHeaders);
      // Read-modify-write is not atomic in KV: two posts in the same instant can
      // drop one. Fine for a handful of reviewers; use a Durable Object if not.
      const list = await readList(env, body.thread);
      if (list.length >= MAX_PER_THREAD) return json({ error: "This page has too many comments" }, 409, corsHeaders);
      list.push(comment);
      await env.COMMENTS.put(body.thread, JSON.stringify(list));
      return json({ comment }, 201, corsHeaders);
    }

    return json({ error: "Method not allowed" }, 405, { ...corsHeaders, Allow: "GET, POST, OPTIONS" });
  },
};
