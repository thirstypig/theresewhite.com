"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logo } from "@/content/site";
import { wixNav } from "@/content/wix/chrome";

/**
 * The Wix header, measured on www.theresewhite.com on 2026-10-16.
 *
 * Desktop: an 85px warm gray bar (#E8E6E6) with a 1px sand line under it,
 * pinned to the top while scrolling. The logo sits in a 3px electric-blue
 * frame with a drop shadow and is taller than the bar, so it hangs below it.
 * That overhang is the site's signature. The menu is six square tabs, nav
 * blue (#0D63D1) with a white Forum label; the current page and the one
 * under the pointer reverse to white with blue text. There is no Home tab;
 * the logo goes home.
 *
 * Phone: logo on the left, a three-line menu icon on the right. The icon
 * opens a full-screen cream menu with an extra Home item, in the old teal
 * theme color rather than the blues, as on Wix.
 *
 * A client component only because it needs the current page (to reverse
 * that tab) and the open/closed state of the phone menu.
 */
export function WixHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isCurrent = (href: string) => pathname === href || pathname === `${href}/` || pathname.startsWith(`${href}/`);

  // Escape closes the phone menu; choosing a page closes it via onClick.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8c7bd] bg-[#e8e6e6]">
      <div className="mx-auto flex h-[96px] max-w-[1280px] items-center justify-between gap-4 px-4 md:h-[85px] md:justify-start md:gap-6 lg:px-[40px]">
        <Link
          href="/"
          aria-label="L. Therese White, home"
          className="relative z-10 block shrink-0 self-start rounded-[6px] border-[3px] border-[#1d2cf3] bg-white shadow-[0_0_3px_rgba(0,0,0,0.5),0_10px_12px_-6px_rgba(0,0,0,0.55)] mt-3 md:mt-[11px]"
        >
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logo.alt}
            priority
            className="h-auto w-[173px] md:w-[150px] lg:w-[200px] xl:w-[242px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-[6px] lg:gap-[8px] font-[family-name:var(--wix-forum)]">
            {wixNav.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex h-[43px] items-center border px-[9px] text-[14px] tracking-[0.05em] whitespace-nowrap transition-colors duration-[80ms] lg:px-[14px] lg:text-[17px] xl:px-[24px] xl:text-[19px] ${
                      current
                        ? "border-[#0d63d1] bg-white text-[#0d63d1]"
                        : "border-white bg-[#0d63d1] text-white hover:border-[#0d63d1] hover:bg-white hover:text-[#0d63d1]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="flex h-[56px] w-[56px] flex-col items-center justify-center gap-[6px] md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="wix-phone-menu"
          onClick={() => setOpen(true)}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-[2px] w-[26px] bg-[#414141]" />
          ))}
        </button>
      </div>

      {open && (
        <div
          id="wix-phone-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#f4efeb] md:hidden"
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center text-[#22495a]"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M2 2l18 18M20 2L2 20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <ul className="flex min-h-full flex-col justify-center py-20 text-center font-[Arial,Helvetica,sans-serif] text-[21px]">
            {[{ label: "Home", href: "/" }, ...wixNav].map((item) => {
              const current = item.href === "/" ? pathname === "/" : isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex h-[65px] items-center justify-center ${current ? "bg-white/50 text-[#d8c7bd]" : "text-[#22495a]"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
