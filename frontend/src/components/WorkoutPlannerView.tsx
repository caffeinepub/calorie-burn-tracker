import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGenerateWorkoutPlan } from '../hooks/useQueries';
import { DietPlannerForm } from './DietPlannerForm';
import { WorkoutPlanResults } from './WorkoutPlanResults';
import { Button } from './ui/button';
import type { WorkoutPlan, FitnessGoal } from '../backend';

export function WorkoutPlannerView() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { mutate: generatePlan, isPending } = useGenerateWorkoutPlan();

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [lastGoal, setLastGoal] = useState<FitnessGoal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = (goal: FitnessGoal) => {
    setLastGoal(goal);
    setError(null);
    generatePlan(
      { goal },
      {
        onSuccess: (plan) => setWorkoutPlan(plan),
        onError: (err) => setError(err.message || 'Failed to generate workout plan. Please try again.'),
      }
    );
  };

  const handleRegenerate = () => {
    if (lastGoal) {
      handleGenerate(lastGoal);
    }
  };

  const handleReset = () => {
    setWorkoutPlan(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md">
        <img
          src="/assets/generated/diet-planner-banner.dim_1200x300.png"
          alt="AI Workout Planner"
          className="w-full object-cover h-40 md:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center px-6 md:px-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow">AI Workout Planner</h2>
            <p className="text-white/80 text-sm md:text-base mt-1 max-w-sm">
              Get a personalized workout plan tailored to your fitness goal
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-workout-primary/10 flex items-center justify-center">
            <span className="text-3xl">🏋️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Sign in to Generate Your Plan</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
              Log in to get a personalized AI-powered workout plan based on your fitness goals.
            </p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-workout-primary hover:bg-workout-primary/90 text-white px-8"
          >
            {isLoggingIn ? 'Connecting...' : 'Sign In to Get Started'}
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}
          {workoutPlan ? (
            <WorkoutPlanResults
              plan={workoutPlan}
              onRegenerate={handleRegenerate}
              onReset={handleReset}
              isRegenerating={isPending}
            />
          ) : (
            <DietPlannerForm
              onSubmit={(goal) => handleGenerate(goal)}
              isLoading={isPending}
              submitLabel="🏋️ Generate My Workout Plan"
            />
          )}
        </div>
      )}
    </div>
  );
}
