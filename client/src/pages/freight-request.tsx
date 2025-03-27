import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import FreightForm from "@/components/freight-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, MapPin, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const FreightRequest = () => {
  const { driverId } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: driver, isLoading } = useQuery({
    queryKey: [`/api/drivers/${driverId}`],
    enabled: !!driverId,
  });
  
  // Create freight mutation
  const createFreightMutation = useMutation({
    mutationFn: async (freightData: any) => {
      const res = await apiRequest("POST", "/api/freights", {
        ...freightData,
        driverId: parseInt(driverId)
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Você será redirecionado para o pagamento.",
      });
      navigate(`/freight/payment/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao solicitar frete",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
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
  
  const handleFormSubmit = (data: any) => {
    createFreightMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          ) : driver ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Solicitar Frete
                  </CardTitle>
                  <CardDescription>
                    Preencha os detalhes do frete para enviar a solicitação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {driver.profileImage ? (
                          <img 
                            src={driver.profileImage} 
                            alt={driver.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(driver.averageRating)}
                        <span className="ml-1 text-gray-600 text-sm">
                          {driver.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Truck className="h-3 w-3 text-primary" />
                        <span>{driver.vehicleModel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{driver.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <FreightForm onSubmit={handleFormSubmit} isPending={createFreightMutation.isPending} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Motorista não encontrado</CardTitle>
                <CardDescription>
                  O motorista solicitado não foi encontrado ou não está mais disponível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/")}>Voltar para Home</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default FreightRequest;
