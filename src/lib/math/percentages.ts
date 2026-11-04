export type PercentageMode = {
  id: string;
  label: string;
  fields: [string, string];
  resultSuffix: string;
  compute: (first: number, second: number) => number;
};

export const PERCENTAGE_MODES: PercentageMode[] = [
  {
    id: 'of',
    label: 'Quanto é P% de V',
    fields: ['Percentagem (%)', 'Valor (V)'],
    resultSuffix: '',
    compute: (percent, value) => (percent / 100) * value,
  },
  {
    id: 'whatPercent',
    label: 'Que percentagem é A de B',
    fields: ['Parte (A)', 'Total (B)'],
    resultSuffix: '%',
    compute: (part, total) => (part / total) * 100,
  },
  {
    id: 'increase',
    label: 'Aumento de P%',
    fields: ['Valor inicial', 'Aumento (%)'],
    resultSuffix: '',
    compute: (value, percent) => value * (1 + percent / 100),
  },
  {
    id: 'discount',
    label: 'Desconto de P%',
    fields: ['Preço inicial', 'Desconto (%)'],
    resultSuffix: '',
    compute: (value, percent) => value * (1 - percent / 100),
  },
  {
    id: 'change',
    label: 'Variação de A para B',
    fields: ['Valor inicial (A)', 'Valor final (B)'],
    resultSuffix: '%',
    compute: (from, to) => ((to - from) / from) * 100,
  },
];
