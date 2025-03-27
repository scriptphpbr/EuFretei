import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import DriverSidebar from "@/components/driver-sidebar";
import DriverMobileMenu from "@/components/driver-mobile-menu";
import PendingFreightCard from "@/components/pending-freight-card";
import FreightCard from "@/components/freight-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Menu, 
  Truck, 
  Wallet, 
  Star, 
  Medal,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DriverDashboard = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Fetch driver dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/driver/dashboard"],
    enabled: !!user,
  });
  
  // Fetch pending freights
  const { data: pendingFreights, isLoading: pendingFreightsLoading } = useQuery({
    queryKey: ["/api/freights/pending"],
    enabled: !!user && user.role === "driver",
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  // Fetch driver's freights
  const { data: driverFreights, isLoading: driverFreightsLoading } = useQuery({
    queryKey: ["/api/freights/driver"],
    enabled: !!user && user.role === "driver",
  });
  
  // Filter freights by status
  const inProgressFreights = driverFreights?.filter(freight => freight.status === "accepted") || [];
  const completedFreights = driverFreights?.filter(freight => freight.status === "completed") || [];
  
  // Accept freight mutation
  const acceptFreightMutation = useMutation({
    mutationFn: async (freightId: number) => {
      const res = await apiRequest("PUT", `/api/freights/${freightId}/accept`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Frete aceito com sucesso!",
        description: "O cliente foi notificado.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/freights/driver"] });
      queryClient.invalidateQueries({ queryKey: ["/api/freights/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao aceitar frete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Complete freight mutation
  const completeFreightMutation = useMutation({
    mutationFn: async (freightId: number) => {
      const res = await apiRequest("PUT", `/api/freights/${freightId}/complete`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Frete completado com sucesso!",
        description: "O valor foi adicionado à sua conta.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/freights/driver"] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver/dashboard"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao completar frete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle accept freight
  const handleAcceptFreight = (freightId: number) => {
    acceptFreightMutation.mutate(freightId);
  };
  
  // Handle complete freight
  const handleCompleteFreight = (freightId: number) => {
    completeFreightMutation.mutate(freightId);
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "D";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for desktop */}
      <DriverSidebar 
        onLogout={handleLogout} 
        newFreights={pendingFreights?.length || 0} 
      />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl">
              <Truck className="h-6 w-6" />
            </span>
            <span className="font-bold text-lg">FreteJá</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(true)}
            className="text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <DriverMobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onLogout={handleLogout}
        newFreights={pendingFreights?.length || 0}
      />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {dashboardLoading ? (
              <span>Carregando dados...</span>
            ) : (
              <>Bem-vindo de volta, {dashboardData?.driverInfo?.name || user?.name}! Aqui está o resumo da sua atividade.</>
            )}
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-600 mb-1">Saldo disponível</div>
                  <div className="text-3xl font-bold text-primary">
                    {dashboardLoading ? (
                      <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      `R$ ${(dashboardData?.stats?.balance || 0).toFixed(2)}`
                    )}
                  </div>
                </div>
                <span className="text-primary text-3xl">
                  <Wallet className="h-8 w-8" />
                </span>
              </div>
              <Button 
                className="mt-4"
                size="sm"
              >
                Sacar
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-600 mb-1">Fretes realizados</div>
                  <div className="text-3xl font-bold">
                    {dashboardLoading ? (
                      <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      dashboardData?.stats?.totalFreights || 0
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Este mês</div>
                </div>
                <span className="text-amber-500 text-3xl">
                  <Truck className="h-8 w-8" />
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-600 mb-1">Avaliação</div>
                  <div className="text-3xl font-bold flex items-center">
                    {dashboardLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <>
                        {(dashboardData?.stats?.rating || 0).toFixed(1)} 
                        <span className="text-amber-500 ml-2 text-xl">
                          <Star className="h-6 w-6 fill-amber-500" />
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {dashboardLoading ? (
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      `${dashboardData?.stats?.totalRatings || 0} avaliações`
                    )}
                  </div>
                </div>
                <span className="text-amber-500 text-3xl">
                  <Medal className="h-8 w-8" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pending">
              Novos Fretes
              {pendingFreights && pendingFreights.length > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingFreights.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Em Andamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            {/* New Freights Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Novos Fretes Disponíveis</h2>
              
              {pendingFreightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingFreights && pendingFreights.length > 0 ? (
                <div className="space-y-4">
                  {pendingFreights.slice(0, 2).map((freight) => (
                    <PendingFreightCard 
                      key={freight.id}
                      freight={freight}
                      onAccept={() => handleAcceptFreight(freight.id)}
                      isPending={acceptFreightMutation.isPending}
                    />
                  ))}
                  
                  {pendingFreights.length > 2 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("pending")}
                    >
                      Ver mais {pendingFreights.length - 2} fretes disponíveis
                    </Button>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-amber-500 mb-4">
                      <Clock className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum frete disponível</h3>
                    <p className="text-gray-600">Não há novos fretes disponíveis no momento. Verifique novamente mais tarde.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Active Freights Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Fretes em Andamento</h2>
              
              {driverFreightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inProgressFreights && inProgressFreights.length > 0 ? (
                <div className="space-y-4">
                  {inProgressFreights.map((freight) => (
                    <FreightCard 
                      key={freight.id}
                      freight={freight}
                      onComplete={() => handleCompleteFreight(freight.id)}
                      isPending={completeFreightMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <Truck className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum frete em andamento</h3>
                    <p className="text-gray-600">Você não possui fretes em andamento no momento.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Novos Fretes Disponíveis</h2>
              
              {pendingFreightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingFreights && pendingFreights.length > 0 ? (
                <div className="space-y-4">
                  {pendingFreights.map((freight) => (
                    <PendingFreightCard 
                      key={freight.id}
                      freight={freight}
                      onAccept={() => handleAcceptFreight(freight.id)}
                      isPending={acceptFreightMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-amber-500 mb-4">
                      <Clock className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum frete disponível</h3>
                    <p className="text-gray-600">Não há novos fretes disponíveis no momento. Verifique novamente mais tarde.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Fretes em Andamento</h2>
              
              {driverFreightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inProgressFreights && inProgressFreights.length > 0 ? (
                <div className="space-y-4">
                  {inProgressFreights.map((freight) => (
                    <FreightCard 
                      key={freight.id}
                      freight={freight}
                      onComplete={() => handleCompleteFreight(freight.id)}
                      isPending={completeFreightMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <Truck className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum frete em andamento</h3>
                    <p className="text-gray-600">Você não possui fretes em andamento no momento.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Fretes Concluídos</h2>
              
              {driverFreightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completedFreights && completedFreights.length > 0 ? (
                <div className="space-y-4">
                  {completedFreights.map((freight) => (
                    <Card key={freight.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-5">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <div className="font-semibold text-lg">Frete #{freight.id}</div>
                              <div className="text-gray-600">
                                Concluído em {new Date(freight.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                Concluído
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">De</div>
                              <div className="flex items-start gap-1">
                                <mapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>{freight.pickupAddress}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Para</div>
                              <div className="flex items-start gap-1">
                                <mapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>{freight.deliveryAddress}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Cliente</div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary text-white text-xs">
                                    {freight.user?.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{freight.user?.name || "Cliente"}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="font-bold text-xl">R$ {freight.amount.toFixed(2)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <Truck className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum frete concluído</h3>
                    <p className="text-gray-600">Você ainda não concluiu nenhum frete.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
