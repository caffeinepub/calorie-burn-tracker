import { RefreshCw, ArrowLeft, Dumbbell, Flame, Calendar, Clock, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { WorkoutPlan, Exercise } from '../backend';
import { FitnessGoal, Difficulty } from '../backend';

interface WorkoutPlanResultsProps {
  plan: WorkoutPlan;
  onRegenerate: () => void;
  onReset: () => void;
  isRegenerating: boolean;
}

const GOAL_LABELS: Record<FitnessGoal, string> = {
  [FitnessGoal.weightLoss]: 'Weight Loss',
  [FitnessGoal.muscleGain]: 'Muscle Gain',
  [FitnessGoal.maintenance]: 'Maintenance',
  [FitnessGoal.endurance]: 'Endurance',
};

const GOAL_COLORS: Record<FitnessGoal, string> = {
  [FitnessGoal.weightLoss]: 'bg-diet-primary/10 text-diet-primary border-diet-primary/30',
  [FitnessGoal.muscleGain]: 'bg-workout-accent/10 text-workout-accent border-workout-accent/30',
  [FitnessGoal.maintenance]: 'bg-diet-secondary/10 text-diet-secondary border-diet-secondary/30',
  [FitnessGoal.endurance]: 'bg-workout-primary/10 text-workout-primary border-workout-primary/30',
};

const DIFFICULTY_BADGE: Record<Difficulty, { label: string; className: string }> = {
  [Difficulty.easy]: { label: 'Easy', className: 'bg-diet-primary/10 text-diet-primary border-diet-primary/30' },
  [Difficulty.medium]: { label: 'Medium', className: 'bg-diet-secondary/10 text-diet-secondary border-diet-secondary/30' },
  [Difficulty.hard]: { label: 'Hard', className: 'bg-destructive/10 text-destructive border-destructive/30' },
};

// All days of the week for schedule display
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const diff = DIFFICULTY_BADGE[exercise.difficulty];
  const hasSetsReps = exercise.sets !== undefined && exercise.reps !== undefined;
  const hasDuration = exercise.durationMinutes !== undefined;

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-workout-primary/10 flex items-center justify-center flex-shrink-0">
        <Dumbbell className="w-4 h-4 text-workout-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground">{exercise.name}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${diff.className}`}>
            {diff.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
          {hasSetsReps && exercise.sets !== undefined && exercise.reps !== undefined && (
            <>
              <span>
                Sets: <strong className="text-foreground">{Number(exercise.sets)}</strong>
              </span>
              <span>
                Reps: <strong className="text-foreground">{Number(exercise.reps)}</strong>
              </span>
            </>
          )}
          {hasDuration && exercise.durationMinutes !== undefined && (
            <span>
              Duration: <strong className="text-foreground">{Number(exercise.durationMinutes)} min</strong>
            </span>
          )}
          {exercise.caloriesPerSet !== undefined && (
            <span>
              ~<strong className="text-foreground">{Number(exercise.caloriesPerSet)}</strong> kcal/set
            </span>
          )}
          {exercise.caloriesPerMinute !== undefined && (
            <span>
              ~<strong className="text-foreground">{Number(exercise.caloriesPerMinute)}</strong> kcal/min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function WeeklyScheduleGrid({ restDays, daysPerWeek }: { restDays: string[]; daysPerWeek: bigint }) {
  const restSet = new Set(restDays.map((d) => d.toLowerCase()));

  return (
    <div className="grid grid-cols-7 gap-1">
      {ALL_DAYS.map((day) => {
        const isRest = restSet.has(day.toLowerCase());
        return (
          <div
            key={day}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${
              isRest
                ? 'bg-muted/40 text-muted-foreground'
                : 'bg-workout-primary/10 text-workout-primary'
            }`}
          >
            <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
            <span className="text-xs">{isRest ? '😴' : '💪'}</span>
            <span className="text-[10px] font-medium">{isRest ? 'Rest' : 'Train'}</span>
          </div>
        );
      })}
    </div>
  );
}

export function WorkoutPlanResults({ plan, onRegenerate, onReset, isRegenerating }: WorkoutPlanResultsProps) {
  const { goal, planType, weeklySchedule, exerciseList, estimatedCaloriesPerSession } = plan;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-foreground">Your Workout Plan</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${GOAL_COLORS[goal]}`}>
            {GOAL_LABELS[goal]}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            New Goal
          </Button>
          <Button
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="gap-1.5 text-xs bg-workout-primary hover:bg-workout-primary/90 text-white"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <Card className="border-workout-primary/30 bg-gradient-to-br from-workout-primary/10 to-workout-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-workout-primary/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-workout-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Est. Calories / Session</p>
                <p className="text-3xl font-bold text-workout-primary">
                  {Number(estimatedCaloriesPerSession).toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground ml-1">kcal</span>
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">{Number(weeklySchedule.daysPerWeek)}</p>
                <p className="text-xs text-muted-foreground">Days/Week</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-lg font-bold text-foreground">{Number(weeklySchedule.sessionLengthMinutes)}</p>
                <p className="text-xs text-muted-foreground">Min/Session</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-lg font-bold text-foreground">{exerciseList.length}</p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Type */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-workout-accent/10 flex items-center justify-center">
          <RotateCcw className="w-4 h-4 text-workout-accent" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Plan Type</p>
          <p className="text-sm font-semibold text-foreground">{planType}</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-workout-primary" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <WeeklyScheduleGrid
            restDays={weeklySchedule.restDays}
            daysPerWeek={weeklySchedule.daysPerWeek}
          />
          {weeklySchedule.restDays.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Rest days: <span className="font-medium text-foreground">{weeklySchedule.restDays.join(', ')}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-workout-primary" />
            Exercise List
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {exerciseList.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card className="border-workout-accent/20 bg-workout-accent/5">
        <CardContent className="pt-4 pb-4 px-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-workout-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-workout-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Session Duration</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Each session is approximately{' '}
                <strong className="text-foreground">{Number(weeklySchedule.sessionLengthMinutes)} minutes</strong>.
                Aim for{' '}
                <strong className="text-foreground">{Number(weeklySchedule.daysPerWeek)} sessions per week</strong>{' '}
                for best results. Rest days are essential for muscle recovery and performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
