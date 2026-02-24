import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    caloriesPerSet?: bigint;
    caloriesPerMinute?: bigint;
    difficulty: Difficulty;
    name: string;
    reps?: bigint;
    sets?: bigint;
    durationMinutes?: bigint;
}
export interface CalorieBurnActivity {
    activityName: string;
    difficulty: Difficulty;
    durationMinutes: bigint;
    timestamp: Time;
    caloriesBurned: bigint;
}
export type Time = bigint;
export interface MacroSplit {
    calories: number;
    fatsGrams: number;
    carbsGrams: number;
    proteinGrams: number;
}
export interface WorkoutPlan {
    weeklySchedule: WeeklySchedule;
    goal: FitnessGoal;
    exerciseList: Array<Exercise>;
    estimatedCaloriesPerSession: bigint;
    planType: string;
}
export interface DietPlan {
    recommendedMacros: MacroSplit;
    goal: FitnessGoal;
    guidelines: string;
    mealSuggestions: Array<MealSuggestion>;
}
export interface MealSuggestion {
    carbs: number;
    fats: number;
    calories: number;
    name: string;
    description: string;
    protein: number;
}
export interface WeeklySchedule {
    sessionLengthMinutes: bigint;
    totalSessions: bigint;
    restDays: Array<string>;
    daysPerWeek: bigint;
}
export interface UserProfile {
    name: string;
}
export interface UserStats {
    age?: bigint;
    activityLevel?: string;
    heightCm?: number;
    weightKg?: number;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum FitnessGoal {
    weightLoss = "weightLoss",
    muscleGain = "muscleGain",
    maintenance = "maintenance",
    endurance = "endurance"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivity(activityName: string, caloriesBurned: bigint, durationMinutes: bigint, difficulty: Difficulty): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generatePersonalizedDietPlan(goal: FitnessGoal, stats: UserStats | null): Promise<DietPlan>;
    generateWorkoutPlan(goal: FitnessGoal): Promise<WorkoutPlan>;
    getAllActivities(): Promise<Array<CalorieBurnActivity>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyCalorieGoal(): Promise<bigint>;
    getUserActivities(user: Principal): Promise<Array<CalorieBurnActivity>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDailyCalorieGoal(goal: bigint): Promise<void>;
}
