import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/page-metadata";
import { calendlyUrl } from "@/content/wix/chrome";
import { wixContact as c } from "@/content/wix/contact";
import { ContactForm } from "@/components/contact-form";

/**
 * DRAFT of the redesigned Contact page, for review on staging only
 * (todo `contact-page-redesign`, asked for by James on 2026-10-29).
 *
 * Top to bottom: a short note inviting people to write, the email form, the
 * "Schedule Your Assessment" button to Therese's Calendly page, the urgent
 * note, then the assessment section from the current /contact, which ends
 * with the same button again. This reverses the 2026-10-17 decision that
 * Contact leads with Calendly and has no form.
 *
 * The form is the existing src/components/contact-form.tsx, unchanged. Its
 * labels and button words were drafted for an earlier design, not written by
 * Therese, and its thank-you page (/contact/thank-you/) promises a reply
 * within one business day.
 *
 * Unlinked and noindex, so only people given the address find it. When the
 * design is approved, move this layout into src/app/(site)/contact/page.tsx
 * and delete this folder.
 */
export const metadata: Metadata = pageMetadata({
  title: "Contact (draft)",
  description: "Draft of the redesigned Contact page, for review.",
  path: "/contact-draft",
  noindex: true,
});

/**
 * DRAFT COPY, written 2026-10-29 in Therese's first-person voice for the
 * review. Not hers yet: she approves or rewrites it before this goes live.
 * The rest of the page's words are the Wix copy from src/content/wix/contact.ts.
 */
const draft = {
  formHeading: "Send me a note",
  formIntro:
    "Prefer to write first? Tell me a little about what’s happening, and I’ll get back to you myself. Everything you send stays between us.",
  orCall: "Or, if you’d rather talk it through:",
};

function ScheduleButton() {
  return (
    <a
      href={calendlyUrl}
      target="_blank"
      rel="noopener"
      className="inline-block rounded-full bg-[#1d2cf3] px-10 py-4 text-[20px] leading-none text-white transition-colors hover:bg-[#0d63d1] md:text-[24px]"
    >
      {c.scheduleLink}
    </a>
  );
}

export default function ContactDraftPage() {
  return (
    <div className="bg-white pb-8 md:pb-[48px]">
      <div className="bg-[#fafafa]">
        <div className="mx-auto max-w-[968px] px-5 pt-4 pb-10 md:px-6 md:pt-[15px] md:pb-[28px] xl:px-0">
          <h1 className="text-center text-[40px] leading-[1.4] text-[#414141] md:text-[60px]">{c.title}</h1>

          {/* 1. A short invitation, then the email form. */}
          <div className="mx-auto mt-6 max-w-[720px] text-center md:mt-[24px]">
            <h2 className="text-[26px] leading-[1.15] text-black md:text-[36px] md:leading-[36px]">
              {draft.formHeading}
            </h2>
            <p className="mt-4 text-[18px] leading-[1.4] text-[#414141] md:text-[22px]">{draft.formIntro}</p>
          </div>

          {/* lp-wix sets the form in Arial, makes its button a pill and its
              fields lightly rounded, as on the calculator. The inline colors
              then turn the button electric blue to match the Calendly button;
              they win over lp-wix's lighter blue because they sit on the
              element itself. Scoped to this box: /collaborate's form shares
              these parts and is unchanged. */}
          <div
            className="lp-wix mx-auto mt-8 max-w-[720px] rounded-[3px] border border-[#e0e0e0] bg-white p-6 md:mt-[32px] md:p-10"
            style={
              {
                "--btn": "#1d2cf3",
                "--btn-hover": "#0d63d1",
                "--btn-fg": "#ffffff",
              } as React.CSSProperties
            }
          >
            <ContactForm />
          </div>

          {/* 2. Directly below: the Calendly button. */}
          <div className="mt-10 text-center md:mt-[48px]">
            <p className="text-[18px] leading-[1.4] text-[#414141] md:text-[22px]">{draft.orCall}</p>
            <p className="mt-4">
              <ScheduleButton />
            </p>
          </div>

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

          {/* 3. The assessment section from the current page, ending with the
              same button, so someone who reads to the bottom can book there. */}
          <h2 className="mt-14 text-center text-[26px] leading-[1.15] text-black md:mt-[72px] md:text-[36px] md:leading-[36px]">
            {c.subtitle}
          </h2>
          <p className="mt-6 text-center text-[22px] leading-[1.25] text-[#414141] md:mt-[36px] md:text-[30px] md:leading-[36px]">
            {c.reassurance[0]}
            <br />
            {c.reassurance[1]}
          </p>

          <div className="mt-8 flex flex-col gap-8 md:mt-[41px] md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="md:pt-[3px]">
              <p className="text-[20px] leading-[1.4] text-[#414141] md:text-[26px]">{c.questionsIntro}</p>
              <ul className="list-disc pl-[34px] text-[18px] leading-[1.4] text-[#414141] md:pl-[40px] md:text-[22px]">
                {c.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="mx-auto w-full max-w-[355px] shrink-0 overflow-hidden rounded-[3px] border-4 border-[#1d2cf3] shadow-[0_0_3px_rgba(0,0,0,0.5),0_10px_12px_-6px_rgba(0,0,0,0.55)] md:mx-0 md:mr-[24px] md:w-[355px]">
              <Image
                src={c.image.src}
                width={c.image.width}
                height={c.image.height}
                alt={c.image.alt}
                sizes="(min-width: 768px) 347px, 90vw"
                className="block h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-8 space-y-6 text-[18px] leading-[1.4] md:mt-[53px] md:space-y-[31px] md:text-[22px]">
            <p className="text-black">{c.closing[0]}</p>
            <p className="text-[#414141]">{c.closing[1]}</p>
          </div>

          <p className="mt-10 text-center md:mt-[48px]">
            <ScheduleButton />
          </p>
        </div>
      </div>
    </div>
  );
}
