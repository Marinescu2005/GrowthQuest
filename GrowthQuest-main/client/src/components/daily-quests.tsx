import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Star, Zap } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface DailyQuest {
  id: number;
  title: string;
  description: string;
  type: string;
  xpReward: number;
  requirement: number;
  progress: number;
  isCompleted: boolean;
  quest: {
    id: number;
    title: string;
    description: string;
    type: string;
    xpReward: number;
    requirement: number;
  };
}

export default function DailyQuests() {
  const { toast } = useToast();

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ["/api/daily-quests"],
    retry: false,
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: number) => {
      return await apiRequest(`/api/daily-quests/${questId}/complete`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Quest Completed!",
        description: "You've earned XP for completing a daily quest.",
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
        description: "Failed to complete quest. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Daily Quests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Daily Quests
          <Badge variant="secondary" className="ml-auto">
            {quests.filter((q: DailyQuest) => q.isCompleted).length}/{quests.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quests.map((quest: DailyQuest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border transition-all ${
                quest.isCompleted
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {quest.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {quest.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {quest.xpReward} XP
                  </Badge>
                  {quest.isCompleted && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">
                      {quest.progress}/{quest.requirement}
                    </span>
                  </div>
                  <Progress 
                    value={(quest.progress / quest.requirement) * 100} 
                    className="h-2"
                  />
                </div>

                {!quest.isCompleted && quest.progress >= quest.requirement && (
                  <Button
                    onClick={() => completeQuestMutation.mutate(quest.id)}
                    disabled={completeQuestMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {completeQuestMutation.isPending ? (
                      "Completing..."
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Complete Quest (+{quest.xpReward} XP)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {quests.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No daily quests available. Check back tomorrow!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}