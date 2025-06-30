import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: string;
  targetValue: string;
  currentValue: string;
  unit?: string;
  frequency: string;
  isCompleted: boolean;
  dueDate?: string;
}

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const calculateProgress = () => {
    const current = parseFloat(goal.currentValue) || 0;
    const target = parseFloat(goal.targetValue) || 1;
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      fitness: "bg-success",
      learning: "bg-secondary", 
      reading: "bg-primary",
      mindfulness: "bg-accent",
      productivity: "bg-orange-500",
      social: "bg-pink-500",
    };
    return colors[category.toLowerCase()] || "bg-gray-500";
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily':
        return "bg-primary text-white";
      case 'weekly':
        return "bg-secondary text-white";
      case 'monthly':
        return "bg-accent text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const progress = calculateProgress();

  return (
    <div className={`border border-gray-100 rounded-xl p-4 transition-all hover:shadow-md ${
      goal.isCompleted ? 'opacity-75 bg-gray-50' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge className={`${getCategoryColor(goal.category)} text-white text-xs`}>
            {goal.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getFrequencyColor(goal.frequency)}`}
          >
            {goal.frequency}
          </Badge>
        </div>
        {goal.isCompleted && (
          <CheckCircle className="h-5 w-5 text-success" />
        )}
      </div>
      
      <h4 className={`font-medium text-foreground text-sm mb-2 ${
        goal.isCompleted ? 'line-through' : ''
      }`}>
        {goal.title}
      </h4>
      
      {goal.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {goal.description}
        </p>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">
            {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
          </span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2"
        />
        
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${
            progress === 100 ? 'text-success' : 'text-primary'
          }`}>
            {Math.round(progress)}% complete
          </span>
          
          {goal.dueDate && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatTimeRemaining(goal.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
