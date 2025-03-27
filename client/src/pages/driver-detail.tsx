import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Star, Truck, MapPin, Phone, Mail, ArrowLeft, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DriverDetail = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: driver, isLoading } = useQuery({
    queryKey: [`/api/drivers/${id}`],
    enabled: !!id,
  });
  
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: [`/api/ratings/driver/${id}`],
    enabled: !!id,
  });
  
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="fill-amber-500 text-amber-500 h-5 w-5" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300 h-5 w-5" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-amber-500 text-amber-500 h-5 w-5" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-5 w-5" />);
      }
    }
    
    return stars;
  };
  
  const handleRequestFreight = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate(`/freight/request/${id}`);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-8">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-48" />
                  </div>
                </div>
              </div>
            </div>
          ) : driver ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Driver Info Card */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                  <div>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-primary">
                      {driver.profileImage ? (
                        <img 
                          src={driver.profileImage} 
                          alt={driver.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Badge variant={driver.isAvailable ? "default" : "secondary"}>
                        {driver.isAvailable ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <h1 className="text-2xl font-bold">{driver.name}</h1>
                      <div className="flex items-center gap-1 mt-2 md:mt-0">
                        {renderStars(driver.averageRating)}
                        <span className="ml-1 text-gray-600 font-medium">
                          {driver.averageRating.toFixed(1)} ({driver.totalRatings} avaliações)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>{driver.vehicleModel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{driver.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{driver.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={handleRequestFreight}
                        disabled={!driver.isAvailable}
                      >
                        Solicitar Frete
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                      <Calendar className="h-4 w-4 mr-2" /> Segunda a Sexta
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Clock className="h-4 w-4 mr-2" /> 8h às 18h
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Ratings Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Avaliações</h2>
                
                {ratingsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : ratings && ratings.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            {rating.user?.profileImage ? (
                              <img 
                                src={rating.user.profileImage} 
                                alt={rating.user.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{rating.user?.name || "Usuário"}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="ml-auto flex">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-gray-600">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Ainda não há avaliações para este motorista.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
              <div className="text-gray-400 mb-4">
                <Truck className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Motorista não encontrado</h2>
              <p className="text-gray-600 mb-4">O motorista que você está procurando não existe ou foi removido.</p>
              <Button onClick={() => navigate("/")}>Voltar para Home</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverDetail;
