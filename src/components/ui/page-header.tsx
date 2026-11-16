type PageHeaderProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div className="min-w-0">
        <h1 className="font-display text-3xl leading-tight sm:text-[2.5rem]">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
