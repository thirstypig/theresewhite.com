// Feedback panel and click-to-place pins for book.theresewhite.com and
// calculator.theresewhite.com while they are under review. Comments are stored
// by the theresewhite-review Worker (workers/review/). Added to the published
// page by scripts/build-calculator-site.mjs (addReviewOverlay), never to the
// main site. Adapted from the VIPOK project's review/overlay.js. Remove before
// the pages launch.
//
// Each page has one thread, set at build time ("book:en:home",
// "calculator:en:home"). Pins are stored as a percentage of the whole page, so
// a pin placed on a desktop can sit off target on a phone, where the page is
// laid out differently.
//
// Comments are untrusted input: they are rendered with textContent only.
(function () {
  const cfg = window.TW_REVIEW || {};
  if (!cfg.thread) return;
  const OPEN_KEY = "tw-review-open";
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  const STYLES = `
#vr-tab,#vr-panel,#vr-pins,#vr-hint{--vr-bg:#fff;--vr-ink:#111827;--vr-muted:#4b5563;
  --vr-line:#d1d5db;--vr-brand:#1f3864;--vr-on-brand:#fff;--vr-sunk:#f3f4f6;
  font:14px/1.5 system-ui,sans-serif;color:var(--vr-ink)}
/* Sticky-note yellow: a color neither page uses, so the tab and the pins read
   as review tools and stay visible on the book page's navy and the
   calculator's blue. Ink on it is ~13:1. */
#vr-tab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:2147483000;writing-mode:vertical-rl;
  padding:16px 10px;border:1px solid #c9a400;border-right:0;border-radius:10px 0 0 10px;cursor:pointer;
  background:#ffd84d;color:#1d1600;font-weight:700;font-size:15px;letter-spacing:.02em;
  box-shadow:0 2px 4px rgba(0,0,0,.25),0 8px 20px rgba(0,0,0,.3)}
#vr-tab:hover{background:#ffe27a}
#vr-panel{position:fixed;top:0;right:0;bottom:0;z-index:2147483001;width:min(360px,100vw);display:flex;flex-direction:column;
  gap:10px;padding:14px;overflow:auto;background:var(--vr-bg);border-left:1px solid var(--vr-line);
  box-shadow:0 8px 24px rgba(0,0,0,.15);box-sizing:border-box}
#vr-panel .vr-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
#vr-panel .vr-title{margin:0;font-weight:700;font-size:16px}
#vr-panel .vr-route{color:var(--vr-muted);font-weight:400}
#vr-panel .vr-note{margin:0;color:var(--vr-muted);font-size:13px}
#vr-panel label,.vr-pop label{font-weight:600}
#vr-panel textarea,.vr-pop textarea{font:inherit;width:100%;box-sizing:border-box;min-height:84px;padding:8px 10px;resize:vertical;
  border:1px solid var(--vr-line);border-radius:8px;background:#f9fafb;color:var(--vr-ink)}
.vr-row{display:flex;gap:8px;flex-wrap:wrap}
.vr-btn{font:inherit;font-weight:600;padding:7px 12px;border-radius:8px;cursor:pointer;
  border:1px solid var(--vr-line);background:var(--vr-sunk);color:var(--vr-ink)}
.vr-btn.vr-primary{background:var(--vr-brand);border-color:var(--vr-brand);color:var(--vr-on-brand)}
.vr-btn:focus-visible,#vr-tab:focus-visible,.vr-pin:focus-visible{outline:3px solid var(--vr-brand);outline-offset:2px}
.vr-status{margin:0;min-height:1.5em;color:var(--vr-muted);font-size:13px}
.vr-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.vr-list li{padding:10px;border:1px solid var(--vr-line);border-radius:8px;background:#f9fafb}
.vr-list time{display:block;color:var(--vr-muted);font-size:12px}
.vr-text{margin:4px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
.vr-list .vr-btn{margin-top:6px;padding:3px 8px;font-size:12px}
.vr-empty{color:var(--vr-muted)}
#vr-pins{position:absolute;left:0;top:0;width:100%;z-index:2147482999;pointer-events:none}
.vr-pin{position:absolute;transform:translate(-50%,-50%);pointer-events:auto;width:28px;height:28px;border-radius:50%;
  display:grid;place-items:center;padding:0;cursor:pointer;font:700 13px/1 system-ui,sans-serif;
  background:#ffd84d;color:#1d1600;border:2px solid #1d1600;box-shadow:0 0 0 2px #fff,0 2px 6px rgba(0,0,0,.4)}
.vr-pin.vr-draft{opacity:.7}
.vr-pop{position:absolute;pointer-events:auto;width:min(280px,calc(100vw - 32px));box-sizing:border-box;display:grid;gap:8px;padding:12px;
  border-radius:10px;background:var(--vr-bg);border:1px solid var(--vr-line);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.vr-pop time{color:var(--vr-muted);font-size:12px}
#vr-hint{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:2147483002;display:flex;align-items:center;gap:10px;
  max-width:calc(100vw - 32px);box-sizing:border-box;padding:8px 8px 8px 14px;border-radius:999px;
  background:var(--vr-ink);color:var(--vr-bg);box-shadow:0 4px 12px rgba(0,0,0,.25)}
#vr-hint .vr-btn{padding:4px 10px}
html.vr-placing,html.vr-placing *{cursor:crosshair!important}
html.vr-placing #vr-panel,html.vr-placing #vr-panel *,html.vr-placing #vr-hint,html.vr-placing #vr-hint *{cursor:auto!important}
@media (max-width:640px){#vr-panel{width:100vw;border-left:0}}
[hidden]{display:none!important}`;

  const el = (tag, props = {}, kids = []) => {
    const n = Object.assign(document.createElement(tag), props);
    for (const k of kids) n.append(k);
    return n;
  };
  const fmt = iso => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  };

  function mount() {
    const currentThread = () => cfg.thread;

    document.head.append(el("style", { textContent: STYLES }));

    // ---------- DOM ----------
    const tab = el("button", { id: "vr-tab", type: "button" });
    tab.setAttribute("aria-controls", "vr-panel");
    const closeBtn = el("button", { type: "button", className: "vr-btn", textContent: "Close" });
    closeBtn.setAttribute("aria-label", "Close feedback");
    const routeLabel = el("span", { className: "vr-route" });
    const text = el("textarea", { id: "vr-text", maxLength: 2000 });
    const addBtn = el("button", { type: "submit", className: "vr-btn vr-primary", textContent: "Add comment" });
    const pinBtn = el("button", { type: "button", className: "vr-btn", textContent: "Pin on page" });
    const status = el("p", { className: "vr-status" });
    status.setAttribute("role", "status");
    const list = el("ol", { className: "vr-list" });
    list.setAttribute("aria-label", "Comments on this page, newest first");
    const form = el("form", {}, [
      el("label", { htmlFor: "vr-text", textContent: "Comment on this page" }), text,
      el("div", { className: "vr-row" }, [addBtn, pinBtn]),
    ]);
    form.style.cssText = "display:grid;gap:6px";
    const panel = el("aside", { id: "vr-panel", hidden: true }, [
      el("div", { className: "vr-head" }, [el("p", { className: "vr-title" }, ["Feedback ", routeLabel]), closeBtn]),
      el("p", { className: "vr-note", textContent: "Comments are not private: other reviewers see them, and so could anyone who finds where they are stored. Don't include anything confidential. Use Pin on page to point at a spot." }),
      form, status, list,
    ]);
    panel.setAttribute("aria-label", "Review feedback");
    const layer = el("div", { id: "vr-pins" });
    const hint = el("div", { id: "vr-hint", hidden: true }, [
      el("span", { textContent: "Click the page to place a pin. Esc cancels." }),
      el("button", { type: "button", className: "vr-btn", textContent: "Cancel" }),
    ]);
    hint.setAttribute("role", "status");
    document.body.append(layer, tab, panel, hint);

    // ---------- state ----------
    let thread = currentThread();
    let comments = [];
    let loadSeq = 0;
    let placing = false;
    let pop = null;           // open composer/viewer element

    // ---------- layer sizing: pins are % of the full document ----------
    function sizeLayer() {
      layer.style.height = "0px";
      const de = document.documentElement;
      layer.style.height = de.scrollHeight + "px";
      layer.style.width = de.scrollWidth + "px";
    }
    new ResizeObserver(() => sizeLayer()).observe(document.body);
    addEventListener("resize", sizeLayer);

    // ---------- open / close ----------
    function setOpen(open, focus = true) {
      panel.hidden = !open;
      tab.hidden = open;
      tab.setAttribute("aria-expanded", String(open));
      store.set(OPEN_KEY, open ? "1" : "0");
      if (focus) (open ? text : tab).focus();
    }
    tab.addEventListener("click", () => setOpen(true));
    closeBtn.addEventListener("click", () => setOpen(false));

    // ---------- API ----------
    async function api(path, init) {
      if (!cfg.api) throw new Error("Comments aren't connected yet (no endpoint configured).");
      const res = await fetch(cfg.api.replace(/\/$/, "") + path, init);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
      return body;
    }
    async function load() {
      const seq = ++loadSeq;
      thread = currentThread();
      comments = [];
      status.textContent = "Loading…";
      render();
      try {
        const body = await api(`/comments?thread=${encodeURIComponent(thread)}`);
        if (seq !== loadSeq) return;                 // the route changed meanwhile
        comments = Array.isArray(body.comments) ? body.comments : [];
        status.textContent = "";
      } catch (err) {
        if (seq !== loadSeq) return;
        status.textContent = err.message;
      }
      render();
    }
    async function post(fields) {
      const body = await api("/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread, ...fields }),
      });
      comments.unshift(body.comment);
      render();
      return body.comment;
    }

    // ---------- render ----------
    function pinNumbers() {
      // Oldest pin is 1, so numbers stay put as new comments arrive.
      const pinned = comments.filter(c => typeof c.xPercent === "number")
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return new Map(pinned.map((c, i) => [c.id, i + 1]));
    }
    function render() {
      tab.textContent = `Feedback (${comments.length})`;
      routeLabel.textContent = "\u00b7 " + thread.split(":")[0];
      const nums = pinNumbers();

      list.replaceChildren();
      if (!comments.length) list.append(el("li", { className: "vr-empty", textContent: "No comments on this page yet." }));
      for (const c of comments) {
        const t = el("time", { dateTime: c.createdAt, textContent: fmt(c.createdAt) });
        const li = el("li", {}, [t, el("p", { className: "vr-text", textContent: c.text })]);
        if (nums.has(c.id)) {
          const show = el("button", { type: "button", className: "vr-btn", textContent: `Show pin ${nums.get(c.id)}` });
          show.addEventListener("click", () => showPin(c));
          li.append(show);
        }
        list.append(li);
      }

      layer.querySelectorAll(".vr-pin:not(.vr-draft)").forEach(n => n.remove());
      for (const c of comments) {
        if (!nums.has(c.id)) continue;
        const n = nums.get(c.id);
        const pin = el("button", { type: "button", className: "vr-pin", textContent: String(n) });
        pin.dataset.id = c.id;
        pin.style.left = c.xPercent + "%";
        pin.style.top = c.yPercent + "%";
        pin.setAttribute("aria-label", `Pin ${n}: ${c.text.slice(0, 80)}`);
        pin.addEventListener("click", e => { e.stopPropagation(); openViewer(c, n); });
        layer.append(pin);
      }
      sizeLayer();
    }

    // ---------- popups (never alert/prompt/confirm: they freeze CDP sessions) ----------
    function closePop() {
      if (!pop) return;
      pop.remove();
      pop = null;
      layer.querySelectorAll(".vr-draft").forEach(n => n.remove());
    }
    function placePop(node, xPct, yPct) {
      closePop();
      pop = node;
      const w = layer.offsetWidth, h = layer.offsetHeight;
      const x = (xPct / 100) * w, y = (yPct / 100) * h;
      // Open beside the pin, kept inside the page's width.
      node.style.left = Math.max(8, Math.min(x + 18, w - Math.min(280, w - 32) - 8)) + "px";
      node.style.top = y + 18 + "px";
      layer.append(node);
    }
    function openViewer(c, n) {
      const close = el("button", { type: "button", className: "vr-btn", textContent: "Close" });
      const node = el("div", { className: "vr-pop" }, [
        el("time", { dateTime: c.createdAt, textContent: `Pin ${n} · ${fmt(c.createdAt)}` }),
        el("p", { className: "vr-text", textContent: c.text }),
        el("div", { className: "vr-row" }, [close]),
      ]);
      node.setAttribute("role", "dialog");
      node.setAttribute("aria-label", `Pin ${n}`);
      close.addEventListener("click", closePop);
      placePop(node, c.xPercent, c.yPercent);
      close.focus();
    }
    function showPin(c) {
      const pin = layer.querySelector(`.vr-pin[data-id="${CSS_ESCAPE(c.id)}"]`);
      if (!pin) return;
      pin.scrollIntoView({ block: "center", behavior: "smooth" });
      openViewer(c, Number(pin.textContent));
    }
    const CSS_ESCAPE = s => (window.CSS && window.CSS.escape ? window.CSS.escape(s) : String(s).replace(/[^\w-]/g, "\\$&"));

    function openComposer(xPct, yPct) {
      const draft = el("span", { className: "vr-pin vr-draft", textContent: "+" });
      draft.style.left = xPct + "%";
      draft.style.top = yPct + "%";
      const area = el("textarea", { id: "vr-pin-text", maxLength: 2000 });
      const save = el("button", { type: "submit", className: "vr-btn vr-primary", textContent: "Save pin" });
      const cancel = el("button", { type: "button", className: "vr-btn", textContent: "Cancel" });
      const msg = el("p", { className: "vr-status" });
      msg.setAttribute("role", "status");
      const node = el("form", { className: "vr-pop" }, [
        el("label", { htmlFor: "vr-pin-text", textContent: "Pin comment" }), area,
        el("div", { className: "vr-row" }, [save, cancel]), msg,
      ]);
      cancel.addEventListener("click", closePop);
      node.addEventListener("submit", async e => {
        e.preventDefault();
        if (!area.value.trim()) { msg.textContent = "Write a comment first."; area.focus(); return; }
        save.disabled = true;
        msg.textContent = "Saving…";
        try {
          await post({ text: area.value, xPercent: xPct, yPercent: yPct });
          closePop();
        } catch (err) {
          msg.textContent = err.message;
          save.disabled = false;
        }
      });
      placePop(node, xPct, yPct);
      layer.append(draft);
      area.focus();
    }

    // ---------- placement mode ----------
    function onPlaceClick(e) {
      if (e.target.closest("#vr-panel, #vr-tab, #vr-hint, .vr-pop")) return;
      // Capture phase + preventDefault: a click on a real link or button places
      // the pin instead of navigating or submitting.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const de = document.documentElement;
      const x = Math.min(100, Math.max(0, (e.pageX / de.scrollWidth) * 100));
      const y = Math.min(100, Math.max(0, (e.pageY / de.scrollHeight) * 100));
      stopPlacing();
      openComposer(x, y);
    }
    function startPlacing() {
      closePop();
      placing = true;
      document.documentElement.classList.add("vr-placing");
      hint.hidden = false;
      document.addEventListener("click", onPlaceClick, true);
    }
    function stopPlacing() {
      placing = false;
      document.documentElement.classList.remove("vr-placing");
      hint.hidden = true;
      document.removeEventListener("click", onPlaceClick, true);
    }
    pinBtn.addEventListener("click", startPlacing);
    hint.querySelector("button").addEventListener("click", () => { stopPlacing(); pinBtn.focus(); });
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if (placing) { stopPlacing(); pinBtn.focus(); }
      else if (pop) closePop();
    });

    // ---------- sidebar comment ----------
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!text.value.trim()) { status.textContent = "Write a comment first."; text.focus(); return; }
      addBtn.disabled = true;
      status.textContent = "Saving…";
      try {
        await post({ text: text.value });
        text.value = "";
        status.textContent = "Comment added.";
      } catch (err) {
        status.textContent = err.message;
      }
      addBtn.disabled = false;
    });

    setOpen(store.get(OPEN_KEY) === "1", false);
    load();
  }

  const start = () => {
    if (document.documentElement.classList.contains("vr-locked")) document.addEventListener("vr-unlocked", mount, { once: true });
    else mount();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
