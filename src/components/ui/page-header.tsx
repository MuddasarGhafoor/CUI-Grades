type PageHeaderProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
  /** Smaller title and text, for reading-heavy pages like the Guide. */
  compact?: boolean;
};

export function PageHeader({ title, description, actions, compact = false }: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden ${
        compact ? "mb-6" : "mb-8"
      }`}
    >
      <div className="min-w-0">
        <h1
          className={`font-display leading-tight ${
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-[2.5rem]"
          }`}
        >
          {title}
        </h1>
        <p className={`mt-2 max-w-2xl text-muted ${compact ? "text-sm" : ""}`}>{description}</p>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
