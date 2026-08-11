import { collaborate, contact } from "@/content/site";
import { Field, fieldClass } from "@/components/form-field";
import { SITE_URL } from "@/lib/site-config";

/**
 * Partner enquiry form, posting to Web3Forms.
 *
 * Same mechanics as the contact form — a static host has no server to receive
 * a POST, so the form submits directly to Web3Forms with no JavaScript.
 *
 * The `subject` differs on purpose. These land in the same inbox as client
 * enquiries, and Therese needs to tell a peer making an introduction apart
 * from an organization in crisis without opening the mail.
 */

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Unlike the contact form's fallback, this one has no heading of its own.
 * The /collaborate page already puts a section heading above `<PartnerForm />`
 * in both the form and no-key branches, so adding one here would duplicate it.
 */
function NoKeyFallback() {
  return (
    <div className="border-l-2 border-rule-strong pl-6">
      <p className="text-base leading-relaxed text-charcoal">
        Email or call. Tell me what you do and the kind of work you come
        across, and we&rsquo;ll find a time to talk.
      </p>
      <ul className="mt-6 space-y-3 text-lg">
        <li>
          <a
            href={contact.emailHref}
            className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            {contact.email}
          </a>
        </li>
        <li>
          <a
            href={contact.phoneHref}
            className="text-heading underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-heading"
          >
            {contact.phone}
          </a>
        </li>
      </ul>
    </div>
  );
}

export function PartnerForm() {
  if (!ACCESS_KEY) return <NoKeyFallback />;

  return (
    /* Clarity records sessions. The note field invites "I have a client
       where...", so it is masked explicitly rather than trusting the default
       masking mode — same reasoning as the contact form. */
    <form
      action={ENDPOINT}
      method="POST"
      data-clarity-mask="True"
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        {/* Web3Forms uses the field literally named `email` as the reply-to,
            so replying to the notification reaches the sender directly. */}
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label="Firm or practice"
          name="organization"
          required
          autoComplete="organization"
        />

        <p className="m-0">
          <label htmlFor="practice" className="label text-muted">
            What you do (optional)
          </label>
          <select id="practice" name="practice" className={fieldClass}>
            <option value="">Select one</option>
            {collaborate.partnerTypes.items.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
            <option value={collaborate.form.otherLabel}>
              {collaborate.form.otherLabel}
            </option>
          </select>
        </p>
      </div>

      <p className="m-0">
        <label htmlFor="note" className="label text-muted">
          How you&rsquo;d like to work together
        </label>
        <textarea
          id="note"
          name="note"
          rows={5}
          required
          aria-describedby="note-hint"
          className={fieldClass}
        />
        <span id="note-hint" className="mt-1.5 block text-xs text-muted">
          A sentence is plenty. No client details needed.
        </span>
      </p>

      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input
        type="hidden"
        name="subject"
        value="Partner enquiry from theresewhite.com"
      />
      <input type="hidden" name="from_name" value="theresewhite.com" />
      {/* Web3Forms requires an absolute https URL here; a relative path is
          ignored and the visitor lands on Web3Forms' own success page. The
          trailing slash matters — next.config.ts sets trailingSlash: true. */}
      <input
        type="hidden"
        name="redirect"
        value={`${SITE_URL}/collaborate/thank-you/`}
      />

      {/* Web3Forms' honeypot. Must be named exactly `botcheck` — a differently
          named decoy field is submitted as ordinary form data and ignored. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
        >
          Send an introduction
        </button>
        <span className="text-xs text-muted">
          Goes straight to Therese. Nothing is shared with anyone else.
        </span>
      </div>
    </form>
  );
}
