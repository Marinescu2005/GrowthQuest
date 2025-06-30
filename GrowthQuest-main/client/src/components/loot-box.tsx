import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Gift,
  Star,
  Sparkles,
  Crown,
  Award,
  Zap,
  Trophy
} from "lucide-react";

interface LootItem {
  id: number;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  type: "xp_boost" | "achievement_badge" | "title" | "theme";
  value: number;
  description: string;
  icon: string;
}

interface LootBoxProps {
  type: "level" | "objective";
  availableBoxes: number;
  className?: string;
}

const rarityConfig = {
  common: {
    label: "Începător Ambițios",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-700",
    probability: 50
  },
  rare: {
    label: "Perseverent",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-300 dark:border-blue-700",
    probability: 30
  },
  epic: {
    label: "Disciplinat",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-300 dark:border-purple-700",
    probability: 15
  },
  legendary: {
    label: "Maestru al Disciplinei",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    probability: 5
  }
};

const iconComponents = {
  star: Star,
  sparkles: Sparkles,
  crown: Crown,
  award: Award,
  zap: Zap,
  trophy: Trophy
};

export default function LootBox({ type, availableBoxes, className = "" }: LootBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [openedItems, setOpenedItems] = useState<LootItem[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const openLootBoxMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/loot-box/open/${type}`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      setOpenedItems(data.items);
      setShowRewards(true);
      setIsOpening(false);
      
      // Update related queries
      queryClient.invalidateQueries(["/api/auth/user"]);
      queryClient.invalidateQueries(["/api/loot-box/available"]);
      
      toast({
        title: "Cutie deschisă cu succes!",
        description: `Ai primit ${data.items.length} obiecte noi`,
      });
    },
    onError: (error) => {
      setIsOpening(false);
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Eroare",
        description: "Nu s-a putut deschide cutia",
        variant: "destructive",
      });
    },
  });

  const handleOpenBox = () => {
    setIsOpening(true);
    // Add a delay for animation effect
    setTimeout(() => {
      openLootBoxMutation.mutate();
    }, 2000);
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary": return Crown;
      case "epic": return Sparkles;
      case "rare": return Star;
      default: return Award;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "xp_boost": return Zap;
      case "achievement_badge": return Trophy;
      case "title": return Crown;
      case "theme": return Sparkles;
      default: return Gift;
    }
  };

  if (availableBoxes === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Cutii Disponibile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <div className="text-3xl font-bold text-primary">{availableBoxes}</div>
            <div className="text-sm text-muted-foreground">
              {type === "level" ? "Cutii de nivel" : "Cutii de obiective"}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                <Gift className="h-4 w-4 mr-2" />
                Deschide Cutie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  {isOpening ? "Se deschide cutia..." : "Deschide Cutia Magică"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-8">
                {!isOpening && !showRewards && (
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <Gift className="h-24 w-24 mx-auto text-primary animate-bounce" />
                      <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Ce poți primi:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(rarityConfig).map(([rarity, config]) => (
                          <div key={rarity} className={`p-2 rounded ${config.bgColor} ${config.borderColor} border`}>
                            <div className={`font-medium ${config.color}`}>{config.label}</div>
                            <div className="text-xs text-muted-foreground">{config.probability}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleOpenBox} className="w-full" size="lg">
                      <Gift className="h-4 w-4 mr-2" />
                      Deschide Acum
                    </Button>
                  </div>
                )}

                {isOpening && (
                  <div className="text-center space-y-4">
                    <div className="animate-spin">
                      <Gift className="h-24 w-24 mx-auto text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">Se deschide cutia...</div>
                      <div className="text-sm text-muted-foreground">Pregătește-te pentru surpriză!</div>
                    </div>
                  </div>
                )}

                {showRewards && openedItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">Felicitări!</div>
                      <div className="text-sm text-muted-foreground">Ai primit:</div>
                    </div>
                    
                    <div className="space-y-3">
                      {openedItems.map((item, index) => {
                        const rarityConfig_item = rarityConfig[item.rarity];
                        const RarityIcon = getRarityIcon(item.rarity);
                        const TypeIcon = getTypeIcon(item.type);
                        
                        return (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border-2 ${rarityConfig_item.bgColor} ${rarityConfig_item.borderColor} animate-pulse`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <TypeIcon className="h-8 w-8 text-foreground" />
                                <RarityIcon className={`h-4 w-4 absolute -top-1 -right-1 ${rarityConfig_item.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                                <Badge variant="outline" className={`mt-1 ${rarityConfig_item.color}`}>
                                  {rarityConfig_item.label}
                                </Badge>
                              </div>
                              {item.value > 0 && (
                                <div className="text-right">
                                  <div className="font-bold text-primary">+{item.value}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.type === "xp_boost" ? "XP" : ""}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button 
                      onClick={() => {
                        setShowRewards(false);
                        setOpenedItems([]);
                      }}
                      className="w-full"
                    >
                      Excelent!
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-xs text-muted-foreground">
            {type === "level" 
              ? "Primești o cutie la fiecare 5 nivele" 
              : "Primești o cutie la fiecare 5 obiective complete"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}