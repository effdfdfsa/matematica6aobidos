export type QuadraticSolution =
  | { kind: 'two-real'; delta: number; x1: number; x2: number }
  | { kind: 'double'; delta: number; x: number }
  | { kind: 'none'; delta: number };

export type Vertex = { x: number; y: number };

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution {
  const delta = b * b - 4 * a * c;

  if (delta < 0) return { kind: 'none', delta };
  if (delta === 0) return { kind: 'double', delta, x: -b / (2 * a) };

  const root = Math.sqrt(delta);
  const first = (-b - root) / (2 * a);
  const second = (-b + root) / (2 * a);

  return {
    kind: 'two-real',
    delta,
    x1: Math.min(first, second),
    x2: Math.max(first, second),
  };
}

export function vertexOf(a: number, b: number, c: number): Vertex {
  const x = -b / (2 * a);
  return { x, y: a * x * x + b * x + c };
}
