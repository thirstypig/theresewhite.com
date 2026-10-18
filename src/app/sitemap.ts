import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";

// Required by `output: export` — this is generated once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // No sitemap for staging — nothing there should be discoverable.
  if (!IS_PRODUCTION_SITE) return [];

  // The Wix addresses, which the site switched to on 2026-10-18 so that
  // links Wix has collected keep working after the move.
  const routes = [
    { path: "/", priority: 1 },
    { path: "/about-therese", priority: 0.8 },
    { path: "/team-1-1", priority: 0.7 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/case-study-extension", priority: 0.5 },
    { path: "/finding-came-back", priority: 0.5 },
    { path: "/the-medical-leave", priority: 0.5 },
    { path: "/services-3", priority: 0.7 },
    { path: "/blog", priority: 0.6 },
    ...getAllPosts().map((post) => ({ path: `/post/${post.slug}`, priority: 0.5 })),
    { path: "/contact", priority: 0.9 },
    { path: "/collaborate", priority: 0.5 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms-of-use", priority: 0.2 },
    { path: "/cookie-preferences", priority: 0.1 },
    { path: "/accessibility", priority: 0.1 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
