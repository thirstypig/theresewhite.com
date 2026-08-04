export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-rule bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="label text-muted">{eyebrow}</p>
        <h1 className="display mt-4 max-w-3xl text-4xl text-heading sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
