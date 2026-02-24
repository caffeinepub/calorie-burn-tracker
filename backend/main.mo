import Time "mo:core/Time";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import List "mo:core/List";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import MixinStorage "blob-storage/Mixin";

actor {
  // Storage Mixin for blob/file management
  include MixinStorage();

  // Access Control Mixin for user management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  public type CalorieBurnActivity = {
    activityName : Text;
    caloriesBurned : Nat;
    durationMinutes : Nat;
    difficulty : Difficulty;
    timestamp : Time.Time;
  };

  module CalorieBurnActivity {
    public func compare(a : CalorieBurnActivity, b : CalorieBurnActivity) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userActivities = Map.empty<Principal, List.List<CalorieBurnActivity>>();
  let dailyCalorieGoals = Map.empty<Principal, Nat>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addActivity(activityName : Text, caloriesBurned : Nat, durationMinutes : Nat, difficulty : Difficulty) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add activities");
    };

    let activity : CalorieBurnActivity = {
      activityName;
      caloriesBurned;
      durationMinutes;
      difficulty;
      timestamp = Time.now();
    };

    let existingActivities = userActivities.get(caller);
    switch (existingActivities) {
      case (null) {
        let newList = List.singleton<CalorieBurnActivity>(activity);
        userActivities.add(caller, newList);
      };
      case (?activities) {
        activities.add(activity);
      };
    };
  };

  public query ({ caller }) func getAllActivities() : async [CalorieBurnActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view activities");
    };

    switch (userActivities.get(caller)) {
      case (null) { Runtime.trap("No activities found for this user") };
      case (?activities) {
        activities.toArray().sort();
      };
    };
  };

  public query ({ caller }) func getUserActivities(user : Principal) : async [CalorieBurnActivity] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own activities");
    };

    switch (userActivities.get(user)) {
      case (null) { Runtime.trap("No activities found for this user") };
      case (?activities) {
        activities.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func setDailyCalorieGoal(goal : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set daily calorie goals");
    };
    dailyCalorieGoals.add(caller, goal);
  };

  public query ({ caller }) func getDailyCalorieGoal() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve daily calorie goals");
    };

    switch (dailyCalorieGoals.get(caller)) {
      case (null) { Runtime.trap("No daily goal found for this user") };
      case (?goal) { goal };
    };
  };

  // Diet Plan Types
  public type UserStats = {
    age : ?Nat;
    weightKg : ?Float;
    heightCm : ?Float;
    activityLevel : ?Text;
  };

  public type FitnessGoal = {
    #weightLoss;
    #muscleGain;
    #maintenance;
    #endurance;
  };

  public type MacroSplit = {
    calories : Float;
    proteinGrams : Float;
    carbsGrams : Float;
    fatsGrams : Float;
  };

  public type MealSuggestion = {
    name : Text;
    description : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fats : Float;
  };

  public type DietPlan = {
    goal : FitnessGoal;
    recommendedMacros : MacroSplit;
    mealSuggestions : [MealSuggestion];
    guidelines : Text;
  };

  public query ({ caller }) func generatePersonalizedDietPlan(goal : FitnessGoal, stats : ?UserStats) : async DietPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate a personalized diet plan");
    };

    // Calculate macros based on goal and user stats
    let baseMacros = calculateBaseMacros(goal, stats);

    // Create meal suggestions
    let meals = createMealSuggestions(goal, baseMacros);

    // Create guidelines
    let guidelines = createGuidelines(goal);

    {
      goal;
      recommendedMacros = baseMacros;
      mealSuggestions = meals;
      guidelines;
    };
  };

  func calculateBaseMacros(goal : FitnessGoal, stats : ?UserStats) : MacroSplit {
    let defaultWeight = 70.0;
    let baseCalories = 2000.0;

    let weight = switch (stats) {
      case (null) { defaultWeight };
      case (?s) { switch (s.weightKg) { case (null) { defaultWeight }; case (?w) { w } } };
    };

    let caloriesModifier : Float = switch (goal) {
      case (#weightLoss) { -250.0 / 0.45 };
      case (#muscleGain) { 300.0 / 0.45 };
      case (#maintenance) { 0.0 };
      case (#endurance) { 100.0 };
    };

    let proteinRatio : Float = if (goal == #muscleGain or goal == #endurance) { 1.6 } else { 1.2 };
    let carbsRatio : Float = if (goal == #endurance) { 3.5 } else { 2.5 };
    let fatsRatio : Float = if (goal == #weightLoss) { 0.8 } else { 1.0 };

    // Calculate values using macros
    let calories = baseCalories + caloriesModifier;
    let proteinGrams = weight * proteinRatio;
    let carbsGrams = weight * carbsRatio;
    let fatsGrams = weight * fatsRatio;

    {
      calories;
      proteinGrams;
      carbsGrams;
      fatsGrams;
    };
  };

  func createMealSuggestions(_goal : FitnessGoal, macros : MacroSplit) : [MealSuggestion] {
    let breakfast : MealSuggestion = {
      name = "Balanced Breakfast";
      description = "Oatmeal with berries, eggs, and black coffee";
      calories = macros.calories * 0.25;
      protein = macros.proteinGrams * 0.2;
      carbs = macros.carbsGrams * 0.3;
      fats = macros.fatsGrams * 0.2;
    };

    let lunch : MealSuggestion = {
      name = "Power Lunch";
      description = "Grilled chicken salad with quinoa and avocado";
      calories = macros.calories * 0.3;
      protein = macros.proteinGrams * 0.35;
      carbs = macros.carbsGrams * 0.3;
      fats = macros.fatsGrams * 0.3;
    };

    let dinner : MealSuggestion = {
      name = "Satisfying Dinner";
      description = "Salmon fillet, steamed veggies, brown rice";
      calories = macros.calories * 0.3;
      protein = macros.proteinGrams * 0.35;
      carbs = macros.carbsGrams * 0.3;
      fats = macros.fatsGrams * 0.3;
    };

    let snacks : MealSuggestion = {
      name = "Healthy Snacks";
      description = "Greek yogurt, nuts, protein bar";
      calories = macros.calories * 0.15;
      protein = macros.proteinGrams * 0.1;
      carbs = macros.carbsGrams * 0.1;
      fats = macros.fatsGrams * 0.2;
    };

    [breakfast, lunch, dinner, snacks];
  };

  func createGuidelines(goal : FitnessGoal) : Text {
    switch (goal) {
      case (#weightLoss) {
        "Maintain a slight calorie deficit, prioritize lean proteins, and avoid processed sugars.";
      };
      case (#muscleGain) {
        "Consume more calories than you burn, focus on protein intake, and incorporate resistance training.";
      };
      case (#maintenance) {
        "Balance your macros, eat whole foods, and maintain consistent physical activity.";
      };
      case (#endurance) {
        "Increase carbohydrate intake, stay hydrated, and fuel your workouts with complex carbs.";
      };
    };
  };

  // Workout Plan Types
  public type Exercise = {
    name : Text;
    sets : ?Nat;
    reps : ?Nat;
    durationMinutes : ?Nat;
    caloriesPerSet : ?Nat;
    caloriesPerMinute : ?Nat;
    difficulty : Difficulty;
  };

  public type WeeklySchedule = {
    daysPerWeek : Nat;
    totalSessions : Nat;
    restDays : [Text];
    sessionLengthMinutes : Nat;
  };

  public type WorkoutPlan = {
    goal : FitnessGoal;
    planType : Text;
    weeklySchedule : WeeklySchedule;
    exerciseList : [Exercise];
    estimatedCaloriesPerSession : Nat;
  };

  public query ({ caller }) func generateWorkoutPlan(goal : FitnessGoal) : async WorkoutPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate a workout plan");
    };

    let (planType, weeklySchedule, exerciseList, caloriesPerSession) = switch (goal) {
      case (#weightLoss) {
        (
          "Cardio & Full-Body",
          {
            daysPerWeek = 5;
            totalSessions = 5;
            restDays = ["Saturday", "Sunday"];
            sessionLengthMinutes = 45;
          },
          [
            { name = "Running"; sets = ?1; reps = null; durationMinutes = ?30; caloriesPerSet = null; caloriesPerMinute = ?10; difficulty = #medium },
            { name = "Bodyweight Circuit"; sets = ?3; reps = ?15; durationMinutes = ?20; caloriesPerSet = ?120; caloriesPerMinute = null; difficulty = #medium },
            { name = "HIIT Sprints"; sets = ?10; reps = null; durationMinutes = ?10; caloriesPerSet = null; caloriesPerMinute = ?15; difficulty = #hard },
          ],
          350
        );
      };
      case (#muscleGain) {
        (
          "Resistance Training",
          {
            daysPerWeek = 4;
            totalSessions = 4;
            restDays = ["Wednesday", "Saturday", "Sunday"];
            sessionLengthMinutes = 60;
          },
          [
            { name = "Bench Press"; sets = ?4; reps = ?8; durationMinutes = ?15; caloriesPerSet = ?60; caloriesPerMinute = null; difficulty = #hard },
            { name = "Squats"; sets = ?4; reps = ?10; durationMinutes = ?20; caloriesPerSet = ?80; caloriesPerMinute = null; difficulty = #hard },
            { name = "Pull-Ups"; sets = ?4; reps = ?12; durationMinutes = ?15; caloriesPerSet = ?50; caloriesPerMinute = null; difficulty = #hard },
          ],
          400
        );
      };
      case (#maintenance) {
        (
          "Balanced Mix",
          {
            daysPerWeek = 3;
            totalSessions = 3;
            restDays = ["Wednesday", "Friday", "Saturday", "Sunday"];
            sessionLengthMinutes = 45;
          },
          [
            { name = "Jogging"; sets = ?1; reps = null; durationMinutes = ?30; caloriesPerSet = null; caloriesPerMinute = ?8; difficulty = #easy },
            { name = "Bodyweight Training"; sets = ?3; reps = ?12; durationMinutes = ?15; caloriesPerSet = ?60; caloriesPerMinute = null; difficulty = #medium },
            { name = "Yoga"; sets = ?1; reps = null; durationMinutes = ?30; caloriesPerSet = null; caloriesPerMinute = ?4; difficulty = #easy },
          ],
          250
        );
      };
      case (#endurance) {
        (
          "Cardio & Stamina",
          {
            daysPerWeek = 6;
            totalSessions = 6;
            restDays = ["Sunday"];
            sessionLengthMinutes = 60;
          },
          [
            { name = "Long-Distance Running"; sets = ?1; reps = null; durationMinutes = ?45; caloriesPerSet = null; caloriesPerMinute = ?12; difficulty = #hard },
            { name = "Cycling"; sets = ?1; reps = null; durationMinutes = ?40; caloriesPerSet = null; caloriesPerMinute = ?10; difficulty = #medium },
            { name = "Swimming"; sets = ?1; reps = null; durationMinutes = ?30; caloriesPerSet = null; caloriesPerMinute = ?11; difficulty = #medium },
          ],
          700
        );
      };
    };

    {
      goal;
      planType;
      weeklySchedule;
      exerciseList;
      estimatedCaloriesPerSession = caloriesPerSession;
    };
  };
};
