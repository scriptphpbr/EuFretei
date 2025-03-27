import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User } from "lucide-react";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  freightId: number;
  driverId: number;
  driverName: string;
  driverImage?: string;
  onRatingComplete?: () => void;
}

const RatingModal = ({ 
  open, 
  onOpenChange, 
  freightId, 
  driverId, 
  driverName, 
  driverImage,
  onRatingComplete
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  
  const ratingMutation = useMutation({
    mutationFn: async (data: { freightId: number, driverId: number, rating: number, comment: string }) => {
      const res = await apiRequest("POST", "/api/ratings", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar o motorista!",
      });
      // Reset form
      setRating(0);
      setComment("");
      // Close modal
      onOpenChange(false);
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/freights/user"] });
      if (onRatingComplete) {
        onRatingComplete();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Avaliação requerida",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }
    
    ratingMutation.mutate({
      freightId,
      driverId,
      rating,
      comment
    });
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avalie seu motorista</DialogTitle>
          <DialogDescription>
            Sua avaliação ajuda outros usuários a escolherem os melhores motoristas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <Avatar className="h-20 w-20 mx-auto border-2 border-primary">
            <AvatarImage src={driverImage} />
            <AvatarFallback className="bg-primary text-white">
              {getInitials(driverName)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg mt-2">{driverName}</h3>
          <p className="text-gray-500">Frete #{freightId}</p>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="mb-2">Como foi sua experiência?</p>
            <div 
              className="flex justify-center text-3xl gap-1"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer h-8 w-8 transition-all ${
                    (hoveredRating >= star || rating >= star)
                      ? "fill-amber-500 text-amber-500" 
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rating === 1 && "Ruim"}
              {rating === 2 && "Regular"}
              {rating === 3 && "Bom"}
              {rating === 4 && "Muito Bom"}
              {rating === 5 && "Excelente"}
            </p>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Conte sobre sua experiência..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={rating === 0 || ratingMutation.isPending}
          >
            {ratingMutation.isPending ? "Enviando..." : "Enviar avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
