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
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type CalorieBurnActivity = {
    activityName : Text;
    caloriesBurned : Nat;
    durationMinutes : Nat;
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

  // User profile management functions
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

  // Activity management functions
  public shared ({ caller }) func addActivity(activityName : Text, caloriesBurned : Nat, durationMinutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add activities");
    };

    let activity : CalorieBurnActivity = {
      activityName;
      caloriesBurned;
      durationMinutes;
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

  // Daily calorie goal management functions
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
};
