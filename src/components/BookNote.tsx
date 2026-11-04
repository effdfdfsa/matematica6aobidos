import type { ReactNode } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';

type BookNoteProps = {
  kind: 'note' | 'example';
  children: ReactNode;
};

export function BookNote({ kind, children }: BookNoteProps) {
  const isNote = kind === 'note';
  return (
    <aside
      className={`rounded-2xl border-l-4 p-5 sm:p-6 ${
        isNote ? 'border-amber-400 bg-amber-50' : 'border-teal-600 bg-teal-50'
      }`}
    >
      <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
        {isNote ? <Lightbulb className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
        {isNote ? 'Toma nota' : 'Exemplo'}
      </p>
      <div className="leading-relaxed text-slate-800">{children}</div>
    </aside>
  );
}
