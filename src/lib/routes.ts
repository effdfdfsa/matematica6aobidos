import { Divide, GraduationCap, Home, Layers, Percent, Sigma, type LucideIcon } from 'lucide-react';

export type RouteId = 'inicio' | 'fatoracao' | 'mdc-mmc' | 'equacoes' | 'percentagens' | 'exercicios';

export const ROUTES: { id: RouteId; label: string; icon: LucideIcon }[] = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'fatoracao', label: 'Fatores primos', icon: Layers },
  { id: 'mdc-mmc', label: 'MDC e MMC', icon: Divide },
  { id: 'equacoes', label: 'Equações', icon: Sigma },
  { id: 'percentagens', label: 'Percentagens', icon: Percent },
  { id: 'exercicios', label: 'Exercícios', icon: GraduationCap },
];
