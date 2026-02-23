import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CaloriesSummary } from './components/CaloriesSummary';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { GoalSettingForm } from './components/GoalSettingForm';
import { LoginPrompt } from './components/LoginPrompt';
import { useActivities } from './hooks/useQueries';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Toaster } from './components/ui/sonner';

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: activities, isLoading, refetch } = useActivities();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {isInitializing ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <LoginPrompt />
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Track Your Calorie Burn
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Log your activities and monitor your progress. Every workout counts!
              </p>
            </div>

            {/* Summary Card */}
            <CaloriesSummary activities={activities || []} isLoading={isLoading} />

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Forms */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Set Your Goal</h2>
                  <GoalSettingForm />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Log New Activity</h2>
                  <ActivityForm onSuccess={refetch} />
                </div>
              </div>

              {/* Right Column: Activity List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Recent Activities</h2>
                <ActivityList activities={activities || []} isLoading={isLoading} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
