export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-8 pt-4 text-xs leading-relaxed text-muted sm:px-6 lg:px-10">
      <div className="flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-sm text-fg">CUI-Grades</span> is an unofficial student
          tool and is not affiliated with COMSATS University Islamabad.
        </p>
        <p>Grades use the CUI scale for students admitted in Fall 2021 or later.</p>
      </div>
    </footer>
  );
}
