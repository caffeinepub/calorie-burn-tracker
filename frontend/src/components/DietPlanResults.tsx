import { RefreshCw, ArrowLeft, Utensils, Target, BookOpen, Coffee, Sun, Moon, Apple } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { DietPlan, MealSuggestion } from '../backend';
import { FitnessGoal } from '../backend';

interface DietPlanResultsProps {
  plan: DietPlan;
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
  [FitnessGoal.muscleGain]: 'bg-diet-accent/10 text-diet-accent border-diet-accent/30',
  [FitnessGoal.maintenance]: 'bg-diet-secondary/10 text-diet-secondary border-diet-secondary/30',
  [FitnessGoal.endurance]: 'bg-primary/10 text-primary border-primary/30',
};

const MEAL_ICONS = [
  <Coffee className="w-4 h-4" />,
  <Sun className="w-4 h-4" />,
  <Moon className="w-4 h-4" />,
  <Apple className="w-4 h-4" />,
];

const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

function MacroBar({ label, grams, percentage, color }: { label: string; grams: number; percentage: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{Math.round(grams)}g <span className="text-xs">({Math.round(percentage)}%)</span></span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function MealCard({ meal, index }: { meal: MealSuggestion; index: number }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-diet-primary/10 flex items-center justify-center flex-shrink-0 text-diet-primary">
        {MEAL_ICONS[index] ?? <Utensils className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground">{MEAL_TIMES[index] ?? meal.name}</p>
          <span className="text-xs font-medium text-diet-primary bg-diet-primary/10 px-2 py-0.5 rounded-full">
            {Math.round(meal.calories)} kcal
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{meal.description}</p>
        <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>P: <strong className="text-foreground">{Math.round(meal.protein)}g</strong></span>
          <span>C: <strong className="text-foreground">{Math.round(meal.carbs)}g</strong></span>
          <span>F: <strong className="text-foreground">{Math.round(meal.fats)}g</strong></span>
        </div>
      </div>
    </div>
  );
}

export function DietPlanResults({ plan, onRegenerate, onReset, isRegenerating }: DietPlanResultsProps) {
  const { recommendedMacros, mealSuggestions, guidelines, goal } = plan;

  const totalMacroCalories =
    recommendedMacros.proteinGrams * 4 +
    recommendedMacros.carbsGrams * 4 +
    recommendedMacros.fatsGrams * 9;

  const proteinPct = totalMacroCalories > 0 ? (recommendedMacros.proteinGrams * 4 / totalMacroCalories) * 100 : 33;
  const carbsPct = totalMacroCalories > 0 ? (recommendedMacros.carbsGrams * 4 / totalMacroCalories) * 100 : 33;
  const fatsPct = totalMacroCalories > 0 ? (recommendedMacros.fatsGrams * 9 / totalMacroCalories) * 100 : 34;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-foreground">Your Personalized Plan</h3>
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
            className="gap-1.5 text-xs bg-diet-primary hover:bg-diet-primary/90 text-white"
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

      {/* Calorie Target */}
      <Card className="border-diet-primary/30 bg-gradient-to-br from-diet-primary/10 to-diet-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-diet-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-diet-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Daily Calorie Target</p>
                <p className="text-3xl font-bold text-diet-primary">
                  {Math.round(recommendedMacros.calories).toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground ml-1">kcal</span>
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">{Math.round(recommendedMacros.proteinGrams)}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-lg font-bold text-foreground">{Math.round(recommendedMacros.carbsGrams)}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-lg font-bold text-foreground">{Math.round(recommendedMacros.fatsGrams)}g</p>
                <p className="text-xs text-muted-foreground">Fats</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Breakdown */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-diet-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-diet-primary">%</span>
            </div>
            Macro Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <MacroBar label="Protein" grams={recommendedMacros.proteinGrams} percentage={proteinPct} color="bg-diet-accent" />
          <MacroBar label="Carbohydrates" grams={recommendedMacros.carbsGrams} percentage={carbsPct} color="bg-diet-primary" />
          <MacroBar label="Fats" grams={recommendedMacros.fatsGrams} percentage={fatsPct} color="bg-diet-secondary" />
        </CardContent>
      </Card>

      {/* Meal Schedule */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-diet-primary/10 flex items-center justify-center">
              <Utensils className="w-3.5 h-3.5 text-diet-primary" />
            </div>
            Sample Daily Meal Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-2.5">
          {mealSuggestions.map((meal, i) => (
            <MealCard key={i} meal={meal} index={i} />
          ))}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="border-diet-secondary/30 bg-diet-secondary/5">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-diet-secondary/20 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-diet-secondary" />
            </div>
            Dietary Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <p className="text-sm text-foreground leading-relaxed">{guidelines}</p>
        </CardContent>
      </Card>
    </div>
  );
}
