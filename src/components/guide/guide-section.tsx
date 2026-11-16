type GuideSectionProps = {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

/** A titled block on the Guide page, with the heading outside the cards for a cleaner read. */
export function GuideSection({ id, title, description, children }: GuideSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <div className="mb-5 max-w-2xl">
        <h2 id={id} className="font-display text-xl sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}
