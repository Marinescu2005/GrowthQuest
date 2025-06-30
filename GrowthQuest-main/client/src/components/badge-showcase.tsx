import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Shield, Star, Crown, Zap } from "lucide-react";

interface UserBadge {
  id: number;
  earnedAt: string;
  badge: {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    color: string;
  };
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600"
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case "legendary": return Crown;
    case "epic": return Star;
    case "rare": return Shield;
    default: return Award;
  }
};

export default function BadgeShowcase() {
  const { data: userBadges = [], isLoading } = useQuery({
    queryKey: ["/api/user/badges"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Your Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Your Badges
          <Badge variant="secondary" className="ml-auto">
            {userBadges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userBadges.length > 0 ? (
          <ScrollArea className="h-48">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBadges.map((userBadge: UserBadge) => {
                const RarityIcon = getRarityIcon(userBadge.badge.rarity);
                const rarityGradient = rarityColors[userBadge.badge.rarity as keyof typeof rarityColors] || rarityColors.common;
                
                return (
                  <div
                    key={userBadge.id}
                    className="flex flex-col items-center group cursor-pointer"
                    title={`${userBadge.badge.name} - ${userBadge.badge.description}`}
                  >
                    <div 
                      className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${rarityGradient} p-0.5 transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg`}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <RarityIcon 
                          className="h-8 w-8 text-gray-700 dark:text-gray-300" 
                          style={{ color: userBadge.badge.color }}
                        />
                      </div>
                      {userBadge.badge.rarity === "legendary" && (
                        <div className="absolute -top-1 -right-1">
                          <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-center mt-2 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {userBadge.badge.name}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="text-xs mt-1"
                      style={{ 
                        borderColor: userBadge.badge.color,
                        color: userBadge.badge.color 
                      }}
                    >
                      {userBadge.badge.rarity}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No badges earned yet. Complete goals and achievements to earn your first badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}