"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, DumbbellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type WorkoutSummary = {
  id: number;
  name: string | null;
  startedAt: Date;
  completedAt: Date | null;
  exercises: { name: string; sets: number }[];
};

// Placeholder data for UI development only — replace with real data fetching.
const PLACEHOLDER_WORKOUTS: WorkoutSummary[] = [
  {
    id: 1,
    name: "Push Day",
    startedAt: new Date(new Date().setHours(7, 30, 0, 0)),
    completedAt: new Date(new Date().setHours(8, 25, 0, 0)),
    exercises: [
      { name: "Bench Press", sets: 4 },
      { name: "Overhead Press", sets: 3 },
      { name: "Tricep Dips", sets: 3 },
    ],
  },
  {
    id: 2,
    name: null,
    startedAt: new Date(new Date().setHours(18, 0, 0, 0)),
    completedAt: null,
    exercises: [{ name: "Pull-ups", sets: 3 }],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workouts = PLACEHOLDER_WORKOUTS;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Workouts logged on {format(date, "do MMM yyyy")}
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" className="justify-start sm:w-60" />
            }
          >
            <CalendarIcon />
            {format(date, "do MMM yyyy")}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selected) => {
                if (selected) {
                  setDate(selected);
                  setOpen(false);
                }
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {workouts.length === 0 ? (
        <Card>
          <CardHeader className="items-center text-center">
            <CardTitle>No workouts logged</CardTitle>
            <CardDescription>
              There are no workouts logged for {format(date, "do MMM yyyy")}.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DumbbellIcon className="size-4" />
                  {workout.name ?? "Untitled workout"}
                </CardTitle>
                <CardDescription>
                  {format(workout.startedAt, "h:mm a")}
                  {workout.completedAt &&
                    ` – ${format(workout.completedAt, "h:mm a")}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  {workout.completedAt ? (
                    <Badge variant="secondary">Completed</Badge>
                  ) : (
                    <Badge variant="outline">In progress</Badge>
                  )}
                </div>
                <ul className="flex flex-col gap-1 text-sm">
                  {workout.exercises.map((exercise) => (
                    <li
                      key={exercise.name}
                      className="flex items-center justify-between"
                    >
                      <span>{exercise.name}</span>
                      <span className="text-muted-foreground">
                        {exercise.sets} {exercise.sets === 1 ? "set" : "sets"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
