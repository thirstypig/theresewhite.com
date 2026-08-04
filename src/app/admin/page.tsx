import type { Metadata } from "next";
import Link from "next/link";
import { AdminGate } from "@/components/admin-gate";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const REPO = "https://github.com/thirstypig/theresewhite.com";

const links = [
  {
    group: "Traffic",
    items: [
      {
        name: "Google Analytics 4",
        note: "Measurement ID G-4QVRMZJVWS. Realtime is under Reports → Realtime.",
        href: "https://analytics.google.com/",
      },
      {
        name: "Microsoft Clarity",
        note: "Project xxajqpw2g7. Session recordings and heatmaps.",
        href: "https://clarity.microsoft.com/",
      },
      {
        name: "Google Search Console",
        note: "Not connected yet — do this at cutover, not before. Staging is noindex.",
        href: "https://search.google.com/search-console",
      },
    ],
  },
  {
    group: "Site",
    items: [
      { name: "Live staging site", note: "theresewhite.bahtzang.com", href: "https://theresewhite.bahtzang.com" },
      { name: "Repository", note: "Public. Source, docs and deploy config.", href: REPO },
      { name: "Deploy runs", note: "Every push to main builds and publishes.", href: `${REPO}/actions` },
      { name: "Pages settings", note: "Source must stay on GitHub Actions.", href: `${REPO}/settings/pages` },
      { name: "Repo variables", note: "Where the Web3Forms key and analytics IDs live.", href: `${REPO}/settings/variables/actions` },
    ],
  },
  {
    group: "Forms",
    items: [
      {
        name: "Web3Forms",
        note: "Delivers the contact form and the calculator email gate. Free tier is 250 submissions/month.",
        href: "https://web3forms.com/",
      },
    ],
  },
];

const palette = [
  { name: "deep / brand", light: "#22495A", dark: "#D8C7BD (as button)" },
  { name: "slate", light: "#486573", dark: "#9DB0B6" },
  { name: "sand", light: "#D8C7BD", dark: "#D8C7BD (unchanged)" },
  { name: "cream / alt surface", light: "#F4EFEB", dark: "#1C313A" },
  { name: "paper / page ground", light: "#FFFFFF", dark: "#15252C" },
  { name: "band / hero + footer", light: "#22495A", dark: "#24404C" },
  { name: "charcoal / body text", light: "#414141", dark: "#CCD6D8" },
];

const pages = [
  { path: "/", note: "Hero, video, credentials, process, CTA" },
  { path: "/about", note: "DRAFT COPY — needs rewriting in Therese's voice" },
  { path: "/services", note: "Five services, assembled from her own words" },
  { path: "/process", note: "The four stages" },
  { path: "/endorsements", note: "Four endorsements, verbatim" },
  { path: "/faq", note: "12 questions, verbatim, with FAQ schema" },
  { path: "/contact", note: "Web3Forms; falls back to phone/email without a key" },
  { path: "/conflict-calculator", note: "Ad landing page. Unlinked and noindex until the campaign runs." },
  { path: "/privacy", note: "Generic template — not lawyer-reviewed" },
  { path: "/terms", note: "Generic template — not lawyer-reviewed" },
];

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-6">
      <h2 className="display text-xl text-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  return (
    <AdminGate>
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <p className="label text-muted">Internal</p>
          <h1 className="display mt-3 text-4xl text-heading">Admin</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
            Reference for running the site. This page is password-gated and
            noindexed, but it is a static page on a public repo — treat
            everything here as public. No client details, no credentials.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-4xl space-y-12 px-6 py-16">
          {links.map((group) => (
            <Card key={group.group} title={group.group}>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-b border-rule pb-3"
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
                    >
                      {item.name}
                    </a>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          <Card title="Pages">
            <ul className="space-y-2.5">
              {pages.map((p) => (
                <li
                  key={p.path}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule pb-2.5"
                >
                  <Link
                    href={p.path}
                    className="font-mono text-sm text-heading underline decoration-accent-line underline-offset-4"
                  >
                    {p.path}
                  </Link>
                  <span className="text-sm text-muted">{p.note}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Palette">
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Carried over from the live Wix theme. Tokens are named for their
              role, not their colour, because the colour changes between themes
              and the role doesn&rsquo;t.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="label py-2 text-left text-muted">Token</th>
                    <th className="label py-2 text-left text-muted">Light</th>
                    <th className="label py-2 text-left text-muted">Dark</th>
                  </tr>
                </thead>
                <tbody>
                  {palette.map((c) => (
                    <tr key={c.name} className="border-b border-rule">
                      <td className="py-2.5 text-charcoal">{c.name}</td>
                      <td className="py-2.5">
                        <span className="flex items-center gap-2 font-mono text-charcoal">
                          <span
                            aria-hidden
                            className="inline-block h-4 w-4 rounded-xs border border-rule"
                            style={{ background: c.light }}
                          />
                          {c.light}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-charcoal">{c.dark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Type">
            <dl className="space-y-4">
              <div className="border-b border-rule pb-3">
                <dt className="label text-muted">Display — Fraunces</dt>
                <dd className="display mt-1 text-2xl text-heading">
                  Headings and figures
                </dd>
              </div>
              <div className="border-b border-rule pb-3">
                <dt className="label text-muted">Body — Instrument Sans</dt>
                <dd className="mt-1 text-base text-charcoal">
                  Running text, set near 65 characters per line.
                </dd>
              </div>
              <div className="border-b border-rule pb-3">
                <dt className="label text-muted">Utility — Martian Mono</dt>
                <dd className="label mt-1 text-charcoal">
                  Eyebrows, labels, step numbers
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Changing the admin password">
            <p className="text-sm leading-relaxed text-charcoal">
              Generate a hash, then set it as the repo variable{" "}
              <code className="font-mono text-heading">
                NEXT_PUBLIC_ADMIN_PASSWORD_HASH
              </code>{" "}
              and re-run the deploy.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-sm border border-rule bg-cream p-4 font-mono text-xs text-charcoal">
              printf %s &apos;your-new-password&apos; | shasum -a 256
            </pre>
          </Card>

          <Card title="Still outstanding">
            <ul className="space-y-2.5 text-sm text-charcoal">
              <li className="border-b border-rule pb-2.5">
                About page copy — currently drafted, needs Therese&rsquo;s voice
              </li>
              <li className="border-b border-rule pb-2.5">
                Privacy and terms — generic templates, want a lawyer&rsquo;s eye
              </li>
              <li className="border-b border-rule pb-2.5">
                Confirm the EEOC and Kenneth Cloke credential entries — both
                read off cropped logos
              </li>
              <li className="border-b border-rule pb-2.5">
                Wix cutover: restore the 15 redirects, flip{" "}
                <code className="font-mono">NEXT_PUBLIC_SITE_URL</code> to the
                production domain, submit to Search Console
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </AdminGate>
  );
}
