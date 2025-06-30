import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import ProgressChart from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Target, Star, Calendar } from "lucide-react";

export default function Progress() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
    enabled: isAuthenticated,
  });

  const { data: progressEntries } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const completedGoals = goals?.filter((goal: any) => goal.isCompleted).length || 0;
  const totalGoals = goals?.length || 0;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const thisWeekEntries = progressEntries?.filter((entry: any) => {
    const entryDate = new Date(entry.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  }) || [];

  const weeklyXP = thisWeekEntries.reduce((sum: number, entry: any) => sum + (entry.xpEarned || 0), 0);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Progress Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your growth and see how far you've come
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.level || 1}</div>
              <p className="text-xs text-muted-foreground">
                {user?.xp || 0} total XP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(completionRate)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly XP</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyXP}</div>
              <p className="text-xs text-muted-foreground">
                {thisWeekEntries.length} activities logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.currentStreak || 0}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProgressChart userId={user?.id || ""} />
          
          <Card>
            <CardHeader>
              <CardTitle>Goal Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals && goals.length > 0 ? (
                  (() => {
                    const categoryStats = goals.reduce((acc: any, goal: any) => {
                      const category = goal.category;
                      if (!acc[category]) {
                        acc[category] = { total: 0, completed: 0 };
                      }
                      acc[category].total++;
                      if (goal.isCompleted) {
                        acc[category].completed++;
                      }
                      return acc;
                    }, {});

                    return Object.entries(categoryStats).map(([category, stats]: [string, any]) => {
                      const completion = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="capitalize">
                              {category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {stats.completed}/{stats.total} goals
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round(completion)}%
                          </span>
                        </div>
                      );
                    });
                  })()
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No goals to analyze yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressEntries && progressEntries.length > 0 ? (
                progressEntries.slice(0, 10).map((entry: any) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Progress logged</p>
                      <p className="text-sm text-muted-foreground">
                        Value: {entry.value} • {entry.notes && `"${entry.notes}"`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString()} at{" "}
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {entry.xpEarned > 0 && (
                      <Badge className="bg-secondary">
                        +{entry.xpEarned} XP
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity logged yet</p>
                  <p className="text-sm">Start working on your goals to see progress here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
}
