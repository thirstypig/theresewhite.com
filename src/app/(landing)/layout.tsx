/**
 * Bare layout for campaign landing pages.
 *
 * No header, no footer, no nav — a landing page has one job and every link
 * off it is a way to fail at that job. The pages carry their own minimal
 * contact strip instead.
 *
 * The root layout still wraps this, so these pages keep the document shell,
 * fonts, the pre-paint theme script, JSON-LD and the consent banner. The
 * banner matters: analytics load here the same as anywhere else.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="flex-1">
      {children}
    </main>
  );
}
