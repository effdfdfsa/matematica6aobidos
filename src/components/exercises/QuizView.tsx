import { useState } from 'react';
import { TopicPicker, type TopicFilter } from '@/components/exercises/TopicPicker';
import type { AttemptResult } from '@/lib/attempts';
import {
  buildChoices,
  generateExercise,
  isCorrectAnswer,
  type Exercise,
} from '@/lib/math/exercises';
import { cardClass, primaryButtonClass, secondaryButtonClass } from '@/lib/styles';

const QUESTION_COUNT = 5;
const LETTERS = ['A', 'B', 'C', 'D'];

type QuizQuestion = { exercise: Exercise; options: number[] };

type QuizViewProps = {
  onFinish: (results: AttemptResult[]) => void;
};

export function QuizView({ onFinish }: QuizViewProps) {
  const [topic, setTopic] = useState<TopicFilter>('todos');
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<AttemptResult[]>([]);
  const [finished, setFinished] = useState(false);

  const start = () => {
    setQuestions(
      Array.from({ length: QUESTION_COUNT }, () => {
        const exercise = generateExercise(topic);
        return { exercise, options: buildChoices(exercise) };
      }),
    );
    setIndex(0);
    setSelected(null);
    setResults([]);
    setFinished(false);
  };

  if (!questions) {
    return (
      <section className={`${cardClass} flex flex-col gap-6`}>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Tema</p>
          <TopicPicker value={topic} onChange={setTopic} />
        </div>
        <div>
          <button type="button" onClick={start} className={primaryButtonClass}>
            Começar quiz de {QUESTION_COUNT} perguntas
          </button>
        </div>
      </section>
    );
  }

  if (finished) {
    const score = results.filter((result) => result.isCorrect).length;
    return (
      <section className={`${cardClass} flex flex-col items-start gap-4 text-left`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resultado final</p>
        <p className="text-4xl font-bold text-slate-900">
          {score} <span className="text-2xl text-slate-500">de {QUESTION_COUNT}</span>
        </p>
        <p className="leading-relaxed text-slate-600">
          {score === QUESTION_COUNT
            ? 'Excelente! Acertaste em todas.'
            : score >= QUESTION_COUNT / 2
              ? 'Bom trabalho. Revê as que erraste.'
              : 'Continua a praticar. Vais melhorar!'}
        </p>
        <button type="button" onClick={start} className={primaryButtonClass}>
          Novo quiz
        </button>
      </section>
    );
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const progress = ((index + (selected === null ? 0 : 1)) / questions.length) * 100;

  const choose = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    setResults((previous) => [
      ...previous,
      { type: current.exercise.type, isCorrect: isCorrectAnswer(current.exercise, option) },
    ]);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      onFinish(results);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
  };

  return (
    <section className={`${cardClass} flex flex-col gap-6`}>
      <div>
        <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>
            Pergunta {index + 1} de {questions.length}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
        {current.exercise.question}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {current.options.map((option, position) => {
          const isCorrect = isCorrectAnswer(current.exercise, option);
          const isChosen = selected === option;
          const tone =
            selected === null
              ? 'border-slate-200 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50'
              : isCorrect
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                : isChosen
                  ? 'border-red-400 bg-red-50 text-red-800'
                  : 'border-slate-200 bg-white text-slate-400';
          return (
            <button
              key={option}
              type="button"
              disabled={selected !== null}
              onClick={() => choose(option)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-lg font-semibold transition disabled:cursor-default ${tone}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                {LETTERS[position]}
              </span>
              <span className="tabular-nums">{option}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 animate-fade-in">
          <p
            className={`font-semibold ${
              isCorrectAnswer(current.exercise, selected) ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {isCorrectAnswer(current.exercise, selected)
              ? 'Correto!'
              : `Não é esta. A resposta certa é ${current.exercise.answer}.`}
          </p>
          <p className="leading-relaxed text-slate-700">{current.exercise.explanation}</p>
          <div>
            <button type="button" onClick={next} className={secondaryButtonClass}>
              {isLast ? 'Ver resultado' : 'Seguinte'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
