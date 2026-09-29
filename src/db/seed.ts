import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import { db } from './index';
import { exercises, sets, workoutExercises, workouts } from './schema';

const USER_ID = 'user_3K03eGck8W4eJMFzhdTp40ZxZEa';

const exerciseNames = [
  'Bench Press',
  'Overhead Press',
  'Tricep Pushdown',
  'Deadlift',
  'Barbell Row',
  'Pull-up',
  'Back Squat',
  'Romanian Deadlift',
  'Leg Press',
];

// Each exercise lists its sets as [reps, weightKg].
const seedWorkouts: {
  name: string;
  startedAt: string;
  completedAt: string | null;
  exercises: { name: string; sets: [number, number][] }[];
}[] = [
  {
    name: 'Push Day',
    startedAt: '2026-09-22T07:00:00Z',
    completedAt: '2026-09-22T08:05:00Z',
    exercises: [
      { name: 'Bench Press', sets: [[8, 60], [8, 62.5], [6, 65]] },
      { name: 'Overhead Press', sets: [[8, 40], [8, 40], [7, 42.5]] },
      { name: 'Tricep Pushdown', sets: [[12, 25], [12, 25], [10, 27.5]] },
    ],
  },
  {
    name: 'Pull Day',
    startedAt: '2026-09-24T18:30:00Z',
    completedAt: '2026-09-24T19:35:00Z',
    exercises: [
      { name: 'Deadlift', sets: [[5, 100], [5, 110], [3, 120]] },
      { name: 'Barbell Row', sets: [[10, 50], [10, 55], [8, 55]] },
      { name: 'Pull-up', sets: [[10, 5], [8, 7.5], [6, 10]] },
    ],
  },
  {
    name: 'Leg Day',
    startedAt: '2026-09-26T07:15:00Z',
    completedAt: '2026-09-26T08:20:00Z',
    exercises: [
      { name: 'Back Squat', sets: [[5, 80], [5, 85], [5, 90]] },
      { name: 'Romanian Deadlift', sets: [[10, 70], [10, 70], [8, 75]] },
      { name: 'Leg Press', sets: [[12, 140], [12, 150], [10, 160]] },
    ],
  },
  {
    name: 'Push Day',
    startedAt: '2026-09-29T07:00:00Z',
    completedAt: null,
    exercises: [
      { name: 'Bench Press', sets: [[8, 62.5], [8, 65], [6, 67.5]] },
      { name: 'Overhead Press', sets: [[8, 42.5]] },
    ],
  },
];

async function main() {
  await db
    .insert(exercises)
    .values(exerciseNames.map((name) => ({ name })))
    .onConflictDoNothing({ target: exercises.name });

  const exerciseRows = await db
    .select({ id: exercises.id, name: exercises.name })
    .from(exercises)
    .where(inArray(exercises.name, exerciseNames));
  const exerciseIds = new Map(exerciseRows.map((e) => [e.name, e.id]));

  for (const w of seedWorkouts) {
    const [workout] = await db
      .insert(workouts)
      .values({
        userId: USER_ID,
        name: w.name,
        startedAt: new Date(w.startedAt),
        completedAt: w.completedAt ? new Date(w.completedAt) : null,
      })
      .returning({ id: workouts.id });

    for (const [i, e] of w.exercises.entries()) {
      const [workoutExercise] = await db
        .insert(workoutExercises)
        .values({
          workoutId: workout.id,
          exerciseId: exerciseIds.get(e.name)!,
          order: i + 1,
        })
        .returning({ id: workoutExercises.id });

      await db.insert(sets).values(
        e.sets.map(([reps, weightKg], j) => ({
          workoutExerciseId: workoutExercise.id,
          setNumber: j + 1,
          reps,
          weightKg: String(weightKg),
        })),
      );
    }
  }

  console.log('Seed complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
