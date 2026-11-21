/**
 * The password for /admin and the style bible pages.
 *
 * Only a scrambled copy of the password (a SHA-256 hash) is ever stored, so
 * the password itself is not sitting in the site's code. The deploy reads the
 * hash from the NEXT_PUBLIC_ADMIN_PASSWORD_HASH repository variable, which
 * James sets by running `scripts/set-admin-password.sh` in his own terminal.
 *
 * This is the same weak lock described in src/components/admin-gate.tsx: it
 * keeps visitors and search engines out, and nothing more. The hash ships in
 * the page, and a short or common password can be worked out from its hash.
 */

/**
 * The hash of the password the site started with. That password is written
 * in this project's public history, so it protects nothing; it is here so a
 * build with no setting (a laptop, a fresh copy of the project) still opens.
 */
const BUILT_IN_HASH = "eeb9a5fd80b393f2135c167f2a299db494a8b10deb06dd3ee618c38e37ce311f";

const SHA_256_HEX = /^[0-9a-f]{64}$/;

/**
 * Decides which hash the lock compares against.
 *
 * - No setting, or an empty one: the built-in password. A GitHub Actions
 *   variable that was never created reaches the build as an empty string, so
 *   empty has to count as "not set". Otherwise the expected hash would be ""
 *   and nobody, James included, could get in.
 * - A hash: that hash, tidied (spaces at the ends and capitals don't matter).
 * - Anything else: an error, which stops the build. The alternative is to
 *   fall back to the built-in password without saying so, leaving James
 *   believing he changed a password that never changed.
 */
export function resolvePasswordHash(configured: string | undefined): string {
  const value = (configured ?? "").trim().toLowerCase();
  if (value === "") return BUILT_IN_HASH;
  if (!SHA_256_HEX.test(value)) {
    throw new Error(
      "NEXT_PUBLIC_ADMIN_PASSWORD_HASH is set, but it is not a SHA-256 hash " +
        "(64 characters, using only 0-9 and a-f). Set it again with " +
        "scripts/set-admin-password.sh, or delete the variable to go back to the built-in password.",
    );
  }
  return value;
}

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Whether what someone typed is the password. Compared exactly: capitals and
 * spaces count, the same as scripts/set-admin-password.sh stores them.
 */
export async function passwordMatches(entered: string, expectedHash: string): Promise<boolean> {
  return (await sha256Hex(entered)) === expectedHash;
}
