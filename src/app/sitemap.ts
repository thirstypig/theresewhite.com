import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/site-config";

// Required by `output: export` — this is generated once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // No sitemap for staging — nothing there should be discoverable.
  if (!IS_PRODUCTION_SITE) return [];

  const routes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/services", priority: 0.9 },
    { path: "/process", priority: 0.8 },
    { path: "/endorsements", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/collaborate", priority: 0.5 },
    { path: "/contact", priority: 0.9 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
