import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LevelProgressMap from "@/components/level-progress-map";
import ProgressChart from "@/components/progress-chart";
import GoalCard from "@/components/goal-card";
import AchievementBadge from "@/components/achievement-badge";
import DailyQuests from "@/components/daily-quests";
import BadgeShowcase from "@/components/badge-showcase";
import XPRewards from "@/components/xp-rewards";
import { useQuery } from "@tanstack/react-query";
import { 
  Target, 
  Flame, 
  Star, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Plus,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
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

  const { data: communityPosts } = useQuery({
    queryKey: ["/api/community/posts", { limit: 3 }],
    enabled: isAuthenticated,
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard", { limit: 3 }],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  const currentGoals = goals?.slice(0, 3) || [];
  const completedGoalsToday = goals?.filter(g => g.isCompleted)?.length || 0;
  const totalGoals = goals?.length || 0;
  const dailyProgress = totalGoals > 0 ? (completedGoalsToday / totalGoals) * 100 : 0;
  
  const xpToNextLevel = ((user?.level || 1) * 200) - (user?.xp || 0);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Developer'}!
              </h2>
              <p className="text-lg opacity-90 mb-6">
                You're on level {user?.level || 1} and doing amazing! Keep up the great work on your personal development journey.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Flame className="text-yellow-300 h-5 w-5" />
                  <span className="font-medium">{user?.currentStreak || 0} day streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-300 h-5 w-5" />
                  <span className="font-medium">{user?.xp || 0} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-300 h-5 w-5" />
                  <span className="font-medium">Level {user?.level || 1}</span>
                </div>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Today's Progress</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Daily Goals</h4>
                    <Target className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {completedGoalsToday}/{totalGoals}
                  </div>
                  <Progress value={dailyProgress} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">{Math.round(dailyProgress)}% completed</p>
                </div>

                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Weekly Streak</h4>
                    <Flame className="text-success h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {user?.currentStreak || 0} days
                  </div>
                  <Progress value={Math.min((user?.currentStreak || 0) / 7 * 100, 100)} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {user?.currentStreak === 7 ? "Perfect week!" : "Keep going!"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">XP Today</h4>
                    <Star className="text-secondary h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">+0</div>
                  <Progress value={0} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">Start achieving goals!</p>
                </div>
              </div>
            </section>

            {/* Level Progress Map */}
            <LevelProgressMap 
              currentLevel={user?.level || 1} 
              currentXP={user?.xp || 0} 
              xpToNextLevel={xpToNextLevel}
            />

            {/* Analytics Dashboard */}
            <ProgressChart userId={user?.id || ""} />

            {/* Community Highlights */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Community Highlights</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  Join Discussion
                </Button>
              </div>
              
              <div className="space-y-4">
                {communityPosts && communityPosts.length > 0 ? (
                  communityPosts.map((post: any) => (
                    <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <img 
                        src={post.user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.id}`}
                        alt="Community member" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-foreground">
                            {post.user.firstName} {post.user.lastName}
                          </h5>
                          <Badge variant="secondary" className="text-xs">
                            Level {post.user.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-accent" />
                            <span>{post.likes} likes</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.replies} replies</span>
                          </span>
                          <span>2h ago</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No community posts yet. Be the first to share!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Current Goals */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Current Goals</h3>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {currentGoals.length > 0 ? (
                  currentGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No goals yet. Create your first goal!</p>
                    <Button size="sm">Add Goal</Button>
                  </div>
                )}
              </div>
            </section>

            {/* Achievement Badges */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Recent Achievements</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {achievements && achievements.length > 0 ? (
                  achievements.slice(0, 6).map((userAchievement: any) => (
                    <AchievementBadge 
                      key={userAchievement.id} 
                      achievement={userAchievement.achievement}
                      earned={true}
                    />
                  ))
                ) : (
                  <>
                    <AchievementBadge achievement={null} earned={false} />
                    <AchievementBadge achievement={null} earned={false} />
                    <AchievementBadge achievement={null} earned={false} />
                  </>
                )}
              </div>
            </section>

            {/* Daily Quests */}
            <DailyQuests />

            {/* XP Rewards */}
            <XPRewards userLevel={user?.level} userXP={user?.xp} />

            {/* Badge Showcase */}
            <BadgeShowcase />

            {/* Leaderboard */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Weekly Leaderboard</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View Full
                </Button>
              </div>
              
              <div className="space-y-3">
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((leaderUser: any, index: number) => (
                    <div key={leaderUser.id} className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                      leaderUser.id === user?.id 
                        ? 'bg-gradient-to-r from-primary/10 to-transparent' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-primary' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <img 
                        src={leaderUser.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderUser.id}`}
                        alt="Leaderboard user" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">
                          {leaderUser.firstName} {leaderUser.lastName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Level {leaderUser.level} • {leaderUser.xp} XP
                        </p>
                      </div>
                      {leaderUser.id === user?.id && (
                        <span className="text-xs text-muted-foreground">You</span>
                      )}
                      {index === 0 && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Leaderboard coming soon!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-primary/10 hover:bg-primary/20 border-primary/20">
                  <Plus className="text-primary h-6 w-6 mb-2" />
                  <span className="text-sm font-medium text-foreground">Add Goal</span>
                </Button>
                
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-success/10 hover:bg-success/20 border-success/20">
                  <CheckCircle className="text-success h-6 w-6 mb-2" />
                  <span className="text-sm font-medium text-foreground">Log Progress</span>
                </Button>
                
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-secondary/10 hover:bg-secondary/20 border-secondary/20">
                  <Users className="text-secondary h-6 w-6 mb-2" />
                  <span className="text-sm font-medium text-foreground">Join Challenge</span>
                </Button>
                
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-accent/10 hover:bg-accent/20 border-accent/20">
                  <TrendingUp className="text-accent h-6 w-6 mb-2" />
                  <span className="text-sm font-medium text-foreground">View Insights</span>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
