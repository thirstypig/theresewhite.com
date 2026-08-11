import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { AssessmentCta } from "@/components/assessment-cta";
import { Credentials } from "@/components/credentials";
import { about, contact, portrait } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "L. Therese White has spent 30+ years and 1,100+ mediations working in employment disputes where the stated problem isn't the real one.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={contact.name}
        intro={about.lede}
      />

      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            {/* Narrow measure for reading, aligned to the page's left edge so
                it lines up with the heading above it. */}
            <div className="max-w-3xl space-y-12">
              {about.sections.map((section) => (
                <article key={section.heading}>
                  <h2 className="display text-2xl text-heading">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-charcoal">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            {/* The portrait is a transparent cutout, so it sits on the cream
                panel with no white box around it. Sticky on wide screens so
                she stays present while the text scrolls. */}
            <aside className="order-first lg:order-last">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-sm bg-cream px-6 pt-6">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    priority
                    sizes="(max-width: 1024px) 60vw, 320px"
                    className="mx-auto h-auto w-full max-w-xs lg:max-w-none"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Credentials />

      <AssessmentCta />
    </>
  );
}
