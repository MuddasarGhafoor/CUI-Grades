import { Icon, type IconName } from "./icons";

type PageHeaderProps = {
  icon: IconName;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({ icon, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-on-accent shadow-[0_10px_28px_rgba(45,212,191,0.25)]">
          <Icon name={icon} size={24} />
        </span>
        <div>
          <h1 className="font-display text-3xl tracking-wide sm:text-4xl">{title}</h1>
          <p className="mt-1 max-w-xl text-muted">{description}</p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

export function ComingSoon({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-dashed border-line-strong bg-surface/60 p-6 sm:p-8">
      <p className="font-display text-xl tracking-wide">Coming next</p>
      <p className="mt-1 text-sm text-muted">This calculator is being built step by step.</p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl border border-line bg-sunken px-4 py-3 text-sm"
          >
            <span className="size-2 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
