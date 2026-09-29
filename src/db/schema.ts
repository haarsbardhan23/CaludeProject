import { defineRelations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

export const exercises = pgTable(
  'exercises',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique('exercises_name_unique').on(t.name)],
);

export const workouts = pgTable(
  'workouts',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    name: text('name'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('workouts_user_id_started_at_idx').on(t.userId, t.startedAt)],
);

export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('workout_exercises_workout_id_order_unique').on(t.workoutId, t.order),
    index('workout_exercises_exercise_id_idx').on(t.exerciseId),
  ],
);

export const sets = pgTable(
  'sets',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workoutExerciseId: integer('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    reps: integer('reps').notNull(),
    // null = bodyweight
    weightKg: numeric('weight_kg', { precision: 6, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('sets_workout_exercise_id_set_number_unique').on(t.workoutExerciseId, t.setNumber),
    check('sets_reps_non_negative', sql`${t.reps} >= 0`),
    check('sets_weight_kg_non_negative', sql`${t.weightKg} >= 0`),
  ],
);

export const relations = defineRelations(
  { exercises, workouts, workoutExercises, sets },
  (r) => ({
    exercises: {
      workoutExercises: r.many.workoutExercises(),
    },
    workouts: {
      workoutExercises: r.many.workoutExercises(),
    },
    workoutExercises: {
      workout: r.one.workouts({
        from: r.workoutExercises.workoutId,
        to: r.workouts.id,
        optional: false,
      }),
      exercise: r.one.exercises({
        from: r.workoutExercises.exerciseId,
        to: r.exercises.id,
        optional: false,
      }),
      sets: r.many.sets(),
    },
    sets: {
      workoutExercise: r.one.workoutExercises({
        from: r.sets.workoutExerciseId,
        to: r.workoutExercises.id,
        optional: false,
      }),
    },
  }),
);

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;
export type WorkoutSet = typeof sets.$inferSelect;
export type NewWorkoutSet = typeof sets.$inferInsert;
