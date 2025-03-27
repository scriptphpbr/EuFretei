import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Package, 
  Calendar, 
  Info, 
  Check, 
  Loader2 
} from "lucide-react";

interface PendingFreightCardProps {
  freight: {
    id: number;
    pickupAddress: string;
    deliveryAddress: string;
    date: string;
    time: string;
    packageType: string;
    amount: number;
    createdAt: string;
    user?: {
      name: string;
    };
  };
  onAccept: () => void;
  isPending: boolean;
}

const PendingFreightCard = ({ freight, onAccept, isPending }: PendingFreightCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  
  // Format package type
  const formatPackageType = (type: string) => {
    const types: { [key: string]: string } = {
      documents: "Documentos",
      small: "Pequenos volumes",
      medium: "Volumes médios",
      large: "Volumes grandes",
      furniture: "Móveis",
      other: "Outros"
    };
    
    return types[type] || type;
  };
  
  // Calculate time since requested
  const getTimeSinceRequested = (dateString: string) => {
    if (!dateString) return "recentemente";
    
    const requestDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - requestDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "agora mesmo";
    if (diffMins < 60) return `há ${diffMins} minutos`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `há ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays} dias`;
  };
  
  // Calculate expiry time (for demo purposes, 30 minutes from request time)
  const getExpiryTime = (dateString: string) => {
    if (!dateString) return "15 minutos";
    
    const requestDate = new Date(dateString);
    const expiryDate = new Date(requestDate.getTime() + 30 * 60 * 1000); // 30 minutes
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return "expirado";
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} minutos`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} horas`;
  };
  
  return (
    <Card className="overflow-hidden border-primary border-2">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between mb-4 flex-wrap">
            <div>
              <div className="font-semibold text-lg">Frete #{freight.id}</div>
              <div className="text-gray-600">
                Solicitado {getTimeSinceRequested(freight.createdAt)}
              </div>
            </div>
            <div className="bg-green-100 text-primary px-3 py-1 rounded-full flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>Expira em {getExpiryTime(freight.createdAt)}</span>
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
              <div className="text-sm text-gray-600">Data</div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(freight.date)}, {freight.time}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tipo de carga</div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-primary" />
                <span>{formatPackageType(freight.packageType)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Valor do frete</div>
              <div className="font-bold text-xl">R$ {freight.amount.toFixed(2)}</div>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                disabled={isPending}
              >
                <Info className="h-4 w-4" /> Detalhes
              </Button>
              <Button 
                variant="default" 
                className="flex items-center gap-1"
                onClick={onAccept}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Aceitar frete
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

export default PendingFreightCard;
