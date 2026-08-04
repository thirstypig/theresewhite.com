import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { assessment, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a confidential conflict assessment. 30 to 45 minutes, real work, no sales pitch. Call (323) 291-4813 or send a note.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={assessment.title}
        intro={assessment.intro}
      />

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ContactForm />
          </div>

          <aside className="lg:border-l lg:border-rule lg:pl-14">
            <h2 className="label text-muted">What we&rsquo;ll cover</h2>
            <ul className="mt-5 space-y-3">
              {assessment.questions.map((question) => (
                <li
                  key={question}
                  className="border-b border-rule pb-3 text-base text-charcoal"
                >
                  {question}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              {assessment.outro}
            </p>

            <div className="mt-10 border-t border-rule pt-6">
              <h2 className="label text-muted">Or reach me directly</h2>
              <ul className="mt-4 space-y-2 text-base">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
                  >
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.emailHref}
                    className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
                  >
                    {contact.email}
                  </a>
                </li>
              </ul>
              <address className="mt-5 text-sm not-italic leading-relaxed text-muted">
                {contact.street}
                <br />
                {contact.city}, {contact.region} {contact.postalCode}
              </address>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
