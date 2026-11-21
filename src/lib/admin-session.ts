/**
 * Remembers, for one browser tab, that the admin password has been entered.
 *
 * /admin and every page under /stylebible share this, so entering the
 * password once opens all of them until the tab is closed. The comparison
 * page depends on that: it shows two of the sample pages inside itself, and
 * each of those is a locked page in its own right.
 *
 * It is built in the shape React's useSyncExternalStore expects (subscribe,
 * getSnapshot, getServerSnapshot), which is what lets the lock read the
 * browser's storage without the page's first draw disagreeing with the HTML
 * the build produced.
 */

/** The part of the browser's per-tab storage this needs. */
type TabStorage = Pick<Storage, "getItem" | "setItem">;

export type LockState = "checking" | "locked" | "unlocked";

const KEY = "tw-admin-unlocked";

/**
 * `getStorage` is a function, called fresh each time, because merely reaching
 * for the storage can fail: a private window or a strict privacy setting can
 * make the browser refuse.
 */
export function createAdminSession(getStorage: () => TabStorage) {
  // Covers a browser that will not store anything: the page still opens, and
  // simply asks again on the next page.
  let unlockedOnThisPage = false;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot(): LockState {
      if (unlockedOnThisPage) return "unlocked";
      try {
        return getStorage().getItem(KEY) === "1" ? "unlocked" : "locked";
      } catch {
        return "locked";
      }
    },

    /**
     * What the build, and the page's very first draw in the browser, use. The
     * build cannot know who will open the page, so it commits to neither the
     * password form nor the content.
     */
    getServerSnapshot(): LockState {
      return "checking";
    },

    unlock(): void {
      unlockedOnThisPage = true;
      try {
        getStorage().setItem(KEY, "1");
      } catch {
        // Nothing to do: unlockedOnThisPage keeps this page open.
      }
      for (const listener of listeners) listener();
    },
  };
}

/** The one session for the page that is open. Only touched in the browser. */
export const adminSession = createAdminSession(() => window.sessionStorage);
