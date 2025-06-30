import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { CardReward } from "@shared/schema";

interface RewardModalProps {
  reward: CardReward;
  userId: number;
  onClose: () => void;
}

export default function RewardModal({ reward, userId, onClose }: RewardModalProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const collectCardMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cards/collect", {
        userId,
        cardId: reward.card.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/rewards/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cards/${userId}`] });
      
      toast({
        title: "Carte colectată!",
        description: `Ai adăugat "${reward.card.name}" în colecția ta.`,
      });
      
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Nu am putut colecta cartea. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-transcend-amber to-orange-500';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Comună';
      case 'uncommon': return 'Neobișnuită';
      case 'rare': return 'Rară';
      case 'epic': return 'Epică';
      case 'legendary': return 'Legendară';
      default: return 'Comună';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
          <div className="text-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-transcend-amber/20 mb-4">
              <Gift className="h-8 w-8 text-transcend-amber" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Carte Recompensă!</h3>
            <p className="text-gray-600 mb-6">
              Ai deblocat o carte specială pentru progresul tău!
            </p>
            
            <div className={`bg-gradient-to-r ${getRarityColor(reward.card.rarity)} rounded-xl p-4 mb-6`}>
              <div className="text-white">
                <h4 className="font-bold text-lg">{reward.card.name}</h4>
                <p className="text-sm opacity-90">
                  Raritate: {getRarityText(reward.card.rarity)}
                </p>
                <p className="text-xs mt-2 italic">
                  "{reward.card.description}"
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => collectCardMutation.mutate()}
                disabled={collectCardMutation.isPending}
                className="flex-1 bg-transcend-green hover:bg-green-600"
              >
                {collectCardMutation.isPending ? "Se colectează..." : "Colectează"}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Închide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
