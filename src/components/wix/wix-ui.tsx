import Link from "next/link";
import { wixAssessmentCta } from "@/content/wix/chrome";

/**
 * The Wix site's one button: a bright blue pill with wide white capitals.
 * It turns red when pointed at, over 0.4 seconds, as on Wix (ruling 5,
 * 2026-10-17). Measured on the live site: #2E92E5, hover #ED4545, 51px tall,
 * 14px Lulo Clean, which Syncopate replaces here.
 *
 * Internal addresses use Next's Link so moving between pages does not reload
 * the whole site. Outside addresses (the calculator, Calendly) open in a new
 * tab, as they do on Wix.
 */
export function WixButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const style =
    "inline-flex min-h-[51px] w-full max-w-[341px] items-center justify-center rounded-full bg-[#2e92e5] px-6 text-center font-[family-name:var(--wix-lulo)] text-[13px] leading-snug font-bold tracking-[0.04em] text-white uppercase transition-colors duration-[400ms] hover:bg-[#ed4545] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0d63d1] " +
    className;
  if (href.startsWith("http")) {
    return (
      <a href={href} className={style} target="_blank" rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={style}>
      {children}
    </Link>
  );
}

/**
 * The closing band on most pages: "Schedule Your / Confidential Conflict
 * Assessment" over a Click Here button. Its background changes by page on
 * Wix: cream (#F4EFEB) on Home, warm gray (#E8E6E6) on About, Case Studies
 * and Endorsements, white on FAQ. Contact, Blog, posts and the legal pages
 * have no band.
 */
export function AssessmentBand({ background }: { background: string }) {
  return (
    <section style={{ background }} className="px-4 pt-10 pb-8">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <p className="text-[20px] leading-tight font-bold text-[#414141] md:text-[22px]">
          {wixAssessmentCta.lines[0]}
          <br />
          {wixAssessmentCta.lines[1]}
        </p>
        <WixButton href={wixAssessmentCta.href}>{wixAssessmentCta.button}</WixButton>
      </div>
    </section>
  );
}
