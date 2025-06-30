import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Lock, 
  Star, 
  Trophy, 
  CheckCircle,
  Zap
} from "lucide-react";

interface MapLevel {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  activity: string;
  position: { x: number; y: number };
}

export default function Map() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Neautorizat",
        description: "Ești deconectat. Te conectăm din nou...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userProgress } = useQuery({
    queryKey: ["/api/analytics/daily-xp"],
    enabled: isAuthenticated,
  });

  // Mock map levels - in production would come from backend
  const mapLevels: MapLevel[] = [
    {
      id: 1,
      title: "Primul Pas",
      description: "Stabilește primul tău obiectiv",
      xpReward: 50,
      isUnlocked: true,
      isCompleted: false,
      activity: "Creează un obiectiv personal",
      position: { x: 20, y: 80 }
    },
    {
      id: 2,
      title: "Reflecție Zilnică",
      description: "Scrie prima intrare în jurnal",
      xpReward: 75,
      isUnlocked: true,
      isCompleted: false,
      activity: "Completează jurnalul personal",
      position: { x: 40, y: 60 }
    },
    {
      id: 3,
      title: "Conexiune Comunitară",
      description: "Interacționează cu comunitatea",
      xpReward: 100,
      isUnlocked: false,
      isCompleted: false,
      activity: "Trimite primul mesaj în chat",
      position: { x: 60, y: 40 }
    },
    {
      id: 4,
      title: "Persistent",
      description: "Menține o progresie de 7 zile",
      xpReward: 150,
      isUnlocked: false,
      isCompleted: false,
      activity: "Completează activități 7 zile consecutiv",
      position: { x: 80, y: 20 }
    }
  ];

  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Harta Progresului</h1>
          <p className="text-muted-foreground">
            Străbate nivelele și deblochează noi provocări pentru a-ți dezvolta potențialul
          </p>
        </div>

        {/* User Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Progresul Tău
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentLevel}</div>
                <div className="text-sm text-muted-foreground">Nivel Curent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{currentXP}</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mapLevels.filter(l => l.isCompleted).length}</div>
                <div className="text-sm text-muted-foreground">Nivele Complete</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progres până la următorul nivel</span>
                <span>{currentXP % 200}/200 XP</span>
              </div>
              <Progress value={(currentXP % 200) / 200 * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Harta Interactivă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg overflow-hidden">
              {mapLevels.map((level) => (
                <div
                  key={level.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${level.position.x}%`,
                    top: `${level.position.y}%`,
                  }}
                >
                  <Button
                    variant={level.isCompleted ? "default" : level.isUnlocked ? "outline" : "secondary"}
                    size="lg"
                    className={`w-16 h-16 rounded-full p-0 ${
                      level.isCompleted 
                        ? "bg-success text-success-foreground" 
                        : level.isUnlocked 
                        ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!level.isUnlocked}
                  >
                    {level.isCompleted ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : level.isUnlocked ? (
                      <MapPin className="h-8 w-8" />
                    ) : (
                      <Lock className="h-8 w-8" />
                    )}
                  </Button>
                  
                  {/* Level Info Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                    <Card className="w-48 shadow-lg">
                      <CardContent className="p-3">
                        <div className="text-center">
                          <h4 className="font-semibold text-sm">{level.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium">{level.xpReward} XP</span>
                          </div>
                          <Badge variant={level.isUnlocked ? "default" : "secondary"} className="mt-2 text-xs">
                            {level.isCompleted ? "Completat" : level.isUnlocked ? "Disponibil" : "Blocat"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Level List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mapLevels.map((level) => (
            <Card key={level.id} className={`${level.isCompleted ? "border-success" : level.isUnlocked ? "border-primary" : "opacity-60"}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {level.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : level.isUnlocked ? (
                      <Star className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    {level.title}
                  </span>
                  <Badge variant={level.isCompleted ? "default" : level.isUnlocked ? "outline" : "secondary"}>
                    {level.xpReward} XP
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{level.description}</p>
                <p className="text-sm font-medium mb-4">Activitate: {level.activity}</p>
                <Button 
                  disabled={!level.isUnlocked || level.isCompleted}
                  className="w-full"
                  variant={level.isCompleted ? "outline" : "default"}
                  onClick={() => {
                    if (level.isUnlocked && !level.isCompleted) {
                      alert(`Ai început misiunea: ${level.title}! (Aici poți implementa logica de backend pentru progres)`);
                      // TODO: Trimite request la backend pentru a marca misiunea ca începută/completată
                    }
                  }}
                >
                  {level.isCompleted ? "Completat" : level.isUnlocked ? "Începe Activitatea" : "Blocat"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}