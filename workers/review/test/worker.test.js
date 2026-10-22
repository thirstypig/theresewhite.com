import { test } from "vitest";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { validThread, parseComment, newestFirst, MAX_TEXT, MAX_PER_THREAD } from "../src/lib.js";

// The comments service for book.theresewhite.com and calculator.theresewhite.com.
// Every test here is a way it could leak, lose or accept comments it shouldn't.
const ORIGIN = "https://book.theresewhite.com";
const SECOND_ORIGIN = "https://calculator.theresewhite.com";
const fakeKV = (seed = {}) => {
  const store = new Map(Object.entries(seed));
  return { store, get: async k => store.get(k) ?? null, put: async (k, v) => { store.set(k, v); } };
};
const env = kv => ({ COMMENTS: kv, ALLOWED_ORIGINS: `${ORIGIN}, ${SECOND_ORIGIN}` });
const req = (path, { method = "GET", body, origin = ORIGIN } = {}) =>
  new Request("https://theresewhite-review.example.workers.dev" + path, {
    method,
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });

test("thread regex accepts page:route slugs only", () => {
  for (const ok of ["index:en:home", "index:en:practitioner-terms", "index:zh-hant:portal", "b:en:home"]) assert.ok(validThread(ok), ok);
  for (const bad of ["", "index", "index:home", "index:en:", ":en:home", "Index:en:home", "index:en:home ", "index:en:../x",
    "index:en:a--b", "index:en:home:x", "index:zh_Hant:home", "__proto__",
    "x".repeat(30) + ":en:" + "y".repeat(50), null, 42]) assert.ok(!validThread(bad), String(bad));
});

test("parseComment trims, rejects empty and over-long text", () => {
  const meta = { id: "1", createdAt: "2026-09-29T00:00:00.000Z" };
  assert.equal(parseComment({ thread: "index:en:home", text: "  hi \n" }, meta).comment.text, "hi");
  assert.match(parseComment({ thread: "index:en:home", text: "   " }, meta).error, /empty/);
  assert.match(parseComment({ thread: "index:en:home", text: 5 }, meta).error, /empty/);
  assert.match(parseComment({ thread: "index:en:home", text: "x".repeat(MAX_TEXT + 1) }, meta).error, /longer/);
  assert.ok(parseComment({ thread: "index:en:home", text: "x".repeat(MAX_TEXT) }, meta).comment);
  assert.match(parseComment({ thread: "nope", text: "hi" }, meta).error, /thread/);
  assert.match(parseComment(null, meta).error, /object/);
});

test("parseComment pins need both coordinates in 0–100", () => {
  const meta = { id: "1", createdAt: "t" };
  const base = { thread: "index:en:home", text: "hi" };
  assert.deepEqual(parseComment({ ...base, xPercent: 12.3456, yPercent: 0 }, meta).comment,
    { id: "1", text: "hi", createdAt: "t", xPercent: 12.35, yPercent: 0 });
  assert.match(parseComment({ ...base, xPercent: 5 }, meta).error, /both/);
  assert.match(parseComment({ ...base, xPercent: 101, yPercent: 5 }, meta).error, /0–100/);
  assert.match(parseComment({ ...base, xPercent: "5", yPercent: 5 }, meta).error, /0–100/);
  assert.match(parseComment({ ...base, xPercent: NaN, yPercent: 5 }, meta).error, /0–100/);
  assert.equal(parseComment({ ...base, xPercent: null, yPercent: null }, meta).comment.xPercent, undefined);
});

test("newestFirst sorts by createdAt descending", () => {
  const list = [{ createdAt: "2026-09-29T01:00:00Z" }, { createdAt: "2026-09-29T03:00:00Z" }, { createdAt: "2026-09-29T02:00:00Z" }];
  assert.deepEqual(newestFirst(list).map(c => c.createdAt[12]), ["3", "2", "1"]);
});

test("POST then GET round-trips, newest first, stored under the thread key", async () => {
  const kv = fakeKV();
  const a = await worker.fetch(req("/comments", { method: "POST", body: { thread: "index:en:portal", text: "first" } }), env(kv));
  assert.equal(a.status, 201);
  assert.equal(a.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  await new Promise(r => setTimeout(r, 2));
  await worker.fetch(req("/comments", { method: "POST", body: { thread: "index:en:portal", text: "second", xPercent: 50, yPercent: 20 } }), env(kv));
  assert.deepEqual([...kv.store.keys()], ["index:en:portal"]);
  const res = await worker.fetch(req("/comments?thread=index:en:portal"), env(kv));
  const { comments } = await res.json();
  assert.deepEqual(comments.map(c => c.text), ["second", "first"]);
  assert.equal(comments[0].yPercent, 20);
});

test("invalid thread cannot read or write other keys", async () => {
  const kv = fakeKV({ secret: '["nope"]' });
  assert.equal((await worker.fetch(req("/comments?thread=secret"), env(kv))).status, 400);
  assert.equal((await worker.fetch(req("/comments"), env(kv))).status, 400);
  const w = await worker.fetch(req("/comments", { method: "POST", body: { thread: "secret", text: "x" } }), env(kv));
  assert.equal(w.status, 400);
  assert.equal(kv.store.get("secret"), '["nope"]');
});

test("CORS: other origins are refused; preflight works", async () => {
  const kv = fakeKV();
  const evil = await worker.fetch(req("/comments", { method: "POST", origin: "https://evil.example", body: { thread: "index:en:home", text: "x" } }), env(kv));
  assert.equal(evil.status, 403);
  assert.equal(evil.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(kv.store.size, 0);
  const pre = await worker.fetch(req("/comments", { method: "OPTIONS" }), env(kv));
  assert.equal(pre.status, 204);
  assert.match(pre.headers.get("Access-Control-Allow-Methods"), /POST/);
});

test("bad JSON, huge bodies, full threads and other methods are rejected", async () => {
  const kv = fakeKV();
  assert.equal((await worker.fetch(req("/comments", { method: "POST", body: "{nope" }), env(kv))).status, 400);
  assert.equal((await worker.fetch(req("/comments", { method: "POST", body: "x".repeat(9000) }), env(kv))).status, 413);
  assert.equal((await worker.fetch(req("/comments", { method: "DELETE" }), env(kv))).status, 405);
  assert.equal((await worker.fetch(req("/other"), env(kv))).status, 404);
  const full = fakeKV({ "index:en:home": JSON.stringify(Array.from({ length: MAX_PER_THREAD }, (_, i) => ({ id: String(i), text: "x", createdAt: "t" }))) });
  assert.equal((await worker.fetch(req("/comments", { method: "POST", body: { thread: "index:en:home", text: "one more" } }), env(full))).status, 409);
});

test("corrupt stored value reads as empty", async () => {
  const res = await worker.fetch(req("/comments?thread=index:en:home"), env(fakeKV({ "index:en:home": "{not json" })));
  assert.deepEqual(await res.json(), { comments: [] });
});

test("both review sites may call it, each in its own thread", async () => {
  const kv = fakeKV();
  const calc = await worker.fetch(
    req("/comments", { method: "POST", origin: SECOND_ORIGIN, body: { thread: "calculator:en:home", text: "calc" } }),
    env(kv),
  );
  assert.equal(calc.status, 201);
  assert.equal(calc.headers.get("Access-Control-Allow-Origin"), SECOND_ORIGIN);
  await worker.fetch(req("/comments", { method: "POST", body: { thread: "book:en:home", text: "book" } }), env(kv));
  assert.deepEqual([...kv.store.keys()].sort(), ["book:en:home", "calculator:en:home"]);
});
