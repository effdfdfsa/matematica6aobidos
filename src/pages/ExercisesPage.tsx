import { useEffect, useState } from 'react';
import { GraduationCap, LogIn } from 'lucide-react';
import type { AuthMode } from '@/components/AuthModal';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { QuizView } from '@/components/exercises/QuizView';
import { TopicPicker, type TopicFilter } from '@/components/exercises/TopicPicker';
import { WorksheetView } from '@/components/exercises/WorksheetView';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { saveAttempts, type AttemptResult } from '@/lib/attempts';
import { generateExercise, type Exercise } from '@/lib/math/exercises';
import { supabase } from '@/lib/supabase';
import { cardClass, primaryButtonClass } from '@/lib/styles';

type Mode = 'treino' | 'ficha' | 'quiz';

const MODES: { id: Mode; label: string }[] = [
  { id: 'treino', label: 'Treino rápido' },
  { id: 'ficha', label: 'Ficha' },
  { id: 'quiz', label: 'Quiz' },
];

type Stats = { total: number; correct: number };

type ExercisesPageProps = {
  onOpenAuth: (mode: AuthMode) => void;
};

export function ExercisesPage({ onOpenAuth }: ExercisesPageProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('treino');
  const [topic, setTopic] = useState<TopicFilter>('todos');
  const [exercise, setExercise] = useState<Exercise>(() => generateExercise('todos'));
  const [round, setRound] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setStatsError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('exercise_attempts').select('is_correct');
      if (cancelled) return;
      if (error || !Array.isArray(data)) {
        setStatsError('Não foi possível carregar os teus resultados.');
        return;
      }
      setStatsError(null);
      setStats({
        total: data.length,
        correct: data.filter((row) => row.is_correct === true).length,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const nextExercise = (next: TopicFilter = topic) => {
    setExercise(generateExercise(next));
    setRound((value) => value + 1);
  };

  const selectTopic = (next: TopicFilter) => {
    setTopic(next);
    nextExercise(next);
  };

  const recordResults = async (results: AttemptResult[]) => {
    if (!user || results.length === 0) return;
    const saved = await saveAttempts(results);
    if (!saved) {
      setStatsError('Não foi possível guardar estes resultados.');
      return;
    }
    setStatsError(null);
    setStats((current) => ({
      total: (current?.total ?? 0) + results.length,
      correct: (current?.correct ?? 0) + results.filter((result) => result.isCorrect).length,
    }));
  };

  const accuracy = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" />}
        title="Exercícios"
        description="Treina com contas geradas na hora, faz fichas para escrever as respostas ou responde a um quiz."
      />

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Modo">
        {MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={mode === option.id}
            onClick={() => setMode(option.id)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === option.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === 'treino' && (
        <div className="flex flex-col gap-6">
          <TopicPicker value={topic} onChange={selectTopic} />
          <ExerciseCard
            key={round}
            exercise={exercise}
            onAnswer={(isCorrect) => recordResults([{ type: exercise.type, isCorrect }])}
            onNext={() => nextExercise()}
          />
        </div>
      )}
      {mode === 'ficha' && <WorksheetView onFinish={recordResults} />}
      {mode === 'quiz' && <QuizView onFinish={recordResults} />}

      <section className={`${cardClass} mt-8`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Os teus resultados</p>
        {!user && (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-relaxed text-slate-600">
              Cria uma conta para guardar as tuas respostas e acompanhar a tua evolução.
            </p>
            <button type="button" onClick={() => onOpenAuth('signup')} className={`${primaryButtonClass} shrink-0`}>
              <LogIn className="h-4 w-4" />
              Criar conta
            </button>
          </div>
        )}
        {user && statsError && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {statsError}
          </p>
        )}
        {user && !statsError && stats && (
          <dl className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <dt className="text-sm text-slate-500">Respondidos</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{stats.total}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Corretos</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{stats.correct}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Acerto</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-teal-700">
                {accuracy === null ? '—' : `${accuracy}%`}
              </dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
