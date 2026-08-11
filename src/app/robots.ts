import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/site-config";

// Required by `output: export` — this is generated once at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Staging is a full copy of the live site's copy. Blanket-disallow it so it
  // can't be crawled, indexed, or ranked against theresewhite.com.
  if (!IS_PRODUCTION_SITE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact/thank-you", "/collaborate/thank-you"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
