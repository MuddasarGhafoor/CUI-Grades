import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-[96rem] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <Logo />
        <p className="text-xs text-muted">
          Unofficial student tool. Not affiliated with COMSATS University Islamabad.
        </p>
      </div>
    </footer>
  );
}
