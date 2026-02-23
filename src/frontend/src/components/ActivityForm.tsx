import { useState } from 'react';
import { useAddActivity } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityFormProps {
  onSuccess: () => void;
}

export function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [activityName, setActivityName] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');

  const addActivityMutation = useAddActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!activityName.trim()) {
      toast.error('Please enter an activity name');
      return;
    }

    const caloriesNum = Number(calories);
    const durationNum = Number(duration);

    if (!calories || caloriesNum <= 0) {
      toast.error('Please enter a valid number of calories');
      return;
    }

    if (!duration || durationNum <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    try {
      await addActivityMutation.mutateAsync({
        activityName: activityName.trim(),
        caloriesBurned: BigInt(caloriesNum),
        durationMinutes: BigInt(durationNum),
      });

      // Reset form
      setActivityName('');
      setCalories('');
      setDuration('');

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
            <Label htmlFor="calories">Calories Burned</Label>
            <Input
              id="calories"
              type="number"
              placeholder="e.g., 250"
              min="1"
              step="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
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
