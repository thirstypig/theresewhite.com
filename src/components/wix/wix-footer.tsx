import Link from "next/link";
import { wixFooter } from "@/content/wix/chrome";

/**
 * The Wix footer, identical on every page: warm gray, Arial 15px charcoal,
 * contact details on the left and the legal links on the right. On phones
 * the two columns stack.
 *
 * One addition James asked for that Wix does not have: a link to the
 * referral partner page, under the legal links.
 */
export function WixFooter() {
  const f = wixFooter;
  const link = "underline underline-offset-2 hover:text-black";
  return (
    <footer className="bg-[#e8e6e6] text-[15px] leading-[1.2] text-[#414141]">
      <div className="mx-auto flex max-w-[980px] flex-col gap-8 px-4 py-8 sm:flex-row sm:justify-between">
        <div>
          {f.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            <a href={f.emailHref} className={link}>
              {f.email}
            </a>
          </p>
          <p>
            <a href={f.phoneHref} className="hover:text-black">
              {f.phone}
            </a>
          </p>
          <p className="mt-5">{f.copyright}</p>
        </div>
        <div className="sm:text-right">
          <p>{f.legalTitle}</p>
          <ul>
            {f.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href={f.partners.href} className={link}>
              {f.partners.label}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
