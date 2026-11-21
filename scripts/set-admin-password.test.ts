import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, it, expect } from "vitest";
import { passwordMatches, resolvePasswordHash } from "../src/lib/admin-password";

/**
 * scripts/set-admin-password.sh is how James changes the password for /admin
 * and the style bible. It scrambles the password in the terminal; the site
 * scrambles what a visitor types in the browser (src/lib/admin-password.ts).
 * If the two ever scramble differently, James saves a password that opens
 * nothing and is locked out of his own pages.
 *
 * So these tests run the real script and hand its result to the real check.
 * The one stand-in is `gh`, the GitHub command the script ends with: a fake
 * that records what it was asked to save, so no test touches GitHub.
 */
const SCRIPT = fileURLToPath(new URL("./set-admin-password.sh", import.meta.url));

const tempDirs: string[] = [];
afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Runs the script as if `typed` were entered at its prompts. */
function run(typed: string[]) {
  const dir = mkdtempSync(join(tmpdir(), "set-admin-password-"));
  tempDirs.push(dir);
  const saved = join(dir, "saved.txt");
  writeFileSync(join(dir, "gh"), `#!/usr/bin/env bash\nprintf '%s\\n' "$@" > "${saved}"\n`);
  chmodSync(join(dir, "gh"), 0o755);

  const result = spawnSync("bash", [SCRIPT], {
    input: typed.map((line) => `${line}\n`).join(""),
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}` },
    encoding: "utf8",
  });
  return {
    status: result.status,
    stderr: result.stderr,
    /** The arguments `gh` was called with, or null if it was never called. */
    saved: existsSync(saved) ? readFileSync(saved, "utf8").trimEnd().split("\n") : null,
  };
}

describe("set-admin-password.sh", () => {
  it("saves a hash that the site accepts for exactly the password typed", async () => {
    const { status, saved } = run(["Correct Horse 7", "Correct Horse 7"]);

    expect(status).toBe(0);
    expect(saved?.slice(0, 4)).toEqual(["variable", "set", "NEXT_PUBLIC_ADMIN_PASSWORD_HASH", "--body"]);
    const hash = saved![4];

    // The build accepts the value as it was saved...
    expect(resolvePasswordHash(hash)).toBe(hash);
    // ...and the password screen opens for that password and no near miss.
    expect(await passwordMatches("Correct Horse 7", hash)).toBe(true);
    expect(await passwordMatches("correct horse 7", hash)).toBe(false);
    expect(await passwordMatches("Correct Horse 7 ", hash)).toBe(false);
  });

  it("keeps spaces at the ends of the password, as the password screen does", async () => {
    // The screen compares exactly what was typed. If the script trimmed the
    // password first, one saved with a space at the end could never be entered.
    const { saved } = run([" spaced out ", " spaced out "]);
    expect(await passwordMatches(" spaced out ", saved![4])).toBe(true);
  });

  it("changes nothing when the two entries differ", () => {
    const { status, saved, stderr } = run(["Correct Horse 7", "Correct Horse 8"]);
    expect(status).toBe(1);
    expect(saved).toBeNull();
    expect(stderr).toMatch(/didn't match/);
  });

  it("refuses an empty password", () => {
    // An empty password would hash to a real value and "work", leaving the
    // pages open to anyone who presses Enter.
    const { status, saved } = run(["", ""]);
    expect(status).toBe(1);
    expect(saved).toBeNull();
  });
});
