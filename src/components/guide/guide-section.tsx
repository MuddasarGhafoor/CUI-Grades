type GuideSectionProps = {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

/** A titled block on the Guide page, with the heading outside the cards for a cleaner read. */
export function GuideSection({ id, title, description, children }: GuideSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-16">
      <div className="mb-6 max-w-2xl">
        <h2 id={id} className="font-display text-2xl sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}
