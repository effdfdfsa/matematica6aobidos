import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <header className="mb-8 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
      </div>
    </header>
  );
}
