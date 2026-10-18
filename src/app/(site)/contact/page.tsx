import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/page-metadata";
import { calendlyUrl } from "@/content/wix/chrome";
import { wixContact as c } from "@/content/wix/contact";

/**
 * The Wix Contact page.
 *
 * Decided 2026-10-17: Contact leads with Calendly, as on Wix, and the emailed
 * contact form comes off this page. The form itself
 * (src/components/contact-form.tsx) and its thank-you page stay in the
 * project, unused here, in case Therese wants a second way in.
 *
 * Measured on the live page at 1,440 wide on 2026-10-18:
 * - An off-white band (#FAFAFA) holding a 968px column, then 48px of white
 *   before the footer. No closing band.
 * - "Contact" in Arial 60px, then the subtitle in black Arial 36px and the
 *   two reassurance lines in charcoal Arial 30px, all centered.
 * - The five questions (Arial 26px lead-in, 22px bullets) on the left, the
 *   chalkboard picture on the right in a 4px electric-blue (#1D2CF3) frame
 *   with a drop shadow, 347 × 253.
 * - "Schedule Your Assessment" is an underlined electric-blue text link, Arial
 *   30px, that opens Calendly in a new tab. It is not a pill button on Wix.
 * - The urgent note is bold alert red (#ED4545), 20px. On Wix only the email
 *   address in it is a link; here the phone number is a link too, so a phone
 *   can call it with one tap. It keeps the red and has no underline, so the
 *   line looks the same as on Wix.
 *
 * The search and link-preview description used to offer "send a note"
 * through the form. With the form gone, it now points to booking a call.
 */
export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Schedule your confidential conflict assessment: 30 to 45 minutes, real work, no sales pitch or pressure, no charge. Urgent? Call (323) 291-4813.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="bg-white pb-8 md:pb-[48px]">
      <div className="bg-[#fafafa]">
        <div className="mx-auto max-w-[968px] px-5 pt-4 pb-10 md:px-6 md:pt-[15px] md:pb-[28px] xl:px-0">
          <header className="text-center">
            <h1 className="text-[40px] leading-[1.4] text-[#414141] md:text-[60px]">{c.title}</h1>
            <p className="mt-1 text-[26px] leading-[1.15] text-black md:mt-[10px] md:text-[36px] md:leading-[36px]">
              {c.subtitle}
            </p>
            <p className="mt-6 text-[22px] leading-[1.25] text-[#414141] md:mt-[36px] md:text-[30px] md:leading-[36px]">
              {c.reassurance[0]}
              <br />
              {c.reassurance[1]}
            </p>
          </header>

          <div className="mt-8 flex flex-col gap-8 md:mt-[41px] md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="md:pt-[3px]">
              <p className="text-[20px] leading-[1.4] text-[#414141] md:text-[26px]">{c.questionsIntro}</p>
              <ul className="list-disc pl-[34px] text-[18px] leading-[1.4] text-[#414141] md:pl-[40px] md:text-[22px]">
                {c.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="mx-auto w-full max-w-[355px] shrink-0 overflow-hidden rounded-[3px] border-4 border-[#1d2cf3] shadow-[0_0_3px_rgba(0,0,0,0.5),0_10px_12px_-6px_rgba(0,0,0,0.55)] md:mx-0 md:-mt-[24px] md:mr-[24px] md:w-[355px]">
              <Image
                src={c.image.src}
                width={c.image.width}
                height={c.image.height}
                alt={c.image.alt}
                sizes="(min-width: 768px) 347px, 90vw"
                className="block h-auto w-full"
                priority
              />
            </div>
          </div>

          <div className="mt-8 space-y-6 text-[18px] leading-[1.4] md:mt-[53px] md:space-y-[31px] md:text-[22px]">
            <p className="text-black">{c.closing[0]}</p>
            <p className="text-[#414141]">{c.closing[1]}</p>
          </div>

          <p className="mt-10 text-center text-[24px] leading-[1.4] md:mt-[55px] md:text-[30px]">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener"
              className="text-[#1d2cf3] underline underline-offset-[3px] hover:text-[#0d63d1]"
            >
              {c.scheduleLink}
            </a>
          </p>

          <div className="mt-6 text-center text-[16px] leading-[1.3] md:mt-[25px] md:text-[20px] md:leading-[25.2px]">
            <p className="font-bold text-[#ed4545]">
              {c.urgent.before}
              <a href={c.urgent.phoneHref} className="hover:underline">
                {c.urgent.phone}
              </a>
              {c.urgent.middle}
              <a href={c.urgent.emailHref} className="underline">
                {c.urgent.email}
              </a>
              {c.urgent.after}
            </p>
            <p className="text-black">{c.urgentFollowUp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
