import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import DriverSidebar from "@/components/driver-sidebar";
import DriverMobileMenu from "@/components/driver-mobile-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, ArrowRight, CreditCard, Medal, ShieldCheck, ChevronsUp, X } from "lucide-react";

type Plan = {
  id: number;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
};

type HighlightPlan = {
  id: number;
  name: string;
  days: number;
  price: number;
  description: string;
};

const subscriptionPlans: Plan[] = [
  {
    id: 1,
    name: "Básico",
    price: 79.99,
    interval: "mês",
    description: "Plano básico para motoristas",
    features: [
      "Aceitação de fretes",
      "Visualização de solicitações pendentes",
      "Suporte por e-mail"
    ]
  },
  {
    id: 2,
    name: "Premium",
    price: 149.99,
    interval: "mês",
    description: "Plano ideal para motoristas regulares",
    popular: true,
    features: [
      "Aceitação prioritária de fretes",
      "Visualização de solicitações pendentes",
      "Suporte por WhatsApp",
      "Destaque no resultado de busca",
      "Mais visibilidade para os clientes"
    ]
  },
  {
    id: 3,
    name: "Profissional",
    price: 219.99,
    interval: "mês",
    description: "Plano completo para profissionais",
    features: [
      "Aceitação prioritária de fretes",
      "Visualização de solicitações pendentes",
      "Suporte prioritário 24/7",
      "Destaque máximo no resultado de busca",
      "Análise de desempenho mensal",
      "Acesso a clientes preferenciais",
      "Zero taxa sobre fretes adicionais"
    ]
  }
];

const highlightPlans: HighlightPlan[] = [
  {
    id: 1,
    name: "Destaque 5 dias",
    days: 5,
    price: 25,
    description: "Perfil destacado por 5 dias"
  },
  {
    id: 2,
    name: "Destaque 10 dias",
    days: 10,
    price: 50,
    description: "Perfil destacado por 10 dias"
  },
  {
    id: 3,
    name: "Destaque 30 dias",
    days: 30,
    price: 150,
    description: "Perfil destacado por 30 dias"
  }
];

const DriverPlans = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | HighlightPlan | null>(null);
  const [paymentType, setPaymentType] = useState<'subscription' | 'highlight'>('subscription');
  const [activeTab, setActiveTab] = useState<string>("subscriptions");

  // Busca assinaturas ativas do motorista (se houver)
  const { data: driverSubscriptions, isLoading: loadingSubscriptions } = useQuery({
    queryKey: ["/api/driver/subscriptions"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/driver/subscriptions");
        if (!res.ok) throw new Error("Erro ao carregar assinaturas");
        return await res.json();
      } catch (error) {
        // Se o endpoint ainda não existir, retornamos um array vazio por enquanto
        return [];
      }
    }
  });

  // Busca destaques ativos do motorista (se houver)
  const { data: driverHighlights, isLoading: loadingHighlights } = useQuery({
    queryKey: ["/api/driver/highlights"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/driver/highlights");
        if (!res.ok) throw new Error("Erro ao carregar destaques");
        return await res.json();
      } catch (error) {
        // Se o endpoint ainda não existir, retornamos um array vazio por enquanto
        return [];
      }
    }
  });

  // Mutação para processar o pagamento
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      // Aqui simularemos o processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Na implementação real, você faria uma chamada à API aqui
      // const res = await apiRequest("POST", "/api/payments", paymentData);
      // return await res.json();
      
      // Por enquanto, vamos simular o sucesso do pagamento
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso!",
        variant: "default"
      });
      
      // Invalidar as queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ["/api/driver/subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver/highlights"] });
      
      // Fechar o diálogo de pagamento
      setOpenPaymentDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive"
      });
    }
  });

  const handlePlanSelection = (plan: Plan | HighlightPlan, type: 'subscription' | 'highlight') => {
    setSelectedPlan(plan);
    setPaymentType(type);
    setOpenPaymentDialog(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    processPaymentMutation.mutate({
      planId: selectedPlan.id,
      planType: paymentType,
      amount: selectedPlan.price,
      userId: user?.id
    });
  };

  const pixCode = "00020126840014br.gov.bcb.pix01366fe86e3e-0239-4a3b-8bd7-de223aed8db90222Deposito para Coinbase5204000053039865802BR5925Roberto Carlos Ribeiro da6007Goiania62240520JNPX0C6BD38D8E000AAE6304AA9D";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar 
        onMenuClick={() => setShowMobileMenu(true)}
      />
      
      <div className="flex flex-1">
        {!isMobile && (
          <DriverSidebar onLogout={() => logoutMutation.mutate()} />
        )}
        
        <main className="flex-1 bg-gray-50 pt-16 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Planos e Assinaturas</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie suas assinaturas e destaques para aumentar sua visibilidade
              </p>
            </div>
            
            <Tabs defaultValue="subscriptions" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="subscriptions">Planos de Assinatura</TabsTrigger>
                <TabsTrigger value="highlights">Destaques</TabsTrigger>
                <TabsTrigger value="active">Assinaturas Ativas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-md relative' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          Popular
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-bold">R${plan.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">/{plan.interval}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                          onClick={() => handlePlanSelection(plan, 'subscription')}
                        >
                          Assinar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="highlights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {highlightPlans.map((plan) => (
                    <Card key={plan.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <CardTitle>{plan.name}</CardTitle>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-bold">R${plan.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500"> (R${(plan.price / plan.days).toFixed(2)}/dia)</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Star className="h-5 w-5 text-yellow-400 mr-2 shrink-0" />
                            <span className="text-sm">Perfil destacado nas buscas</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronsUp className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                            <span className="text-sm">Maior visibilidade</span>
                          </li>
                          <li className="flex items-start">
                            <Medal className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
                            <span className="text-sm">Badge de destaque no perfil</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handlePlanSelection(plan, 'highlight')}
                        >
                          Destacar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Assinaturas Ativas</CardTitle>
                      <CardDescription>Veja suas assinaturas ativas e gerencia-as</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingSubscriptions ? (
                        <div className="py-4 text-center text-gray-500">Carregando assinaturas...</div>
                      ) : driverSubscriptions?.length > 0 ? (
                        <div className="space-y-4">
                          {driverSubscriptions.map((sub: any) => (
                            <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h3 className="font-medium">{sub.planName}</h3>
                                <p className="text-sm text-gray-500">
                                  R${sub.amount.toFixed(2)}/mês • Próximo pagamento: {new Date(sub.nextPaymentDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={sub.status === 'active' ? 'default' : 'outline'}>
                                {sub.status === 'active' ? 'Ativa' : 'Pendente'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <p>Você não possui assinaturas ativas.</p>
                          <Button 
                            variant="link" 
                            onClick={() => setActiveTab("subscriptions")}
                            className="mt-2"
                          >
                            Ver planos disponíveis
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>Destaques Ativos</CardTitle>
                      <CardDescription>Veja seus destaques ativos e gerencia-os</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingHighlights ? (
                        <div className="py-4 text-center text-gray-500">Carregando destaques...</div>
                      ) : driverHighlights?.length > 0 ? (
                        <div className="space-y-4">
                          {driverHighlights.map((highlight: any) => (
                            <div key={highlight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h3 className="font-medium flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-2" />
                                  {highlight.planName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Expira em: {new Date(highlight.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge>Ativo</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <p>Você não possui destaques ativos.</p>
                          <Button 
                            variant="link" 
                            onClick={() => setActiveTab("highlights")}
                            className="mt-2"
                          >
                            Ver opções de destaque
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {isMobile && (
        <DriverMobileMenu 
          isOpen={showMobileMenu} 
          onClose={() => setShowMobileMenu(false)}
          onLogout={() => logoutMutation.mutate()}
        />
      )}
      
      <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pagamento - {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription>
              {paymentType === 'subscription' 
                ? 'Realize o pagamento para ativar sua assinatura' 
                : 'Realize o pagamento para destacar seu perfil'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 mb-2">Valor a pagar:</p>
              <p className="text-2xl font-bold">R$ {selectedPlan?.price.toFixed(2)}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Escaneie o QR Code para pagar:</p>
              
              <div className="bg-white p-4 rounded-lg flex flex-col items-center">
                {/* QR Code - Aqui você usaria uma biblioteca como react-qr-code */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4">
                  {/* Aqui você usaria algo como: <QRCode value={pixCode} size={180} /> */}
                  <div className="text-xs text-center text-gray-400 p-4">
                    QR Code do PIX<br/>
                    (Simulado para demonstração)
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-2"
                  onClick={() => {
                    // Aqui você copiaria o código PIX para o clipboard
                    navigator.clipboard.writeText(pixCode);
                    toast({
                      title: "Código copiado",
                      description: "Código PIX copiado para a área de transferência",
                    });
                  }}
                >
                  Copiar código PIX
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  Após o pagamento, seu plano será ativado em instantes
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setOpenPaymentDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handlePayment} disabled={processPaymentMutation.isPending}>
                {processPaymentMutation.isPending ? "Processando..." : "Confirmar Pagamento"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverPlans;