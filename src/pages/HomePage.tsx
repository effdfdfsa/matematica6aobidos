import { ArrowRight, Divide, GraduationCap, Layers, Percent, Sigma, type LucideIcon } from 'lucide-react';
import type { RouteId } from '@/lib/routes';
import { SITE_NAME } from '@/lib/site';
import { primaryButtonClass } from '@/lib/styles';

type HomePageProps = {
  onNavigate: (route: RouteId) => void;
};

const TOOLS: { id: RouteId; title: string; description: string; icon: LucideIcon }[] = [
  {
    id: 'fatoracao',
    title: 'Fatores primos',
    description: 'Decompõe qualquer número na sua forma de fatores primos, passo a passo.',
    icon: Layers,
  },
  {
    id: 'mdc-mmc',
    title: 'MDC e MMC',
    description: 'Calcula o máximo divisor comum e o mínimo múltiplo comum de vários números.',
    icon: Divide,
  },
  {
    id: 'equacoes',
    title: 'Equações do 2.º grau',
    description: 'Encontra as raízes, o discriminante e o vértice de uma parábola.',
    icon: Sigma,
  },
  {
    id: 'percentagens',
    title: 'Percentagens',
    description: 'Descontos, aumentos, variações e partes de um total em segundos.',
    icon: Percent,
  },
  {
    id: 'exercicios',
    title: 'Exercícios',
    description: 'Treina com exercícios gerados na hora e vê as soluções quando quiseres.',
    icon: GraduationCap,
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden bg-slate-900">
        <img
          src="https://images.pexels.com/photos/3986613/pexels-photo-3986613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Mãos a escrever equações num caderno com lápis e régua"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
            {SITE_NAME}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.15] text-white sm:text-5xl">
            Matemática clara, passo a passo, sempre à mão.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-200">
            Ferramentas para decompor números, calcular MDC e MMC, resolver equações e treinar com
            exercícios que se geram na hora.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('fatoracao')}
              className={`${primaryButtonClass} group`}
            >
              Começar com fatores primos
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('exercicios')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Fazer exercícios
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Ferramentas</h2>
          <p className="mt-2 text-slate-600">Escolhe o que queres resolver hoje.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onNavigate(tool.id)}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold text-slate-900">{tool.title}</span>
                <span className="leading-relaxed text-slate-600">{tool.description}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
