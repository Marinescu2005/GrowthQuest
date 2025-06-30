import { Gift, Star } from "lucide-react";
import type { Level } from "@shared/schema";

interface LevelNodeProps {
  level: Level & { completed: boolean; isAvailable: boolean };
  isUnlocked: boolean;
  hasReward: boolean;
  onClick: () => void;
}

export default function LevelNode({ level, isUnlocked, hasReward, onClick }: LevelNodeProps) {
  const getNodeClasses = () => {
    const baseClasses = "level-node w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer relative";
    
    if (!isUnlocked) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100`;
    }
    
    if (level.completed) {
      if (level.isBossLevel) {
        return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-700 text-white border-2 border-purple-300`;
      }
      if (level.isRewardLevel) {
        return `${baseClasses} bg-gradient-to-r from-transcend-amber to-orange-500 text-white`;
      }
      return `${baseClasses} bg-transcend-green text-white ${level.levelNumber === 1 ? 'animate-glow' : ''}`;
    }
    
    if (level.isAvailable) {
      return `${baseClasses} bg-transcend-blue text-white border-4 border-blue-300 animate-pulse-slow`;
    }
    
    if (level.isBossLevel) {
      return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-600 text-white border-2 border-gray-400 cursor-not-allowed hover:scale-100`;
    }
    
    if (level.isRewardLevel) {
      return `${baseClasses} bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed hover:scale-100`;
    }
    
    return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100`;
  };

  const handleClick = () => {
    if (isUnlocked && (level.completed || level.isAvailable)) {
      onClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      <div
        onClick={handleClick}
        className={getNodeClasses()}
      >
        {level.completed ? (
          level.isBossLevel ? "👑" : level.isRewardLevel ? "🏆" : "✓"
        ) : (
          <span className="text-xs sm:text-sm">{level.levelNumber}</span>
        )}
        
        {hasReward && (
          <div className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-transcend-amber rounded-full flex items-center justify-center animate-bounce border border-white">
            <span className="text-xs">🎁</span>
          </div>
        )}
      </div>
      
      {level.isBossLevel && (
        <div className="mt-1 text-xs font-medium text-purple-600 whitespace-nowrap">
          Boss
        </div>
      )}
      
      {level.isRewardLevel && !level.isBossLevel && (
        <div className="mt-1 text-xs font-medium text-amber-600 whitespace-nowrap">
          Recompensă
        </div>
      )}

      {/* Mobile-optimized tooltip with objective on available levels */}
      {level.isAvailable && isUnlocked && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs md:max-w-sm whitespace-normal text-center">
            <div className="font-semibold mb-1">{level.objective}</div>
            <div className="text-transcend-green">+{level.xpReward} XP</div>
          </div>
        </div>
      )}
    </div>
  );
}
