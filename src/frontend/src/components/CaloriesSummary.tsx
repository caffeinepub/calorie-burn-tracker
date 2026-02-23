import { Flame, TrendingUp, Activity, Target } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import type { CalorieBurnActivity } from '../backend';
import { Skeleton } from './ui/skeleton';
import { useGetDailyCalorieGoal } from '../hooks/useQueries';

interface CaloriesSummaryProps {
  activities: CalorieBurnActivity[];
  isLoading: boolean;
}

export function CaloriesSummary({ activities, isLoading }: CaloriesSummaryProps) {
  const { data: dailyGoal, isLoading: isLoadingGoal } = useGetDailyCalorieGoal();

  const totalCalories = activities.reduce(
    (sum, activity) => sum + Number(activity.caloriesBurned),
    0
  );

  const totalDuration = activities.reduce(
    (sum, activity) => sum + Number(activity.durationMinutes),
    0
  );

  const activityCount = activities.length;

  const goalNumber = dailyGoal !== null ? Number(dailyGoal) : 0;
  const progressPercentage = goalNumber > 0 ? Math.min((totalCalories / goalNumber) * 100, 100) : 0;

  if (isLoading || isLoadingGoal) {
    return (
      <Card className="border-2 bg-gradient-to-br from-card to-accent/5">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-accent/5 shadow-lg">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Calories */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Total Calories Burned</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalCalories.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>

            {/* Total Duration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Total Duration</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {totalDuration.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">minutes</p>
            </div>

            {/* Activity Count */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Activities Logged</span>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {activityCount}
              </p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>

          {/* Daily Goal Progress */}
          {dailyGoal !== null && goalNumber > 0 && (
            <div className="pt-6 border-t border-border/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Daily Goal Progress
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {totalCalories.toLocaleString()} / {goalNumber.toLocaleString()} kcal
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progressPercentage.toFixed(1)}% complete</span>
                  {totalCalories >= goalNumber ? (
                    <span className="text-accent font-semibold">🎉 Goal reached!</span>
                  ) : (
                    <span>{(goalNumber - totalCalories).toLocaleString()} kcal remaining</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Goal Set Message */}
          {(dailyGoal === null || goalNumber === 0) && (
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Target className="w-4 h-4" />
                <span>Set a daily goal to track your progress</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
