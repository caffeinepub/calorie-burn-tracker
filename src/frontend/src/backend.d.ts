import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface CalorieBurnActivity {
    activityName: string;
    durationMinutes: bigint;
    timestamp: Time;
    caloriesBurned: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivity(activityName: string, caloriesBurned: bigint, durationMinutes: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
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
