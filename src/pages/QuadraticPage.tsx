import { useState, type FormEvent } from 'react';
import { Sigma } from 'lucide-react';
import { NumberInput } from '@/components/NumberInput';
import { PageHeader } from '@/components/PageHeader';
import { formatDecimal, parseAnswer } from '@/lib/math/number';
import { solveQuadratic, vertexOf, type QuadraticSolution, type Vertex } from '@/lib/math/quadratic';
import { cardClass, primaryButtonClass } from '@/lib/styles';

type Coefficients = { a: string; b: string; c: string };

type Result = {
  coefficients: [number, number, number];
  solution: QuadraticSolution;
  vertex: Vertex;
};

function polynomialText([a, b, c]: [number, number, number]): string {
  const terms: [number, string][] = [
    [a, 'x²'],
    [b, 'x'],
    [c, ''],
  ];
  let text = '';
  for (const [coefficient, suffix] of terms) {
    if (coefficient === 0) continue;
    const magnitude = Math.abs(coefficient);
    const number = magnitude === 1 && suffix ? '' : formatDecimal(magnitude);
    const prefix = text === '' ? (coefficient < 0 ? '−' : '') : coefficient < 0 ? ' − ' : ' + ';
    text += `${prefix}${number}${suffix}`;
  }
  return `${text} = 0`;
}

export function QuadraticPage() {
  const [coefficients, setCoefficients] = useState<Coefficients>({ a: '1', b: '-3', c: '2' });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateCoefficient = (key: keyof Coefficients) => (value: string) =>
    setCoefficients((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const a = parseAnswer(coefficients.a);
    const b = parseAnswer(coefficients.b);
    const c = parseAnswer(coefficients.c);

    if (a === null || b === null || c === null) {
      setResult(null);
      setError('Preenche a, b e c com números.');
      return;
    }
    if (a === 0) {
      setResult(null);
      setError('O valor de a tem de ser diferente de zero, senão não é uma equação do 2.º grau.');
      return;
    }

    setError(null);
    setResult({
      coefficients: [a, b, c],
      solution: solveQuadratic(a, b, c),
      vertex: vertexOf(a, b, c),
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={<Sigma className="h-6 w-6" />}
        title="Equações do 2.º grau"
        description="Introduz os coeficientes de ax² + bx + c = 0 para encontrar as raízes, o discriminante e o vértice."
      />

      <section className={cardClass}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberInput id="coef-a" label="a" value={coefficients.a} onChange={updateCoefficient('a')} placeholder="1" />
            <NumberInput id="coef-b" label="b" value={coefficients.b} onChange={updateCoefficient('b')} placeholder="-3" />
            <NumberInput id="coef-c" label="c" value={coefficients.c} onChange={updateCoefficient('c')} placeholder="2" />
          </div>
          <div>
            <button type="submit" className={primaryButtonClass}>
              Resolver
            </button>
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section className="mt-6 grid gap-6 animate-fade-in sm:grid-cols-2">
          <div className={`${cardClass} sm:col-span-2`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Equação</p>
            <p className="mt-2 font-mono text-2xl font-bold text-slate-900">
              {polynomialText(result.coefficients)}
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Discriminante (Δ)</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
              {formatDecimal(result.solution.delta)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {result.solution.delta > 0 && 'Δ > 0: duas soluções reais diferentes.'}
              {result.solution.delta === 0 && 'Δ = 0: uma única solução real.'}
              {result.solution.delta < 0 && 'Δ < 0: não existem soluções reais.'}
            </p>
          </div>

          <div className={cardClass}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Soluções</p>
            <div className="mt-2 flex flex-col gap-2 font-mono text-2xl font-bold tabular-nums text-teal-700">
              {result.solution.kind === 'two-real' && (
                <>
                  <span>x₁ = {formatDecimal(result.solution.x1)}</span>
                  <span>x₂ = {formatDecimal(result.solution.x2)}</span>
                </>
              )}
              {result.solution.kind === 'double' && (
                <span>x = {formatDecimal(result.solution.x)}</span>
              )}
              {result.solution.kind === 'none' && (
                <span className="text-base font-semibold text-slate-600">Sem soluções reais</span>
              )}
            </div>
          </div>

          <div className={`${cardClass} sm:col-span-2`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Vértice da parábola</p>
            <p className="mt-2 font-mono text-xl font-semibold text-slate-900">
              V = ({formatDecimal(result.vertex.x)}, {formatDecimal(result.vertex.y)})
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
