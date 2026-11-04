import { useState, type FormEvent } from 'react';
import { CheckCircle2, CircleAlert, Eye, RefreshCw } from 'lucide-react';
import { isCorrectAnswer, type Exercise } from '@/lib/math/exercises';
import { parseAnswer } from '@/lib/math/number';
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from '@/lib/styles';

type ExerciseCardProps = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
};

type Status = 'idle' | 'correct' | 'wrong' | 'invalid';

export function ExerciseCard({ exercise, onAnswer, onNext }: ExerciseCardProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [revealed, setRevealed] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = parseAnswer(input);
    if (value === null) {
      setStatus('invalid');
      return;
    }
    const correct = isCorrectAnswer(exercise, value);
    setStatus(correct ? 'correct' : 'wrong');
    if (!recorded) {
      setRecorded(true);
      onAnswer(correct);
    }
  };

  return (
    <section className={`${cardClass} animate-fade-in`}>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Exercício</p>
      <p className="mt-3 text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
        {exercise.question}
      </p>

      <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <label htmlFor="exercise-answer" className="sr-only">
          A tua resposta
        </label>
        <input
          id="exercise-answer"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="A tua resposta"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setStatus('idle');
          }}
          className={`${inputClass} sm:max-w-xs`}
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={primaryButtonClass}>
            Verificar
          </button>
          <button type="button" onClick={() => setRevealed(true)} className={secondaryButtonClass}>
            <Eye className="h-4 w-4" />
            Mostrar solução
          </button>
        </div>
      </form>

      {status === 'correct' && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
          Correto! Muito bem.
        </p>
      )}
      {status === 'wrong' && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700">
          <CircleAlert className="h-5 w-5" />
          Ainda não está certo. Tenta outra vez ou mostra a solução.
        </p>
      )}
      {status === 'invalid' && (
        <p role="alert" className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Escreve um número para verificar a resposta.
        </p>
      )}

      {revealed && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 animate-fade-in">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Solução</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{exercise.answer}</p>
          <p className="mt-3 leading-relaxed text-slate-700">{exercise.explanation}</p>
        </div>
      )}

      <div className="mt-8 border-t border-slate-100 pt-6">
        <button type="button" onClick={onNext} className={secondaryButtonClass}>
          <RefreshCw className="h-4 w-4" />
          Novo exercício
        </button>
      </div>
    </section>
  );
}
