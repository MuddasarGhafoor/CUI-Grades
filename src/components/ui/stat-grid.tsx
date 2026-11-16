export type Stat = {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  /** The headline number: shown larger, in the display font. */
  primary?: boolean;
  valueClassName?: string;
};

/** A row of numbers inside one card, split by thin dividers. First item is usually the headline. */
export function StatGrid({ label, stats }: { label: string; stats: Stat[] }) {
  return (
    <section aria-label={label} className="card grid overflow-hidden sm:grid-cols-[1.4fr_1fr_1fr]">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`p-5 ${i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${
            stat.primary ? "bg-surface-2/40" : ""
          }`}
        >
          <p className="text-xs font-medium text-muted">{stat.label}</p>
          <p
            className={`mt-1.5 tabular-nums ${
              stat.primary ? "font-display text-5xl leading-none" : "text-2xl font-semibold"
            } ${stat.valueClassName ?? ""}`}
          >
            {stat.value}
          </p>
          {stat.note && <p className="mt-2 text-xs text-muted">{stat.note}</p>}
        </div>
      ))}
    </section>
  );
}
