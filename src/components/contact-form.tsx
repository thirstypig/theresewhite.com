import { contact } from "@/content/site";

/**
 * Static contact form.
 *
 * On a static host there's no server to receive a POST, so the form submits
 * directly to a form-handling endpoint set via NEXT_PUBLIC_FORM_ENDPOINT
 * (Formspree, Web3Forms, or anything else that accepts a plain form POST).
 *
 * With no endpoint configured we don't render a form that quietly goes
 * nowhere — a broken form is worse than no form. Direct contact details show
 * instead. When the site moves to a host with a server, this goes back to the
 * Resend server action.
 *
 * No client JavaScript: validation is HTML5, so the form works before hydration
 * and would still work with JS disabled entirely.
 */

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

const fieldClass =
  "mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn";

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <p className="m-0">
      <label htmlFor={name} className="label text-muted">
        {label}
        {required ? "" : " (optional)"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </p>
  );
}

function NoEndpointFallback() {
  return (
    <div className="border-l-2 border-rule-strong pl-6">
      <h2 className="display text-2xl text-heading">Get in touch</h2>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        Email or call and we&rsquo;ll find 30 to 45 minutes. It helps to include
        your organization, your role, and a couple of sentences on the
        situation. No names needed at this stage.
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

export function ContactForm() {
  if (!FORM_ENDPOINT) return <NoEndpointFallback />;

  return (
    /* Clarity records sessions. This form invites someone to describe a
       confidential conflict — possibly naming employees and allegations — so
       it is masked explicitly rather than trusting the default masking mode. */
    <form
      action={FORM_ENDPOINT}
      method="POST"
      data-clarity-mask="True"
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label="Organization"
          name="organization"
          required
          autoComplete="organization"
        />
        <Field label="Your role" name="role" autoComplete="organization-title" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />

        <p className="m-0">
          <label htmlFor="urgency" className="label text-muted">
            How urgent is this? (optional)
          </label>
          <select id="urgency" name="urgency" className={fieldClass}>
            <option value="">Select one</option>
            <option value="immediate">Immediate — we need help this week</option>
            <option value="weeks">Within a few weeks</option>
            <option value="exploring">Exploring options</option>
          </select>
        </p>
      </div>

      <p className="m-0">
        <label htmlFor="situation" className="label text-muted">
          What&rsquo;s going on?
        </label>
        <textarea
          id="situation"
          name="situation"
          rows={6}
          required
          minLength={20}
          aria-describedby="situation-hint"
          className={fieldClass}
        />
        <span id="situation-hint" className="mt-1.5 block text-xs text-muted">
          A couple of sentences is plenty. No names needed at this stage.
        </span>
      </p>

      {/* Honeypot — hidden from people, catches most bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {/* Where to send the visitor afterwards. Formspree reads `_next`,
          Web3Forms reads `redirect`; sending both keeps this portable. */}
      <input type="hidden" name="_next" value="/contact/thank-you/" />
      <input type="hidden" name="redirect" value="/contact/thank-you/" />
      <input
        type="hidden"
        name="_subject"
        value="Assessment request from theresewhite.com"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
        >
          Request an assessment
        </button>
        <span className="text-xs text-muted">
          Goes straight to Therese. Nothing is shared with anyone else.
        </span>
      </div>
    </form>
  );
}
