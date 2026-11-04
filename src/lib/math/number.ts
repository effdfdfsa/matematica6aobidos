export type PrimeFactor = { prime: number; exponent: number };

export type DivisionStep = { dividend: number; divisor: number; quotient: number };

export const MAX_INTEGER_INPUT = 1_000_000_000_000;

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

export function primeDivisionSteps(n: number): DivisionStep[] {
  const steps: DivisionStep[] = [];
  let rest = n;
  let divisor = 2;

  while (rest > 1) {
    if (divisor * divisor > rest) divisor = rest;

    if (rest % divisor === 0) {
      steps.push({ dividend: rest, divisor, quotient: rest / divisor });
      rest /= divisor;
    } else {
      divisor = divisor === 2 ? 3 : divisor + 2;
    }
  }

  return steps;
}

export function primeFactorize(n: number): PrimeFactor[] {
  const factors: PrimeFactor[] = [];

  for (const { divisor } of primeDivisionSteps(n)) {
    const last = factors[factors.length - 1];
    if (last && last.prime === divisor) {
      last.exponent += 1;
    } else {
      factors.push({ prime: divisor, exponent: 1 });
    }
  }

  return factors;
}

export type FactorTreeNode = { value: number; children: [FactorTreeNode, FactorTreeNode] | null };

function smallestPrimeFactor(n: number): number {
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (n % divisor === 0) return divisor;
  }
  return n;
}

export function buildFactorTree(n: number): FactorTreeNode {
  const prime = smallestPrimeFactor(n);
  if (prime === n) return { value: n, children: null };
  return {
    value: n,
    children: [{ value: prime, children: null }, buildFactorTree(n / prime)],
  };
}

export function formatPrimePower({ prime, exponent }: PrimeFactor): string {
  if (exponent === 1) return String(prime);
  const superscript = String(exponent)
    .split('')
    .map((digit) => SUPERSCRIPTS[digit])
    .join('');
  return `${prime}${superscript}`;
}

export function formatFactorization(factors: PrimeFactor[]): string {
  return factors.map(formatPrimePower).join(' × ');
}

function exponentsByPrime(lists: PrimeFactor[][]): Map<number, number[]> {
  const map = new Map<number, number[]>();

  lists.forEach((list, index) => {
    for (const { prime, exponent } of list) {
      const row = map.get(prime) ?? lists.map(() => 0);
      row[index] = exponent;
      map.set(prime, row);
    }
  });

  return map;
}

export function gcdOfNumbers(numbers: number[]): number {
  let result = 1;
  for (const [prime, exponents] of exponentsByPrime(numbers.map(primeFactorize))) {
    result *= prime ** Math.min(...exponents);
  }
  return result;
}

export function lcmOfNumbers(numbers: number[]): number {
  let result = 1;
  for (const [prime, exponents] of exponentsByPrime(numbers.map(primeFactorize))) {
    result *= prime ** Math.max(...exponents);
  }
  return result;
}

export function formatDecimal(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

export function parseAnswer(input: string): number | null {
  const normalized = input.trim().replace(',', '.');
  if (normalized === '') return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
