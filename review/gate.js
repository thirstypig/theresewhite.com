// Password screen for book.theresewhite.com and calculator.theresewhite.com
// while they are under review. Added to the published page by
// scripts/build-calculator-site.mjs (addReviewOverlay) when the
// REVIEW_PASSPHRASE_HASH repository variable is set. Adapted from the VIPOK
// project's review/gate.js.
//
// NOT SECURITY. The expected hash ships in this page, and the page source is
// public anyway (thirstypig/theresewhite-book and -calculator). It keeps
// casual visitors and crawlers out of an unfinished page; anything truly
// private needs server-side protection. Remove before the pages launch.
//
// The password is compared after trimming and lowercasing, so "Blue Heron"
// and "blue heron" both work. scripts/set-review-passphrase.sh hashes it the
// same way.
(() => {
  const cfg = window.TW_REVIEW || {};
  if (!cfg.hash) return;
  const KEY = "tw-review-unlocked";
  const SALT = "theresewhite-review:";
  const root = document.documentElement;

  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch {}
  if (stored === cfg.hash) return;             // unlocked before, same password

  root.classList.add("vr-locked");
  const style = document.createElement("style");
  // Hidden (not display:none) so the layout is ready the moment it unlocks;
  // hidden content also can't take keyboard focus.
  style.textContent = `
html.vr-locked body{visibility:hidden;overflow:hidden}
#vr-gate{visibility:visible;position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:16px;
  background:#f3f4f6;color:#111827;font:16px/1.5 system-ui,sans-serif}
#vr-gate form{width:min(360px,100%);display:grid;gap:10px;padding:24px;border-radius:14px;
  background:#fff;border:1px solid #d1d5db;box-shadow:0 8px 24px rgba(0,0,0,.1)}
#vr-gate .vr-gate-title{margin:0;font-weight:700;font-size:18px}
#vr-gate .vr-gate-note{margin:0;color:#4b5563;font-size:14px}
#vr-gate label{font-weight:600;font-size:14px}
#vr-gate input{font:inherit;padding:10px 12px;border-radius:8px;border:1px solid #9ca3af;background:#fff;color:inherit}
#vr-gate button{font:inherit;font-weight:600;padding:10px 12px;border:0;border-radius:8px;cursor:pointer;
  background:#1f3864;color:#fff}
#vr-gate .vr-gate-err{margin:0;min-height:1.5em;color:#111827;font-size:14px}`;
  document.head.appendChild(style);

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function mount() {
    const gate = document.createElement("div");
    gate.id = "vr-gate";
    gate.innerHTML = `
<form novalidate>
  <p class="vr-gate-title">L. Therese White: page under review</p>
  <p class="vr-gate-note">This page is not public yet. Enter the review password you were given.</p>
  <label for="vr-pass">Review password</label>
  <input id="vr-pass" type="password" autocomplete="current-password" required>
  <button type="submit">Open the page</button>
  <p class="vr-gate-err" role="alert"></p>
</form>`;
    document.body.appendChild(gate);
    const input = gate.querySelector("input");
    const err = gate.querySelector(".vr-gate-err");
    input.focus();
    gate.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault();
      if ((await sha256(SALT + input.value.trim().toLowerCase())) !== cfg.hash) {
        err.textContent = "That password didn't match. Try again.";
        input.select();
        return;
      }
      try { localStorage.setItem(KEY, cfg.hash); } catch {}
      gate.remove();
      root.classList.remove("vr-locked");
      document.dispatchEvent(new CustomEvent("vr-unlocked"));
    });
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
