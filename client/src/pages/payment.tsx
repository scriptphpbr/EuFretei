import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Banknote, Truck, MapPin, Package, Calendar, Clock, Loader2, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RatingModal from "@/components/rating-modal";

const Payment = () => {
  const { freightId } = useParams();
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Get freight data
  const { data: freight, isLoading } = useQuery({
    queryKey: [`/api/freights/${freightId}`],
    enabled: !!freightId,
  });
  
  // Get driver data if available
  const { data: driver, isLoading: driverLoading } = useQuery({
    queryKey: freight?.driverId ? [`/api/drivers/${freight.driverId}`] : null,
    enabled: !!freight?.driverId,
  });
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Process payment (mock)
  const processPayment = () => {
    setIsProcessing(true);
    
    // Validate form
    if (paymentMethod === "credit") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todas as informações do cartão.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Seu frete foi confirmado.",
      });
      
      // Show rating modal after delay
      setTimeout(() => {
        if (freight?.driverId) {
          setShowRatingModal(true);
        }
      }, 2000);
    }, 2000);
  };
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6"
            disabled={isProcessing}
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
          ) : freight ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {paymentComplete ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Pagamento Confirmado
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 text-primary" />
                          Pagamento
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {paymentComplete 
                        ? "Seu pagamento foi processado com sucesso!" 
                        : "Escolha o método de pagamento para finalizar seu frete"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentComplete ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Pagamento Confirmado</h2>
                        <p className="text-gray-600 mb-4">
                          Seu pagamento de R$ {freight.amount.toFixed(2)} foi processado com sucesso!
                        </p>
                        
                        {freight.driverId ? (
                          <p className="text-gray-600">
                            O motorista foi notificado e entrará em contato em breve.
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            Estamos buscando um motorista para seu frete. Você receberá uma notificação quando um motorista aceitar.
                          </p>
                        )}
                        
                        <Button
                          onClick={() => navigate("/dashboard")}
                          className="mt-6"
                        >
                          Ir para o Dashboard
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <RadioGroup 
                          defaultValue="credit" 
                          value={paymentMethod} 
                          onValueChange={setPaymentMethod}
                        >
                          <div className="flex items-center space-x-2 border p-4 rounded-lg">
                            <RadioGroupItem value="credit" id="credit" />
                            <Label htmlFor="credit" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <span>Cartão de Crédito</span>
                              </div>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 border p-4 rounded-lg">
                            <RadioGroupItem value="money" id="money" />
                            <Label htmlFor="money" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-primary" />
                                <span>Dinheiro na entrega</span>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                        
                        {paymentMethod === "credit" && (
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="cardNumber">Número do Cartão</Label>
                              <Input
                                id="cardNumber"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="cardName">Nome no Cartão</Label>
                              <Input
                                id="cardName"
                                placeholder="Nome como está no cartão"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="cardExpiry">Validade</Label>
                                <Input
                                  id="cardExpiry"
                                  placeholder="MM/AA"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                                  maxLength={5}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="cardCVC">CVC</Label>
                                <Input
                                  id="cardCVC"
                                  placeholder="123"
                                  value={cardCVC}
                                  onChange={(e) => setCardCVC(e.target.value)}
                                  maxLength={3}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          onClick={processPayment} 
                          className="w-full" 
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processando...
                            </span>
                          ) : (
                            `Pagar R$ ${freight.amount.toFixed(2)}`
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Frete</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">De</div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span>{freight.pickupAddress}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500">Para</div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span>{freight.deliveryAddress}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Data</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(freight.date)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Hora</div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{freight.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500">Tipo de Carga</div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span>{formatPackageType(freight.packageType)}</span>
                      </div>
                    </div>
                    
                    {freight.instructions && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Instruções</div>
                        <p className="text-sm">{freight.instructions}</p>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {freight.driverId && driver && !driverLoading ? (
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Motorista</div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            {driver.profileImage ? (
                              <img 
                                src={driver.profileImage} 
                                alt={driver.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-gray-500">{driver.vehicleModel}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Um motorista será designado após o pagamento.
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">R$ {freight.amount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Frete não encontrado</CardTitle>
                <CardDescription>
                  O frete solicitado não foi encontrado ou não está mais disponível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/")}>Voltar para Home</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Rating Modal */}
      {driver && freight && (
        <RatingModal
          open={showRatingModal}
          onOpenChange={setShowRatingModal}
          freightId={parseInt(freightId)}
          driverId={freight.driverId || 0}
          driverName={driver.name}
          driverImage={driver.profileImage}
          onRatingComplete={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
};

export default Payment;
