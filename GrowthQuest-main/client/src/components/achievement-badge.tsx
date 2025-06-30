import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Heart, 
  Book, 
  Dumbbell, 
  Users,
  Lock,
  Award
} from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
}

interface AchievementBadgeProps {
  achievement: Achievement | null;
  earned: boolean;
}

export default function AchievementBadge({ achievement, earned }: AchievementBadgeProps) {
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      trophy: Trophy,
      star: Star,
      target: Target,
      fire: Flame,
      heart: Heart,
      book: Book,
      dumbbell: Dumbbell,
      users: Users,
      award: Award,
    };
    return iconMap[iconName] || Trophy;
  };

  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      'getting-started': 'from-primary to-purple-400',
      'streaks': 'from-success to-green-400',
      'goals': 'from-secondary to-blue-400',
      'community': 'from-accent to-pink-400',
      'reading': 'from-purple-500 to-purple-400',
      'fitness': 'from-orange-500 to-orange-400',
    };
    return gradients[category] || 'from-gray-400 to-gray-300';
  };

  if (!achievement) {
    // Locked/placeholder badge
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <h4 className="text-xs font-medium text-foreground mb-1">Locked</h4>
        <p className="text-xs text-muted-foreground">Keep growing!</p>
      </div>
    );
  }

  const IconComponent = getIcon(achievement.icon);
  const gradientClass = getCategoryGradient(achievement.category);

  return (
    <div className={`text-center transition-all hover:scale-105 ${
      earned ? 'opacity-100' : 'opacity-50'
    }`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg ${
        earned 
          ? `bg-gradient-to-br ${gradientClass}`
          : 'bg-gray-200'
      }`}>
        <IconComponent className={`h-6 w-6 ${
          earned ? 'text-white' : 'text-gray-400'
        }`} />
      </div>
      
      <h4 className="text-xs font-medium text-foreground mb-1 leading-tight">
        {achievement.name}
      </h4>
      
      <p className="text-xs text-muted-foreground mb-2 leading-tight">
        {achievement.description}
      </p>
      
      {earned && (
        <Badge variant="secondary" className="text-xs bg-secondary text-white">
          {achievement.xpReward} XP
        </Badge>
      )}
    </div>
  );
}
