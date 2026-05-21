import type { ReactNode } from 'react';

export function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 md:p-4">
      <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}>
        <Icon className="text-lg" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-white md:text-3xl">{value}</p>
    </div>
  );
}

export function TableShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-panel rounded-3xl p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
