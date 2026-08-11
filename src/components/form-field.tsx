/**
 * Shared form primitives.
 *
 * Both forms on this site post directly to Web3Forms and share their field
 * styling. Extracted so a styling change lands in one place rather than
 * drifting between the contact form and the partner form.
 *
 * `NoKeyFallback` is deliberately NOT shared: each form's fallback copy says
 * something different, and one component with a `variant` prop would be worse
 * than two short functions.
 */

export const fieldClass =
  "mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn";

export function Field({
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
