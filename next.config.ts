import type { NextConfig } from "next";

/**
 * Static export, for GitHub Pages.
 *
 * There is no Node server at runtime, which rules out three things:
 *
 *  - Server Actions. The contact form posts to a plain form endpoint instead
 *    (see src/components/contact-form.tsx).
 *  - next/image optimization. Hence `unoptimized`.
 *  - redirects(). GitHub Pages can't issue a 301. The Wix redirect map lives
 *    in DEPLOY.md and comes back at cutover, when the site moves to a host
 *    that can serve them — those URLs only exist on theresewhite.com anyway,
 *    so nothing is lost while we're on a staging subdomain.
 */
const nextConfig: NextConfig = {
  output: "export",

  // Emits /about/index.html so GitHub Pages serves /about/ without a rewrite.
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
