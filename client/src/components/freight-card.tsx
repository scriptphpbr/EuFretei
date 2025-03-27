import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  CheckCircle, 
  Loader2, 
  Route 
} from "lucide-react";

interface FreightCardProps {
  freight: {
    id: number;
    pickupAddress: string;
    deliveryAddress: string;
    date: string;
    time: string;
    amount: number;
    status: string;
    user?: {
      name: string;
      phone: string;
      profileImage?: string;
    };
  };
  onComplete: () => void;
  isPending: boolean;
}

const FreightCard = ({ freight, onComplete, isPending }: FreightCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  
  // Get user initial for avatar fallback
  const getUserInitial = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <div className="font-semibold text-lg">Frete #{freight.id}</div>
              <div className="text-gray-600">
                {formatDate(freight.date)}, {freight.time}
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
                Em andamento
              </Badge>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">De</div>
              <div className="flex items-start gap-1">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>{freight.pickupAddress}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Para</div>
              <div className="flex items-start gap-1">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>{freight.deliveryAddress}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Cliente</div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={freight.user?.profileImage} 
                    alt={freight.user?.name || "Cliente"} 
                  />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {getUserInitial(freight.user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <span>{freight.user?.name || "Cliente"}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Valor do frete</div>
              <div className="font-bold">R$ {freight.amount.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-blue-600">
              <Route className="h-4 w-4" />
              <span>Em rota para entrega</span>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                disabled={isPending}
              >
                <Phone className="h-4 w-4" /> Contatar cliente
              </Button>
              <Button 
                variant="default" 
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                onClick={onComplete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> Marcar como entregue
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightCard;
