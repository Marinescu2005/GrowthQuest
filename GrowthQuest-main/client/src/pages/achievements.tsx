import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import AchievementBadge from "@/components/achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Award, Lock } from "lucide-react";

const mockAchievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Create your first goal",
    icon: "target",
    category: "getting-started",
    xpReward: 50,
  },
  {
    id: 2,
    name: "Consistency Champion",
    description: "Maintain a 7-day streak",
    icon: "fire",
    category: "streaks",
    xpReward: 100,
  },
  {
    id: 3,
    name: "Goal Crusher",
    description: "Complete 5 goals",
    icon: "trophy",
    category: "goals",
    xpReward: 200,
  },
  {
    id: 4,
    name: "Community Helper",
    description: "Get 25 likes on community posts",
    icon: "heart",
    category: "community",
    xpReward: 150,
  },
  {
    id: 5,
    name: "Bookworm",
    description: "Read 10 books",
    icon: "book",
    category: "reading",
    xpReward: 300,
  },
  {
    id: 6,
    name: "Fitness Enthusiast",
    description: "Complete 50 workout sessions",
    icon: "dumbbell",
    category: "fitness",
    xpReward: 250,
  },
];

export default function Achievements() {
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

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
  });

  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
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

  const earnedAchievementIds = userAchievements?.map((ua: any) => ua.achievement.id) || [];
  const earnedCount = userAchievements?.length || 0;
  const totalAchievements = mockAchievements.length;
  const progressPercentage = (earnedCount / totalAchievements) * 100;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "getting-started": "bg-primary",
      "streaks": "bg-success",
      "goals": "bg-secondary",
      "community": "bg-accent",
      "reading": "bg-purple-500",
      "fitness": "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const getIconForAchievement = (iconName: string) => {
    const icons: { [key: string]: any } = {
      target: Trophy,
      fire: Star,
      trophy: Award,
      heart: Star,
      book: Trophy,
      dumbbell: Star,
    };
    return icons[iconName] || Trophy;
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-2">
            Unlock badges and rewards as you progress on your journey
          </p>
        </div>

        {/* Achievement Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Achievement Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {earnedCount} of {totalAchievements} earned
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {Object.entries(
            mockAchievements.reduce((acc, achievement) => {
              const category = achievement.category;
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(achievement);
              return acc;
            }, {} as { [key: string]: typeof mockAchievements })
          ).map(([category, achievements]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="capitalize">{category.replace('-', ' ')}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {achievements.filter(a => earnedAchievementIds.includes(a.id)).length}/{achievements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => {
                    const isEarned = earnedAchievementIds.includes(achievement.id);
                    const IconComponent = getIconForAchievement(achievement.icon);
                    
                    return (
                      <div key={achievement.id} className={`relative p-6 rounded-xl border-2 transition-all ${
                        isEarned 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}>
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            isEarned 
                              ? `${getCategoryColor(achievement.category)} shadow-lg` 
                              : 'bg-gray-300'
                          }`}>
                            {isEarned ? (
                              <IconComponent className="h-8 w-8 text-white" />
                            ) : (
                              <Lock className="h-8 w-8 text-gray-500" />
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          <Badge 
                            variant={isEarned ? "default" : "secondary"}
                            className={isEarned ? "bg-secondary" : ""}
                          >
                            {achievement.xpReward} XP
                          </Badge>
                          {isEarned && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                                <Star className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{earnedCount}</div>
              <p className="text-sm text-muted-foreground">Achievements Earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userAchievements?.reduce((sum: number, ua: any) => sum + ua.achievement.xpReward, 0) || 0}
              </div>
              <p className="text-sm text-muted-foreground">XP from Achievements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round(progressPercentage)}%
              </div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
