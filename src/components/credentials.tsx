import Image from "next/image";
import { credentials } from "@/content/site";

type Item = { readonly name: string; readonly logo: string };

/**
 * Every logo ships as an identical 440x220 white tile with its mark trimmed
 * and scaled into a shared content box, so a row of them reads as one system
 * even though the marks themselves range from a circular federal seal to a
 * wide wordmark.
 *
 * The tiles stay light in dark mode on purpose: these are dark-ink logos, and
 * on a dark ground they would simply disappear.
 */
function LogoRow({ items }: { items: readonly Item[] }) {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.name}>
          <div className="flex items-center justify-center rounded-sm border border-rule bg-white p-3">
            <Image
              src={item.logo}
              alt={item.name}
              width={440}
              height={220}
              className="h-auto w-full"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Credentials() {
  return (
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="label text-muted">{credentials.title}</p>

        <div className="mt-8 space-y-12">
          <div>
            <h2 className="display text-xl text-heading">Mediation panels</h2>
            <LogoRow items={credentials.panels} />
          </div>

          <div>
            <h2 className="display text-xl text-heading">
              Teaching &amp; affiliations
            </h2>
            <LogoRow items={credentials.affiliations} />
          </div>
        </div>
      </div>
    </section>
  );
}
