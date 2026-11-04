import { useState } from 'react';
import { CheckCircle2, CircleX, RotateCcw } from 'lucide-react';
import { TopicPicker, type TopicFilter } from '@/components/exercises/TopicPicker';
import type { AttemptResult } from '@/lib/attempts';
import { generateExercise, isCorrectAnswer, type Exercise } from '@/lib/math/exercises';
import { parseAnswer } from '@/lib/math/number';
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from '@/lib/styles';

const SIZES = [5, 10];

type WorksheetViewProps = {
  onFinish: (results: AttemptResult[]) => void;
};

export function WorksheetView({ onFinish }: WorksheetViewProps) {
  const [topic, setTopic] = useState<TopicFilter>('todos');
  const [size, setSize] = useState(5);
  const [items, setItems] = useState<Exercise[] | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<boolean[] | null>(null);

  const generate = () => {
    setItems(Array.from({ length: size }, () => generateExercise(topic)));
    setAnswers(Array.from({ length: size }, () => ''));
    setOutcomes(null);
  };

  const correct = () => {
    if (!items) return;
    const results = items.map((exercise, index) => {
      const value = parseAnswer(answers[index]);
      return value !== null && isCorrectAnswer(exercise, value);
    });
    setOutcomes(results);
    onFinish(items.map((exercise, index) => ({ type: exercise.type, isCorrect: results[index] })));
  };

  if (!items) {
    return (
      <section className={`${cardClass} flex flex-col gap-6`}>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Tema</p>
          <TopicPicker value={topic} onChange={setTopic} />
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Número de contas</p>
          <div className="flex gap-2">
            {SIZES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={size === option}
                onClick={() => setSize(option)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  size === option
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                }`}
              >
                {option} contas
              </button>
            ))}
          </div>
        </div>
        <div>
          <button type="button" onClick={generate} className={primaryButtonClass}>
            Gerar ficha
          </button>
        </div>
      </section>
    );
  }

  const score = outcomes ? outcomes.filter(Boolean).length : null;

  return (
    <section className="flex flex-col gap-4">
      <div className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Ficha</p>
          {score !== null ? (
            <p className="mt-1 text-2xl font-bold text-slate-900">
              Acertaste {score} de {items.length}
            </p>
          ) : (
            <p className="mt-1 text-slate-600">Escreve as respostas e depois corrige.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {outcomes === null && (
            <button type="button" onClick={correct} className={primaryButtonClass}>
              Corrigir
            </button>
          )}
          <button type="button" onClick={generate} className={secondaryButtonClass}>
            <RotateCcw className="h-4 w-4" />
            Nova ficha
          </button>
        </div>
      </div>

      <ol className="flex flex-col gap-4">
        {items.map((exercise, index) => {
          const isRight = outcomes?.[index];
          return (
            <li key={index} className={`${cardClass} p-5 sm:p-6`}>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-col gap-4">
                  <p className="text-lg font-semibold text-slate-900">{exercise.question}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      aria-label={`Resposta ao exercício ${index + 1}`}
                      placeholder="Resposta"
                      disabled={outcomes !== null}
                      value={answers[index] ?? ''}
                      onChange={(event) =>
                        setAnswers((current) =>
                          current.map((value, position) => (position === index ? event.target.value : value)),
                        )
                      }
                      className={`${inputClass} sm:max-w-[12rem]`}
                    />
                    {isRight === true && (
                      <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" /> Correto
                      </span>
                    )}
                    {isRight === false && (
                      <span className="flex items-center gap-2 text-sm font-semibold text-red-700">
                        <CircleX className="h-5 w-5" /> Resposta: {exercise.answer}
                      </span>
                    )}
                  </div>
                  {isRight === false && (
                    <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                      {exercise.explanation}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
