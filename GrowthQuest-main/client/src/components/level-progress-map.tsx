import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

interface LevelProgressMapProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
}

export default function LevelProgressMap({ 
  currentLevel, 
  currentXP, 
  xpToNextLevel 
}: LevelProgressMapProps) {
  const xpForCurrentLevel = currentLevel * 200;
  const xpForNextLevel = (currentLevel + 1) * 200;
  const progressInCurrentLevel = currentXP - (currentLevel - 1) * 200;
  const progressPercentage = (progressInCurrentLevel / 200) * 100;

  const levels = [];
  for (let i = Math.max(1, currentLevel - 2); i <= currentLevel + 2; i++) {
    levels.push(i);
  }

  const getLevelStatus = (level: number) => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    return 'locked';
  };

  const getLevelColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'current':
        return 'bg-primary ring-4 ring-primary/20';
      default:
        return 'bg-gray-300';
    }
  };

  const getLevelTextColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'current':
        return 'text-white';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground">
            Level Progress Map
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Level {currentLevel}</span>
            <span>→</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Level Path */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {levels.map((level, index) => {
                const status = getLevelStatus(level);
                const isLast = index === levels.length - 1;
                
                return (
                  <div key={level} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all ${getLevelColor(status)} ${getLevelTextColor(status)}`}>
                      {status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        level
                      )}
                    </div>
                    {!isLast && (
                      <div className="w-12 h-1 mx-2 bg-gray-300 rounded-full relative">
                        {level < currentLevel && (
                          <div className="w-full h-1 bg-success rounded-full"></div>
                        )}
                        {level === currentLevel && (
                          <div 
                            className="h-1 bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Progress Details */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Progress to Level {currentLevel + 1}</h4>
            <span className="text-sm text-muted-foreground">
              {progressInCurrentLevel}/200 XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {xpToNextLevel} XP needed for next level
            </span>
            <Badge variant="secondary" className="bg-secondary text-white">
              {Math.round(progressPercentage)}% complete
            </Badge>
          </div>
        </div>

        {/* Level Rewards Preview */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2">Next Level Rewards</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Circle className="h-3 w-3 fill-success text-success" />
              <span className="text-muted-foreground">New achievement badge</span>
            </div>
            <div className="flex items-center space-x-1">
              <Circle className="h-3 w-3 fill-secondary text-secondary" />
              <span className="text-muted-foreground">+50 bonus XP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
