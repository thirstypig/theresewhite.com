import { AdminGate } from "@/components/admin-gate";

/**
 * Locks every page under /stylebible behind the admin password: the style
 * bible itself, the two sample homepages and the comparison page.
 *
 * These pages are for James, Therese and Bill. The bible criticizes the
 * current design in plain terms, and the samples are drafts nobody has
 * approved, so none of it should be readable by a visitor who finds the
 * address, least of all once the site is on theresewhite.com.
 *
 * The lock is here, in the layout, and not in each page, so a page added to
 * this folder later is locked without anyone having to remember. The same
 * password opens /admin, and entering it once opens both for as long as the
 * tab stays open.
 *
 * It is the weak kind of lock described in src/components/admin-gate.tsx:
 * right for keeping visitors and search engines out, wrong for anything
 * confidential.
 */
export default function StyleBibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate
      title="Style bible"
      note="Design notes and sample pages for the people working on this website. Enter the admin password to open them."
    >
      {children}
    </AdminGate>
  );
}
