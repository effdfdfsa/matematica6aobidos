import { useState, type FormEvent } from 'react';
import { CheckCircle2, Layers } from 'lucide-react';
import { BookNote } from '@/components/BookNote';
import { FactorTree } from '@/components/FactorTree';
import { NumberInput } from '@/components/NumberInput';
import { PageHeader } from '@/components/PageHeader';
import {
  MAX_INTEGER_INPUT,
  buildFactorTree,
  formatFactorization,
  primeDivisionSteps,
  primeFactorize,
  type DivisionStep,
  type PrimeFactor,
} from '@/lib/math/number';
import { cardClass, primaryButtonClass, secondaryButtonClass } from '@/lib/styles';

type Result = { n: number; steps: DivisionStep[]; factors: PrimeFactor[] };

const EXAMPLES = ['360', '1001', '97', '2048'];

function parseWholeNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  if (parsed < 2 || parsed > MAX_INTEGER_INPUT) return null;
  return parsed;
}

export function FactorizationPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decompose = (value: string) => {
    const n = parseWholeNumber(value);
    if (n === null) {
      setResult(null);
      setError(`Introduz um número inteiro entre 2 e ${MAX_INTEGER_INPUT.toLocaleString('pt-PT')}.`);
      return;
    }
    setError(null);
    setInput(String(n));
    setResult({ n, steps: primeDivisionSteps(n), factors: primeFactorize(n) });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    decompose(input);
  };

  const isPrime = result !== null && result.factors.length === 1 && result.factors[0].exponent === 1;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={<Layers className="h-6 w-6" />}
        title="Fatores primos"
        description="Escreve um número inteiro e vê a sua decomposição em fatores primos, passo a passo."
      />

      <div className="mb-6">
        <BookNote kind="note">
          <p>
            Decompor um número em fatores primos é escrevê-lo como produto de números primos. Divide-se
            sucessivamente pelo menor primo possível até o quociente ser 1.
          </p>
        </BookNote>
      </div>

      <section className={cardClass}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <NumberInput
                id="factor-input"
                label="Número"
                value={input}
                onChange={setInput}
                placeholder="Ex.: 360"
              />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Decompor
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Experimenta:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => decompose(example)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
              >
                {example}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section className={`${cardClass} mt-6 animate-fade-in`}>
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resultado</p>
            <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {result.n} = {formatFactorization(result.factors)}
            </p>
            {isPrime && (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {result.n} é um número primo.
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Dividendo</th>
                  <th className="py-3 pr-4 font-semibold">Divisor (primo)</th>
                  <th className="py-3 font-semibold">Quociente</th>
                </tr>
              </thead>
              <tbody>
                {result.steps.map((step, index) => (
                  <tr key={index} className="border-b border-slate-100 text-slate-800">
                    <td className="py-3 pr-4 font-mono tabular-nums">{step.dividend}</td>
                    <td className="py-3 pr-4 font-mono tabular-nums text-teal-700">{step.divisor}</td>
                    <td className="py-3 font-mono tabular-nums">{step.quotient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Decomposição em árvore</p>
            <FactorTree tree={buildFactorTree(result.n)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {result.factors.map((factor) => (
              <span
                key={factor.prime}
                className="rounded-xl bg-teal-50 px-4 py-2 font-mono text-lg font-semibold text-teal-800"
              >
                {factor.prime}
                <span className="text-sm text-teal-600"> × {factor.exponent}</span>
              </span>
            ))}
          </div>
          <div className="mt-6">
            <button type="button" onClick={() => setResult(null)} className={secondaryButtonClass}>
              Limpar resultado
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
