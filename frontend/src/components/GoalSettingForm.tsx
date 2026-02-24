import { useState } from 'react';
import { useSetDailyCalorieGoal, useGetDailyCalorieGoal } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';

export function GoalSettingForm() {
  const { data: currentGoal, isLoading: isLoadingGoal } = useGetDailyCalorieGoal();
  const [goalValue, setGoalValue] = useState('');
  const setGoalMutation = useSetDailyCalorieGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const goalNum = Number(goalValue);

    if (!goalValue || goalNum <= 0) {
      toast.error('Please enter a valid goal (positive number)');
      return;
    }

    try {
      await setGoalMutation.mutateAsync(BigInt(goalNum));
      setGoalValue('');
      toast.success('Daily calorie goal updated successfully!');
    } catch (error) {
      toast.error('Failed to update goal. Please try again.');
      console.error('Error setting goal:', error);
    }
  };

  return (
    <Card className="border-2 hover:border-accent/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Set Daily Goal
        </CardTitle>
        <CardDescription>
          {isLoadingGoal ? (
            'Loading current goal...'
          ) : currentGoal !== null ? (
            `Current goal: ${Number(currentGoal).toLocaleString()} kcal`
          ) : (
            'Set your daily calorie burn target'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goalValue">Daily Calorie Goal (kcal)</Label>
            <Input
              id="goalValue"
              type="number"
              placeholder="e.g., 500"
              min="1"
              step="1"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
              disabled={setGoalMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={setGoalMutation.isPending}
          >
            {setGoalMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Set Goal
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
