import {
  formatFactorization,
  gcdOfNumbers,
  lcmOfNumbers,
  primeFactorize,
} from '@/lib/math/number';

export type ExerciseType = 'mdc' | 'mmc' | 'fatoracao' | 'divisores' | 'percentagem' | 'equacao';

export type Exercise = {
  type: ExerciseType;
  question: string;
  answer: number;
  explanation: string;
};

export const EXERCISE_TYPES: { id: ExerciseType; label: string }[] = [
  { id: 'mdc', label: 'MDC' },
  { id: 'mmc', label: 'MMC' },
  { id: 'fatoracao', label: 'Fatores primos' },
  { id: 'divisores', label: 'Divisores' },
  { id: 'percentagem', label: 'Percentagens' },
  { id: 'equacao', label: 'Equações' },
];

const CHOICE_COUNT = 4;

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(items: T[]): T => items[randomInt(0, items.length - 1)];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function distinctPair(min: number, max: number): [number, number] {
  let first = randomInt(min, max);
  let second = randomInt(min, max);
  while (second === first) second = randomInt(min, max);
  return [first, second];
}

function mdcExercise(): Exercise {
  const [a, b] = distinctPair(4, 60);
  const answer = gcdOfNumbers([a, b]);
  return {
    type: 'mdc',
    question: `Determina o m.d.c.(${a}, ${b}).`,
    answer,
    explanation: `${a} = ${formatFactorization(primeFactorize(a))} e ${b} = ${formatFactorization(primeFactorize(b))}. Os fatores primos comuns, com o menor expoente, dão m.d.c.(${a}, ${b}) = ${answer}.`,
  };
}

function mmcExercise(): Exercise {
  const [a, b] = distinctPair(3, 30);
  const answer = lcmOfNumbers([a, b]);
  return {
    type: 'mmc',
    question: `Determina o m.m.c.(${a}, ${b}).`,
    answer,
    explanation: `${a} = ${formatFactorization(primeFactorize(a))} e ${b} = ${formatFactorization(primeFactorize(b))}. Todos os fatores primos, com o maior expoente, dão m.m.c.(${a}, ${b}) = ${answer}.`,
  };
}

function fatoracaoExercise(): Exercise {
  const n = randomInt(20, 400);
  const factors = primeFactorize(n);
  const answer = factors[factors.length - 1].prime;
  return {
    type: 'fatoracao',
    question: `Qual é o maior fator primo de ${n}?`,
    answer,
    explanation: `${n} = ${formatFactorization(factors)}. O maior fator primo é ${answer}.`,
  };
}

function divisoresExercise(): Exercise {
  const n = pick([12, 18, 20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80, 90, 100, 120, 144, 180]);
  const factors = primeFactorize(n);
  const answer = factors.reduce((total, factor) => total * (factor.exponent + 1), 1);
  const product = factors.map((factor) => `(${factor.exponent} + 1)`).join(' × ');
  return {
    type: 'divisores',
    question: `Quantos divisores tem ${n}?`,
    answer,
    explanation: `${n} = ${formatFactorization(factors)}. Número de divisores: ${product} = ${answer}.`,
  };
}

function percentagemExercise(): Exercise {
  const percent = pick([5, 10, 15, 20, 25, 30, 40, 50, 75]);
  const value = randomInt(2, 20) * 20;
  const answer = (percent * value) / 100;
  return {
    type: 'percentagem',
    question: `Quanto é ${percent}% de ${value}?`,
    answer,
    explanation: `${percent}% de ${value} = ${percent} / 100 × ${value} = ${answer}.`,
  };
}

function equacaoExercise(): Exercise {
  const a = randomInt(2, 9);
  const x = randomInt(-6, 12);
  const b = randomInt(-15, 15);
  const c = a * x + b;
  const equation = b === 0 ? `${a}x = ${c}` : `${a}x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${c}`;
  const subtraction = b === 0 ? `${c}` : `${c} ${b > 0 ? '−' : '+'} ${Math.abs(b)}`;
  return {
    type: 'equacao',
    question: `Resolve a equação ${equation}. Qual é o valor de x?`,
    answer: x,
    explanation: `${a}x = ${subtraction} = ${a * x}, logo x = ${a * x} / ${a} = ${x}.`,
  };
}

const GENERATORS: Record<ExerciseType, () => Exercise> = {
  mdc: mdcExercise,
  mmc: mmcExercise,
  fatoracao: fatoracaoExercise,
  divisores: divisoresExercise,
  percentagem: percentagemExercise,
  equacao: equacaoExercise,
};

export function generateExercise(type: ExerciseType | 'todos'): Exercise {
  const chosen = type === 'todos' ? pick(EXERCISE_TYPES.map((item) => item.id)) : type;
  return GENERATORS[chosen]();
}

export function buildChoices(exercise: Exercise): number[] {
  const options = new Set<number>([exercise.answer]);
  for (const offset of shuffle([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6])) {
    if (options.size === CHOICE_COUNT) break;
    options.add(exercise.answer + offset);
  }
  return shuffle([...options]);
}

export function isCorrectAnswer(exercise: Exercise, value: number): boolean {
  return Math.abs(value - exercise.answer) < 1e-6;
}
