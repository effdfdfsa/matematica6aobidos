import { EXERCISE_TYPES, type ExerciseType } from '@/lib/math/exercises';

export type TopicFilter = ExerciseType | 'todos';

type TopicPickerProps = {
  value: TopicFilter;
  onChange: (value: TopicFilter) => void;
};

const OPTIONS: { id: TopicFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  ...EXERCISE_TYPES,
];

export function TopicPicker({ value, onChange }: TopicPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Tema">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            value === option.id
              ? 'border-teal-700 bg-teal-700 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
