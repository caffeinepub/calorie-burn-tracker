# Specification

## Summary
**Goal:** Add workout plan generation to CalorieBurn AI based on the user's selected fitness goal, alongside the existing diet plan feature.

**Planned changes:**
- Add a backend function that accepts a fitness goal and returns a structured workout plan including workout type, weekly schedule, exercise list with sets/reps or duration, and estimated calorie burn per session
- Add a `useGenerateWorkoutPlan` React Query mutation hook in `frontend/src/hooks/useQueries.ts` following the existing diet plan hook pattern
- Create a `WorkoutPlanResults` component displaying the weekly schedule as a day-by-day breakdown with exercise details, workout type, and calorie burn, styled consistently with `DietPlanResults`
- Add a Workout Plan tab or section to the main navigation and integrate workout plan generation using the same fitness goal input as the diet planner

**User-visible outcome:** Users can navigate to a Workout Plan section, submit their fitness goal, and receive a structured weekly workout plan displayed alongside their diet plan results.
