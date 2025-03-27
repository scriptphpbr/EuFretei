import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Truck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DriverCardProps {
  driver: {
    id: number;
    name: string;
    profileImage: string;
    averageRating: number;
    totalRatings: number;
    vehicleModel: string;
    location: string;
    isAvailable: boolean;
    isHighlighted?: boolean;
  };
}

const DriverCard = ({ driver }: DriverCardProps) => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="fill-amber-500 text-amber-500 h-4 w-4" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300 h-4 w-4" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-amber-500 text-amber-500 h-4 w-4" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-4 w-4" />);
      }
    }
    
    return stars;
  };
  
  const handleRequestFreight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate("/auth");
    } else {
      navigate(`/freight/request/${driver.id}`);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/driver/${driver.id}`);
  };
  
  return (
    <Card 
      className="driver-card bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
          {driver.profileImage ? (
            <img 
              src={driver.profileImage} 
              alt={`Foto do motorista ${driver.name}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <i className="fas fa-user text-2xl"></i>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{driver.name}</h3>
              {driver.isHighlighted && (
                <span className="ml-1 text-amber-500" title="Motorista em destaque">
                  🌟
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {renderStars(driver.averageRating)}
              <span className="ml-1 text-gray-600 font-medium">
                {driver.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-primary" /> 
              {driver.vehicleModel}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" /> 
              {driver.location}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge 
              variant={driver.isAvailable ? "default" : "secondary"}
              className={`text-sm px-2 py-1 rounded-full ${
                driver.isAvailable 
                  ? "bg-green-100 text-primary" 
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${driver.isAvailable ? "bg-primary" : "bg-amber-500"}`}></div>
                <span>{driver.isAvailable ? "Disponível agora" : "Indisponível"}</span>
              </div>
            </Badge>
            <Button
              onClick={handleRequestFreight}
              disabled={!driver.isAvailable}
              className="text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Solicitar frete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DriverCard;
