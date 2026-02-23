import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type OldActor = {
    userActivities : Map.Map<Principal, List.List<{ activityName : Text; caloriesBurned : Nat; durationMinutes : Nat; timestamp : Int }>>;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, { name : Text }>;
    userActivities : Map.Map<Principal, List.List<{ activityName : Text; caloriesBurned : Nat; durationMinutes : Nat; timestamp : Int }>>;
    dailyCalorieGoals : Map.Map<Principal, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let accessControlState = AccessControl.initState();
    let userProfiles = Map.empty<Principal, { name : Text }>();
    let dailyCalorieGoals = Map.empty<Principal, Nat>();
    {
      accessControlState;
      userProfiles;
      userActivities = old.userActivities;
      dailyCalorieGoals;
    };
  };
};
