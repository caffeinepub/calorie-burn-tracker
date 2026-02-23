import { Card, CardContent } from './ui/card';
import { Flame, Clock, Calendar } from 'lucide-react';
import type { CalorieBurnActivity } from '../backend';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface ActivityListProps {
  activities: CalorieBurnActivity[];
  isLoading: boolean;
}

export function ActivityList({ activities, isLoading }: ActivityListProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-12">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Flame className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No activities yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Start logging your workouts to track your calorie burn and see your progress!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort activities by timestamp (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <Card className="border-2">
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-6 space-y-3">
            {sortedActivities.map((activity, index) => (
              <Card
                key={index}
                className="border border-border hover:border-primary/30 transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-lg leading-tight">
                        {activity.activityName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-primary font-bold shrink-0">
                        <Flame className="w-4 h-4" />
                        <span>{Number(activity.caloriesBurned)} kcal</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{Number(activity.durationMinutes)} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
