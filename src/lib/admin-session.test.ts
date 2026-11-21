import { describe, it, expect } from "vitest";
import { createAdminSession } from "./admin-session";

/**
 * Remembers, for one browser tab, that the password has been entered, so
 * /admin and the style bible pages do not ask again on every page.
 *
 * The tests stand in for the browser's per-tab storage with a plain object,
 * because that storage does not exist where the tests run.
 */
function tabStorage() {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

describe("createAdminSession", () => {
  it("is locked for someone who has not entered the password", () => {
    const session = createAdminSession(() => tabStorage());
    expect(session.getSnapshot()).toBe("locked");
  });

  it("opens as soon as the password is accepted, and tells the page so", () => {
    // Without the notification the page would sit on the password form until
    // someone reloaded it.
    const session = createAdminSession(() => tabStorage());
    let notified = 0;
    session.subscribe(() => notified++);

    session.unlock();

    expect(session.getSnapshot()).toBe("unlocked");
    expect(notified).toBe(1);
  });

  it("stays open on the next page in the same tab", () => {
    // Every page load starts a fresh session object; what carries over is the
    // tab's storage. This is also what lets the comparison page's two embedded
    // sample pages open without each asking for the password again.
    const storage = tabStorage();
    createAdminSession(() => storage).unlock();

    const nextPage = createAdminSession(() => storage);
    expect(nextPage.getSnapshot()).toBe("unlocked");
  });

  it("stops notifying a page that is no longer listening", () => {
    const session = createAdminSession(() => tabStorage());
    let notified = 0;
    const stop = session.subscribe(() => notified++);

    stop();
    session.unlock();

    expect(notified).toBe(0);
  });

  const brokenStorage = {
    "refuses every read and write": () => ({
      getItem: () => {
        throw new Error("storage is blocked");
      },
      setItem: () => {
        throw new Error("storage is blocked");
      },
    }),
    "cannot be reached at all": () => {
      throw new Error("storage is blocked");
    },
  };

  for (const [what, getStorage] of Object.entries(brokenStorage)) {
    it(`still locks and unlocks when the browser's storage ${what}`, () => {
      // Private windows and strict privacy settings can block storage. The
      // page must neither crash nor become impossible to open; it just asks
      // again on the next page.
      const session = createAdminSession(getStorage);
      expect(session.getSnapshot()).toBe("locked");

      session.unlock();

      expect(session.getSnapshot()).toBe("unlocked");
    });
  }

  it("reports that it has not checked yet while the page is being built", () => {
    // The built page cannot know whether a visitor has unlocked it, so it
    // must ship neither the password form nor the page's content as settled.
    expect(createAdminSession(() => tabStorage()).getServerSnapshot()).toBe("checking");
  });
});
