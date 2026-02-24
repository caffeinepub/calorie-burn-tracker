import { useState } from 'react';
import { Loader2, TrendingDown, Dumbbell, Scale, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { FitnessGoal, UserStats } from '../backend';

interface GoalOption {
  value: FitnessGoal;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  selectedColor: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    value: FitnessGoal.weightLoss,
    label: 'Weight Loss',
    description: 'Burn fat with a calorie deficit and lean protein focus',
    icon: <TrendingDown className="w-6 h-6" />,
    color: 'border-border hover:border-diet-primary/60 hover:bg-diet-primary/5',
    selectedColor: 'border-diet-primary bg-diet-primary/10 ring-2 ring-diet-primary/30',
  },
  {
    value: FitnessGoal.muscleGain,
    label: 'Muscle Gain',
    description: 'Build mass with high protein and calorie surplus',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'border-border hover:border-diet-accent/60 hover:bg-diet-accent/5',
    selectedColor: 'border-diet-accent bg-diet-accent/10 ring-2 ring-diet-accent/30',
  },
  {
    value: FitnessGoal.maintenance,
    label: 'Maintenance',
    description: 'Sustain your current weight with balanced macros',
    icon: <Scale className="w-6 h-6" />,
    color: 'border-border hover:border-diet-secondary/60 hover:bg-diet-secondary/5',
    selectedColor: 'border-diet-secondary bg-diet-secondary/10 ring-2 ring-diet-secondary/30',
  },
  {
    value: FitnessGoal.endurance,
    label: 'Endurance',
    description: 'Fuel performance with carb-rich, energy-dense meals',
    icon: <Zap className="w-6 h-6" />,
    color: 'border-border hover:border-primary/60 hover:bg-primary/5',
    selectedColor: 'border-primary bg-primary/10 ring-2 ring-primary/30',
  },
];

const GOAL_ICON_COLORS: Record<FitnessGoal, string> = {
  [FitnessGoal.weightLoss]: 'text-diet-primary',
  [FitnessGoal.muscleGain]: 'text-diet-accent',
  [FitnessGoal.maintenance]: 'text-diet-secondary',
  [FitnessGoal.endurance]: 'text-primary',
};

interface DietPlannerFormProps {
  onSubmit: (goal: FitnessGoal, stats: UserStats | null) => void;
  isLoading: boolean;
  submitLabel?: string;
  showStats?: boolean;
}

export function DietPlannerForm({
  onSubmit,
  isLoading,
  submitLabel = '✨ Generate My Diet Plan',
  showStats: showStatsDefault = false,
}: DietPlannerFormProps) {
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [showStats, setShowStats] = useState(showStatsDefault);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) {
      setError('Please select a fitness goal to continue.');
      return;
    }
    setError('');

    const stats: UserStats | null =
      age || weight || height || activityLevel
        ? {
            age: age ? BigInt(parseInt(age)) : undefined,
            weightKg: weight ? parseFloat(weight) : undefined,
            heightCm: height ? parseFloat(height) : undefined,
            activityLevel: activityLevel || undefined,
          }
        : null;

    onSubmit(selectedGoal, stats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Goal Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">What's your fitness goal?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select the goal that best describes what you want to achieve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOAL_OPTIONS.map((option) => {
            const isSelected = selectedGoal === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedGoal(option.value);
                  setError('');
                }}
                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected ? option.selectedColor : option.color
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-white/60 dark:bg-black/20' : 'bg-muted'
                  }`}
                >
                  <span className={isSelected ? GOAL_ICON_COLORS[option.value] : 'text-muted-foreground'}>
                    {option.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-diet-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      </div>

      {/* Optional Stats */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 text-sm font-medium text-diet-primary hover:text-diet-primary/80 transition-colors"
        >
          {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showStats ? 'Hide' : 'Add'} personal stats for a more accurate plan (optional)
        </button>

        {showStats && (
          <Card className="border-diet-primary/20 bg-diet-primary/5">
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="text-xs font-medium">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="10"
                    max="120"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-xs font-medium">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="20"
                    max="300"
                    step="0.1"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-xs font-medium">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="100"
                    max="250"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="activity" className="text-xs font-medium">Activity Level</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activity" className="h-9 text-sm">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly Active</SelectItem>
                      <SelectItem value="moderate">Moderately Active</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !selectedGoal}
        className="w-full h-12 text-base font-semibold bg-diet-primary hover:bg-diet-primary/90 text-white rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Your Plan...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
