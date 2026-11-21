import { describe, it, expect } from "vitest";
import { resolvePasswordHash, passwordMatches } from "./admin-password";

/**
 * The password that opens /admin and the style bible pages is stored only as
 * a scrambled copy (a SHA-256 hash), which the deploy reads from the
 * NEXT_PUBLIC_ADMIN_PASSWORD_HASH repository variable.
 *
 * Two ways this can go wrong, and both lock the wrong people in or out:
 * the setting is missing and nobody can get in, or the setting is garbled and
 * the old password keeps working while James believes he changed it.
 *
 * The hashes below were worked out by hand with
 * `printf %s 'correct horse' | shasum -a 256`, not by the code under test.
 */
const BUILT_IN_HASH = "eeb9a5fd80b393f2135c167f2a299db494a8b10deb06dd3ee618c38e37ce311f";
const CORRECT_HORSE_HASH = "4104d36f8da2c254349f85836793ebe029e0c957063a34c91c2e9203187b5631";

describe("resolvePasswordHash", () => {
  it("uses the built-in password when no setting exists", () => {
    expect(resolvePasswordHash(undefined)).toBe(BUILT_IN_HASH);
  });

  it("uses the built-in password when the setting arrives empty", () => {
    // A GitHub Actions variable that was never created reaches the build as
    // an empty string, not as "missing". Passing that through would make the
    // expected hash "", which no password can ever match: everyone locked out.
    expect(resolvePasswordHash("")).toBe(BUILT_IN_HASH);
    expect(resolvePasswordHash("   ")).toBe(BUILT_IN_HASH);
  });

  it("uses the configured hash when one is set", () => {
    expect(resolvePasswordHash(CORRECT_HORSE_HASH)).toBe(CORRECT_HORSE_HASH);
  });

  it("ignores capital letters and stray spaces around a configured hash", () => {
    // Pasting a hash by hand often brings a trailing newline with it, and
    // some tools print hashes in capitals. Neither changes which password it is.
    expect(resolvePasswordHash(`  ${CORRECT_HORSE_HASH.toUpperCase()}\n`)).toBe(CORRECT_HORSE_HASH);
  });

  it("stops the build when the setting is not a hash, instead of quietly keeping the old password", () => {
    // The likely slips: saving the password itself, or pasting shasum's whole
    // output line, which ends in "  -".
    expect(() => resolvePasswordHash("correct horse")).toThrow(/NEXT_PUBLIC_ADMIN_PASSWORD_HASH/);
    expect(() => resolvePasswordHash(`${CORRECT_HORSE_HASH}  -`)).toThrow(/NEXT_PUBLIC_ADMIN_PASSWORD_HASH/);
  });
});

describe("passwordMatches", () => {
  it("accepts the password whose hash is stored", async () => {
    expect(await passwordMatches("correct horse", CORRECT_HORSE_HASH)).toBe(true);
  });

  it("rejects a different password", async () => {
    expect(await passwordMatches("wrong horse", CORRECT_HORSE_HASH)).toBe(false);
  });

  it("rejects an empty entry", async () => {
    expect(await passwordMatches("", CORRECT_HORSE_HASH)).toBe(false);
  });

  it("does not accept the hash itself as the password", async () => {
    // The hash is public: it ships in the page. Typing it in must not work.
    expect(await passwordMatches(CORRECT_HORSE_HASH, CORRECT_HORSE_HASH)).toBe(false);
  });
});
