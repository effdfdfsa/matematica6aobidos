import { useState, type FormEvent } from 'react';
import { Divide } from 'lucide-react';
import { BookNote } from '@/components/BookNote';
import { NumberInput } from '@/components/NumberInput';
import { PageHeader } from '@/components/PageHeader';
import {
  MAX_INTEGER_INPUT,
  formatFactorization,
  gcdOfNumbers,
  lcmOfNumbers,
  primeFactorize,
} from '@/lib/math/number';
import { cardClass, primaryButtonClass } from '@/lib/styles';

const MIN_COUNT = 2;
const MAX_COUNT = 6;
const EXAMPLE = '24, 180';

type Result = {
  numbers: number[];
  gcd: number;
  lcm: number | null;
};

function parseNumbers(value: string): number[] | null {
  const tokens = value.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length < MIN_COUNT || tokens.length > MAX_COUNT) return null;
  const numbers = tokens.map(Number);
  const valid = tokens.every((token, index) => {
    const number = numbers[index];
    return /^\d+$/.test(token) && number >= 1 && number <= MAX_INTEGER_INPUT;
  });
  return valid ? numbers : null;
}

export function GcdLcmPage() {
  const [input, setInput] = useState(EXAMPLE);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numbers = parseNumbers(input);
    if (!numbers) {
      setResult(null);
      setError(
        `Introduz entre ${MIN_COUNT} e ${MAX_COUNT} números inteiros positivos, separados por vírgulas.`,
      );
      return;
    }
    const lcm = lcmOfNumbers(numbers);
    setError(null);
    setResult({
      numbers,
      gcd: gcdOfNumbers(numbers),
      lcm: Number.isSafeInteger(lcm) ? lcm : null,
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={<Divide className="h-6 w-6" />}
        title="MDC e MMC"
        description="Calcula o máximo divisor comum e o mínimo múltiplo comum de dois ou mais números."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <BookNote kind="note">
          <p>
            O <strong>m.d.c.</strong> de dois números é o produto dos fatores primos comuns, cada um elevado ao{' '}
            <strong>menor</strong> expoente.
          </p>
          <p className="mt-2">
            O <strong>m.m.c.</strong> é o produto dos fatores primos comuns, cada um elevado ao{' '}
            <strong>maior</strong> expoente, e dos fatores não comuns.
          </p>
        </BookNote>
        <BookNote kind="example">
          <p className="font-mono text-sm sm:text-base">24 = 2³ × 3</p>
          <p className="font-mono text-sm sm:text-base">180 = 2² × 3² × 5</p>
          <p className="mt-3">
            m.d.c.(24, 180) = 2² × 3 = <strong>12</strong>
          </p>
          <p>
            m.m.c.(24, 180) = 2³ × 3² × 5 = <strong>360</strong>
          </p>
        </BookNote>
      </div>

      <section className={cardClass}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <NumberInput
              id="gcd-input"
              label="Números (separados por vírgulas)"
              value={input}
              onChange={setInput}
              placeholder={EXAMPLE}
            />
          </div>
          <button type="submit" className={primaryButtonClass}>
            Calcular
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section className="mt-6 grid gap-6 animate-fade-in sm:grid-cols-2">
          <div className={cardClass}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">MDC</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-teal-700">{result.gcd}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Maior número que divide todos os valores introduzidos.
            </p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">MMC</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-teal-700">
              {result.lcm ?? 'Demasiado grande'}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Menor número que é múltiplo de todos os valores introduzidos.
            </p>
          </div>

          <div className={`${cardClass} sm:col-span-2`}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Fatores primos de cada número
            </p>
            <ul className="flex flex-col divide-y divide-slate-100">
              {result.numbers.map((number, index) => {
                const factors = primeFactorize(number);
                return (
                  <li key={`${number}-${index}`} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <span className="font-semibold text-slate-900 tabular-nums">{number}</span>
                    <span className="font-mono text-slate-700">
                      {formatFactorization(factors) || '1'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
