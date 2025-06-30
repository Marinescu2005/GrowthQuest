import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Trophy, Star, Target, Gift } from "lucide-react";
import RewardModal from "@/components/RewardModal";
import type { UserWithProgress, RegionWithProgress, CardReward, Level } from "@shared/schema";

export default function MapSingle() {
  console.log("MapSingle component mounted/rendered");
  
  const [selectedReward, setSelectedReward] = useState<CardReward | null>(null);

  const userQuery = useQuery<UserWithProgress>({
    queryKey: ['/api/user/1'],
    on401: "returnNull" as const,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  const regionsQuery = useQuery<RegionWithProgress[]>({
    queryKey: ['/api/regions/1'],
    enabled: !!userQuery.data,
    on401: "returnNull" as const,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  const rewardsQuery = useQuery<CardReward[]>({
    queryKey: ['/api/rewards/1'], 
    enabled: !!userQuery.data,
    on401: "returnNull" as const,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  if (userQuery.isLoading || regionsQuery.isLoading || rewardsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-transcend-blue mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Se încarcă harta TranscendUp...</p>
        </div>
      </div>
    );
  }

  if (!userQuery.data || !regionsQuery.data || !rewardsQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl text-red-600 font-medium">Nu s-au putut încărca datele hărții.</p>
        </div>
      </div>
    );
  }

  const user = userQuery.data;
  const regions = regionsQuery.data;
  const rewards = rewardsQuery.data;
  const rewardLevels = new Set(rewards.map(r => r.earnedAt));

  const getRegionIcon = (regionId: number) => {
    const icons = {
      1: "🌱", 2: "🏔️", 3: "⛰️", 4: "🏔️", 5: "🏔️"
    };
    return icons[regionId] || "🎯";
  };

  const getRegionColors = (regionId: number) => {
    const colors = {
      1: { bg: "from-green-400/20 to-emerald-400/20", border: "border-green-300/50" },
      2: { bg: "from-blue-400/20 to-cyan-400/20", border: "border-blue-300/50" },
      3: { bg: "from-orange-400/20 to-amber-400/20", border: "border-orange-300/50" },
      4: { bg: "from-red-400/20 to-pink-400/20", border: "border-red-300/50" },
      5: { bg: "from-purple-400/20 to-indigo-400/20", border: "border-purple-300/50" }
    };
    return colors[regionId] || { bg: "from-gray-400/20 to-gray-400/20", border: "border-gray-300/50" };
  };

  const handleLevelClick = (level: Level & { completed: boolean; isAvailable: boolean }) => {
    if (!level.isAvailable) return;
    
    const reward = rewards.find(r => r.earnedAt === level.levelNumber);
    if (reward) {
      setSelectedReward(reward);
    }
  };

  // Remove duplicate regions if they exist in the data
  const uniqueRegions = regions.filter((region, index, self) => 
    index === self.findIndex(r => r.name === region.name)
  );
  
  console.log("Original regions count:", regions.length, "Unique regions count:", uniqueRegions.length);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Stats Bar - Duolingo Style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔥</span>
            </div>
            <span className="text-orange-600 font-bold text-lg">{Math.floor(user.completedLevels / 7)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">💎</span>
            </div>
            <span className="text-blue-600 font-bold text-lg">{user.totalXP}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">❤️</span>
            </div>
            <span className="text-red-600 font-bold text-lg">5</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">

        {/* Section Header - Duolingo Style */}
        {uniqueRegions.map((region, regionIndex) => {
          console.log("Rendering region:", region.name, region.id);
          
          // Show section header for each region
          const sectionNumber = regionIndex + 1;
          const sectionTitle = `SECȚIUNEA ${sectionNumber}`;
          
          return (
            <div key={`region-${region.id}`} className="mb-8">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 mb-6 shadow-lg">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-semibold opacity-90">{sectionTitle}</p>
                    <h2 className="text-xl font-bold">{region.name}</h2>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getRegionIcon(region.id)}</span>
                  </div>
                </div>
              </div>

              {/* Levels Path - Vertical Duolingo Style */}
              <div className="space-y-6">
                {region.levels.map((level, levelIndex) => {
                  const hasReward = rewardLevels.has(level.levelNumber);
                  const isCompleted = level.completed;
                  const isAvailable = level.isAvailable;
                  const isBoss = level.levelNumber % 20 === 0;
                  
                  // Alternate left-right positioning like Duolingo
                  const isLeft = levelIndex % 2 === 0;
                  const offsetClass = isLeft ? 'mr-auto' : 'ml-auto';
                  
                  return (
                    <div key={`level-${level.id}`} className={`relative w-20 ${offsetClass}`}>
                      {/* Connecting Line */}
                      {levelIndex < region.levels.length - 1 && (
                        <div className="absolute top-16 left-1/2 w-1 h-8 bg-gray-200 transform -translate-x-1/2 z-0"></div>
                      )}
                      
                      {/* Level Node */}
                      <button
                        onClick={() => handleLevelClick(level)}
                        disabled={!isAvailable}
                        className={`
                          relative w-16 h-16 rounded-full border-4 transition-all duration-300 transform z-10
                          ${isCompleted 
                            ? 'bg-green-500 border-green-600 shadow-lg scale-105' 
                            : isAvailable 
                              ? 'bg-white border-gray-300 hover:scale-110 shadow-md hover:shadow-lg' 
                              : 'bg-gray-200 border-gray-300 opacity-50'}
                          ${isBoss ? 'border-purple-500 bg-purple-100' : ''}
                        `}
                      >
                        {/* Level Content */}
                        {isCompleted ? (
                          <Star className="w-8 h-8 text-white mx-auto" />
                        ) : isBoss ? (
                          <span className="text-2xl">👑</span>
                        ) : (
                          <span className={`text-sm font-bold ${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                            {level.levelNumber}
                          </span>
                        )}
                        
                        {/* Reward Indicator */}
                        {hasReward && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs">🏆</span>
                          </div>
                        )}
                        
                        {/* Progress Ring for Available Levels */}
                        {isAvailable && !isCompleted && (
                          <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse"></div>
                        )}
                      </button>
                      
                      {/* Level Title */}
                      <p className="text-center text-xs text-gray-600 mt-2 font-medium">
                        Nivel {level.levelNumber}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* TranscendUp Mascot */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-3xl">🧘‍♂️</span>
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium">Maestrul TranscendUp</p>
          <p className="text-xs text-gray-500">Ghidul tău în dezvoltare personală</p>
        </div>

        {/* Bottom Navigation - Duolingo Style */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-20">
          <div className="flex justify-center items-center space-x-8 max-w-md mx-auto">
            <button className="flex flex-col items-center p-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-blue-600 font-medium mt-1">Învață</span>
            </button>
            
            <button className="flex flex-col items-center p-2 opacity-60">
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-500 mt-1">Clasament</span>
            </button>
            
            <button className="flex flex-col items-center p-2 opacity-60">
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-500 mt-1">Shop</span>
            </button>
            
            <button className="flex flex-col items-center p-2 opacity-60">
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-gray-500 mt-1">Profil</span>
            </button>
          </div>
        </div>

        {selectedReward && (
          <RewardModal
            reward={selectedReward}
            userId={user.id}
            onClose={() => setSelectedReward(null)}
          />
        )}
        
        {/* Bottom Spacing for Navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}