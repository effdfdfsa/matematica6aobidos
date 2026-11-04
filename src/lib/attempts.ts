import type { ExerciseType } from '@/lib/math/exercises';
import { supabase } from '@/lib/supabase';

export type AttemptResult = { type: ExerciseType; isCorrect: boolean };

export async function saveAttempts(results: AttemptResult[]): Promise<boolean> {
  const { error } = await supabase
    .from('exercise_attempts')
    .insert(results.map((result) => ({ exercise_type: result.type, is_correct: result.isCorrect })));
  return error === null;
}
