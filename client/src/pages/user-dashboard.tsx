import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import RatingModal from "@/components/rating-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Package, 
  MoreHorizontal,
  ArrowRight,
  Star,
  LocateFixed,
  PhoneCall,
  Check,
  X,
  Edit,
  Redo,
  Loader2,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDashboard = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [ratingFreight, setRatingFreight] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Get dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/user/dashboard"],
    enabled: !!user,
  });
  
  // Get freights
  const { data: freights, isLoading: freightsLoading } = useQuery({
    queryKey: ["/api/freights/user"],
    enabled: !!user,
  });
  
  // Filter freights by status
  const activeFreights = freights?.filter(
    (freight) => freight.status === "pending" || freight.status === "accepted"
  );
  
  const historyFreights = freights?.filter(
    (freight) => freight.status === "completed" || freight.status === "canceled"
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  
  // Open rating modal
  const handleOpenRatingModal = (freight: any) => {
    setRatingFreight(freight);
    setShowRatingModal(true);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
            Aguardando
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
            Em andamento
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
            Concluído
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard do Usuário</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user?.name || "Usuário"}!</p>
            </div>
            
            <Button 
              onClick={() => navigate("/")}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Novo Frete
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="text-gray-600 mb-1">Fretes realizados</div>
                <div className="text-3xl font-bold">
                  {dashboardLoading ? (
                    <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    dashboardData?.stats.totalFreights || 0
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="text-gray-600 mb-1">Fretes em andamento</div>
                <div className="text-3xl font-bold">
                  {dashboardLoading ? (
                    <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    dashboardData?.stats.activeFreights || 0
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="text-gray-600 mb-1">Valor gasto</div>
                <div className="text-3xl font-bold text-primary">
                  {dashboardLoading ? (
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    `R$ ${(dashboardData?.stats.totalSpent || 0).toFixed(2)}`
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Become Driver Card */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-orange-400 to-amber-500 text-white">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Torne-se um Motorista Parceiro</h3>
                  <p className="mb-4">Ganhe dinheiro extra usando seu veículo para realizar fretes na plataforma</p>
                </div>
                <Button 
                  onClick={() => navigate("/partners")} 
                  variant="secondary" 
                  className="bg-white text-orange-500 hover:bg-orange-50"
                >
                  Seja Motorista
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs Section */}
          <div className="mb-6">
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b border-gray-200 w-full justify-start rounded-none bg-transparent mb-4">
                <TabsTrigger 
                  value="active" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                >
                  Fretes Ativos
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                >
                  Histórico
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                >
                  Perfil e Configurações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {freightsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : activeFreights && activeFreights.length > 0 ? (
                  <div className="space-y-4">
                    {activeFreights.map((freight) => (
                      <Card key={freight.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-5">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <div className="font-semibold text-lg">Frete #{freight.id}</div>
                                <div className="text-gray-600">
                                  Programado para {formatDate(freight.date)}, {freight.time}
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0">
                                {getStatusBadge(freight.status)}
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                                <div className="text-sm text-gray-600">Motorista</div>
                                {freight.driver ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={freight.driver.profileImage} />
                                      <AvatarFallback className="bg-primary text-white text-xs">
                                        {freight.driver.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{freight.driver.name}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Aguardando motorista</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center">
                              <div className="font-bold text-xl">R$ {freight.amount.toFixed(2)}</div>
                              <div className="flex gap-2 mt-3 md:mt-0">
                                {freight.status === "accepted" && (
                                  <>
                                    <Button variant="outline" className="flex items-center gap-1">
                                      <LocateFixed className="h-4 w-4" /> Rastrear
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-1">
                                      <PhoneCall className="h-4 w-4" /> Contatar
                                    </Button>
                                  </>
                                )}
                                
                                {freight.status === "pending" && (
                                  <>
                                    <Button 
                                      variant="destructive" 
                                      className="flex items-center gap-1"
                                    >
                                      <X className="h-4 w-4" /> Cancelar
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="flex items-center gap-1"
                                    >
                                      <Edit className="h-4 w-4" /> Editar
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum frete ativo</h3>
                    <p className="text-gray-600 mb-4">Você não tem fretes ativos no momento.</p>
                    <Button onClick={() => navigate("/")}>Solicitar um Frete</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                {freightsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : historyFreights && historyFreights.length > 0 ? (
                  <div className="space-y-4">
                    {historyFreights.map((freight) => (
                      <Card key={freight.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-5">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <div className="font-semibold text-lg">Frete #{freight.id}</div>
                                <div className="text-gray-600">
                                  Realizado em {formatDate(freight.date)}
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0">
                                {getStatusBadge(freight.status)}
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                                <div className="text-sm text-gray-600">Motorista</div>
                                {freight.driver ? (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={freight.driver.profileImage} />
                                      <AvatarFallback className="bg-primary text-white text-xs">
                                        {freight.driver.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{freight.driver.name}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Não atribuído</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center">
                              <div className="font-bold text-xl">R$ {freight.amount.toFixed(2)}</div>
                              <div className="flex gap-2 mt-3 md:mt-0">
                                {freight.status === "completed" && freight.driver && (
                                  <>
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-5 w-5 ${
                                            i < (freight.rating || 0)
                                              ? "fill-amber-500 text-amber-500"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    
                                    {!freight.rating && (
                                      <Button 
                                        variant="outline" 
                                        className="flex items-center gap-1"
                                        onClick={() => handleOpenRatingModal(freight)}
                                      >
                                        <Star className="h-4 w-4" /> Avaliar
                                      </Button>
                                    )}
                                    
                                    <Button 
                                      className="flex items-center gap-1"
                                      onClick={() => navigate(`/freight/request/${freight.driver.id}`)}
                                    >
                                      <Redo className="h-4 w-4" /> Repetir
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum histórico de frete</h3>
                    <p className="text-gray-600 mb-4">Você ainda não possui histórico de fretes.</p>
                    <Button onClick={() => navigate("/")}>Solicitar um Frete</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4">Perfil</h3>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="flex flex-col items-center">
                          <Avatar className="w-32 h-32">
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback className="bg-primary text-white text-4xl">
                              {user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="link" className="mt-4">Alterar foto</Button>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-600 mb-2">Nome</label>
                            <input 
                              type="text" 
                              value={user?.name || ""} 
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 mb-2">Email</label>
                            <input 
                              type="email" 
                              value={user?.email || ""} 
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 mb-2">Telefone</label>
                            <input 
                              type="tel" 
                              value={user?.phone || ""} 
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 mb-2">Usuário</label>
                            <input 
                              type="text" 
                              value={user?.username || ""} 
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <Button className="mt-6">
                          Editar Perfil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Rating Modal */}
      {ratingFreight && (
        <RatingModal
          open={showRatingModal}
          onOpenChange={setShowRatingModal}
          freightId={ratingFreight.id}
          driverId={ratingFreight.driver?.id}
          driverName={ratingFreight.driver?.name}
          driverImage={ratingFreight.driver?.profileImage}
        />
      )}
    </div>
  );
};

export default UserDashboard;
