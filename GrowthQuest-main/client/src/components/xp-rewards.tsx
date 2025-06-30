import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Zap, Star, Gift, TrendingUp, Plus } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

const quickActions = [
  { 
    id: "daily_login", 
    title: "Daily Login Bonus", 
    description: "Log in daily to get bonus XP", 
    xp: 25, 
    icon: Star,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: "social_share", 
    title: "Share Achievement", 
    description: "Share your progress with the community", 
    xp: 15, 
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  },
  { 
    id: "profile_update", 
    title: "Complete Profile", 
    description: "Update your profile information", 
    xp: 50, 
    icon: Gift,
    color: "from-purple-500 to-pink-500"
  },
  { 
    id: "feedback", 
    title: "Provide Feedback", 
    description: "Help us improve TranscendUp", 
    xp: 30, 
    icon: Plus,
    color: "from-orange-500 to-red-500"
  }
];

interface XPRewardsProps {
  userLevel?: number;
  userXP?: number;
}

export default function XPRewards({ userLevel = 1, userXP = 0 }: XPRewardsProps) {
  const { toast } = useToast();
  const [claimedActions, setClaimedActions] = useState<Set<string>>(new Set());

  const awardXPMutation = useMutation({
    mutationFn: async ({ amount, source }: { amount: number; source: string }) => {
      return await apiRequest("/api/xp/award", {
        method: "POST",
        body: JSON.stringify({ amount, source }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setClaimedActions(prev => new Set([...prev, variables.source]));
      toast({
        title: "XP Earned!",
        description: `You earned ${variables.amount} XP! Keep growing!`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to award XP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClaimXP = (action: typeof quickActions[0]) => {
    if (claimedActions.has(action.id)) return;
    awardXPMutation.mutate({ amount: action.xp, source: action.id });
  };

  const getXPToNextLevel = () => {
    const nextLevelXP = userLevel * 200;
    return nextLevelXP - userXP;
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Quick XP Rewards
          <Badge variant="outline" className="ml-auto">
            Level {userLevel}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getXPToNextLevel()} XP needed for next level
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const isClaimed = claimedActions.has(action.id);
            const IconComponent = action.icon;
            
            return (
              <div
                key={action.id}
                className={`relative p-4 rounded-lg border transition-all ${
                  isClaimed
                    ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        +{action.xp} XP
                      </Badge>
                      
                      <Button
                        size="sm"
                        onClick={() => handleClaimXP(action)}
                        disabled={isClaimed || awardXPMutation.isPending}
                        className={`h-7 text-xs ${
                          isClaimed 
                            ? "bg-gray-400" 
                            : `bg-gradient-to-r ${action.color} hover:opacity-90`
                        }`}
                      >
                        {isClaimed ? "Claimed" : "Claim"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isClaimed && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Complete more goals and activities to earn additional XP!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Level up to unlock new features and rewards
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}