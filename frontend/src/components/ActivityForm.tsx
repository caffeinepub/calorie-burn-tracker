import { useState, useEffect } from 'react';
import { useAddActivity } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Loader2, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Difficulty } from '../backend';

interface ActivityFormProps {
  onSuccess: () => void;
}

// Calorie burn rates per minute for each difficulty level
const CALORIE_RATES = {
  easy: 5,
  medium: 8,
  hard: 12,
};

export function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [calculatedCalories, setCalculatedCalories] = useState<number>(0);

  const addActivityMutation = useAddActivity();

  // Auto-calculate calories when duration or difficulty changes
  useEffect(() => {
    const durationNum = Number(duration);
    if (duration && durationNum > 0) {
      const calories = Math.round(durationNum * CALORIE_RATES[difficulty]);
      setCalculatedCalories(calories);
    } else {
      setCalculatedCalories(0);
    }
  }, [duration, difficulty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!activityName.trim()) {
      toast.error('Please enter an activity name');
      return;
    }

    const durationNum = Number(duration);

    if (!duration || durationNum <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    if (!difficulty) {
      toast.error('Please select a difficulty level');
      return;
    }

    try {
      await addActivityMutation.mutateAsync({
        activityName: activityName.trim(),
        caloriesBurned: BigInt(calculatedCalories),
        durationMinutes: BigInt(durationNum),
        difficulty: Difficulty[difficulty],
      });

      // Reset form
      setActivityName('');
      setDuration('');
      setDifficulty('medium');
      setCalculatedCalories(0);

      toast.success('Activity logged successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to log activity. Please try again.');
      console.error('Error adding activity:', error);
    }
  };

  return (
    <Card className="border-2 hover:border-primary/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Activity
        </CardTitle>
        <CardDescription>
          Enter the details of your workout or activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activityName">Activity Name</Label>
            <Input
              id="activityName"
              type="text"
              placeholder="e.g., Running, Swimming, Cycling"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              disabled={addActivityMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 30"
              min="1"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={addActivityMutation.isPending}
            />
          </div>

          <div className="space-y-3">
            <Label>Difficulty Level</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
              disabled={addActivityMutation.isPending}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="easy" id="easy" />
                <Label
                  htmlFor="easy"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Easy</span>
                    <span className="text-sm text-muted-foreground">
                      {CALORIE_RATES.easy} cal/min
                    </span>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="medium" id="medium" />
                <Label
                  htmlFor="medium"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Moderate</span>
                    <span className="text-sm text-muted-foreground">
                      {CALORIE_RATES.medium} cal/min
                    </span>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="hard" id="hard" />
                <Label
                  htmlFor="hard"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hard</span>
                    <span className="text-sm text-muted-foreground">
                      {CALORIE_RATES.hard} cal/min
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {calculatedCalories > 0 && (
            <div className="rounded-lg bg-accent/50 border border-accent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-medium">Estimated Calories</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {calculatedCalories} kcal
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={addActivityMutation.isPending}
          >
            {addActivityMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
