import { useState, type FormEvent } from 'react';
import { Percent } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { PageHeader } from '@/components/PageHeader';
import { formatDecimal, parseAnswer } from '@/lib/math/number';
import { PERCENTAGE_MODES, type PercentageMode } from '@/lib/math/percentages';
import { cardClass, primaryButtonClass } from '@/lib/styles';

type Result = { value: string; suffix: string };

export function PercentagesPage() {
  const [mode, setMode] = useState<PercentageMode>(PERCENTAGE_MODES[0]);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectMode = (next: PercentageMode) => {
    setMode(next);
    setResult(null);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const a = parseAnswer(first);
    const b = parseAnswer(second);

    if (a === null || b === null) {
      setResult(null);
      setError('Preenche os dois campos com números.');
      return;
    }

    const value = mode.compute(a, b);
    if (!Number.isFinite(value)) {
      setResult(null);
      setError('Não é possível dividir por zero. Verifica o segundo valor.');
      return;
    }

    setError(null);
    setResult({ value: formatDecimal(value), suffix: mode.resultSuffix });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={<Percent className="h-6 w-6" />}
        title="Percentagens"
        description="Escolhe o tipo de cálculo, preenche os valores e obtém o resultado de imediato."
      />

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Tipo de cálculo">
        {PERCENTAGE_MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mode.id === option.id}
            onClick={() => selectMode(option)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              mode.id === option.id
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className={cardClass}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              id="percent-first"
              label={mode.fields[0]}
              value={first}
              onChange={setFirst}
            />
            <NumberInput
              id="percent-second"
              label={mode.fields[1]}
              value={second}
              onChange={setSecond}
            />
          </div>
          <div>
            <button type="submit" className={primaryButtonClass}>
              Calcular
            </button>
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-8 rounded-2xl bg-teal-50 p-6 animate-fade-in">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Resultado</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-teal-900">
              {result.value}
              {result.suffix}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
