import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CalorieBurnActivity, DietPlan, FitnessGoal, UserStats, WorkoutPlan } from '../backend';
import { Difficulty } from '../backend';

const ACTIVITIES_QUERY_KEY = ['activities'];
const DAILY_GOAL_QUERY_KEY = ['dailyGoal'];

export function useActivities() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<CalorieBurnActivity[]>({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllActivities();
      } catch (error) {
        console.log('No activities found or error fetching:', error);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching && isAuthenticated,
  });
}

export function useAddActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityName,
      caloriesBurned,
      durationMinutes,
      difficulty,
    }: {
      activityName: string;
      caloriesBurned: bigint;
      durationMinutes: bigint;
      difficulty: Difficulty;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addActivity(activityName, caloriesBurned, durationMinutes, difficulty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}

export function useGetDailyCalorieGoal() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<bigint | null>({
    queryKey: DAILY_GOAL_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getDailyCalorieGoal();
      } catch (error) {
        console.log('No daily goal found or error fetching:', error);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && isAuthenticated,
  });
}

export function useSetDailyCalorieGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setDailyCalorieGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAILY_GOAL_QUERY_KEY });
    },
  });
}

export function useGenerateDietPlan() {
  const { actor } = useActor();

  return useMutation<DietPlan, Error, { goal: FitnessGoal; stats: UserStats | null }>({
    mutationFn: async ({ goal, stats }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generatePersonalizedDietPlan(goal, stats);
    },
  });
}

export function useGenerateWorkoutPlan() {
  const { actor } = useActor();

  return useMutation<WorkoutPlan, Error, { goal: FitnessGoal }>({
    mutationFn: async ({ goal }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateWorkoutPlan(goal);
    },
  });
}
