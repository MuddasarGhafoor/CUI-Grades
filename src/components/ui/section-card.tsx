type SectionCardProps = {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Padding for the body. Lists that draw their own row padding pass "". */
  bodyClassName?: string;
  as?: "section" | "aside" | "div";
};

/** A card with a titled header bar. Used for most panels on every page. */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "p-4",
  as: Tag = "section",
}: SectionCardProps) {
  return (
    <Tag className={`card ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}
