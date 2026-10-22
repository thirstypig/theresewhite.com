import { describe, expect, it } from "vitest";
import { readSource } from "./book-signup-form";

/**
 * Where a signup came from is the point of book.theresewhite.com, and it is
 * stored on the Kit subscriber from these four values. Each test is a way the
 * record could end up wrong or empty.
 */

const HOST = "book.theresewhite.com";

describe("readSource", () => {
  it("takes all four tags from a tagged LinkedIn link", () => {
    expect(
      readSource(
        "?utm_source=linkedin&utm_medium=social&utm_campaign=meltdown-launch&utm_content=post-1",
        "https://www.linkedin.com/",
        HOST,
      ),
    ).toEqual({
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "meltdown-launch",
      utm_content: "post-1",
    });
  });

  it("falls back to the referring site when the link has no tags", () => {
    // An untagged share still says LinkedIn, with no medium, so it can be
    // told apart from a tagged one.
    expect(readSource("", "https://www.linkedin.com/feed/", HOST)).toEqual({
      utm_source: "linkedin.com",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
    });
  });

  it("records 'direct' when there is no referring site, or it is this page", () => {
    expect(readSource("", "", HOST).utm_source).toBe("direct");
    expect(readSource("", `https://${HOST}/`, HOST).utm_source).toBe("direct");
    expect(readSource("", "not a url", HOST).utm_source).toBe("direct");
  });

  it("prefers the tag over the referrer", () => {
    expect(
      readSource("?utm_source=newsletter", "https://www.linkedin.com/", HOST).utm_source,
    ).toBe("newsletter");
  });

  it("caps each value at 100 characters", () => {
    expect(readSource(`?utm_source=${"x".repeat(300)}`, "", HOST).utm_source).toHaveLength(100);
  });
});
