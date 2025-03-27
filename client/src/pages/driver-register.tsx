import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { driverRegistrationSchema } from "@shared/schema";
import { Truck, Upload, ArrowLeft } from "lucide-react";

const DriverRegistration = () => {
  const [, navigate] = useLocation();
  const { user, registerDriverMutation } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Pre-fill form with user data if available
  const form = useForm<z.infer<typeof driverRegistrationSchema>>({
    resolver: zodResolver(driverRegistrationSchema),
    defaultValues: {
      username: user?.username || "",
      password: "",
      confirmPassword: "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      vehicleModel: "",
      licensePlate: "",
      vehicleType: "",
      location: "",
      document: ""
    },
  });
  
  const onSubmit = (data: z.infer<typeof driverRegistrationSchema>) => {
    if (!agreedToTerms) {
      return;
    }
    
    registerDriverMutation.mutate(data, {
      onSuccess: () => {
        navigate("/driver/dashboard");
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Home
          </Button>
          
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Torne-se um Motorista</CardTitle>
              </div>
              <CardDescription>
                Preencha seus dados e comece a receber solicitações de frete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Dados Pessoais</h3>
                      <p className="text-sm text-gray-500">Informe seus dados pessoais para criar sua conta</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuário</FormLabel>
                            <FormControl>
                              <Input placeholder="seu.usuario" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 98765-4321" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Dados do Veículo</h3>
                      <p className="text-sm text-gray-500">Informe os dados do seu veículo</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vehicleModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo do Veículo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Fiorino Furgão 2020" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placa do Veículo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: ABC1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Veículo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de veículo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Small Van">Furgão Pequeno</SelectItem>
                                <SelectItem value="Medium Van">Furgão Médio</SelectItem>
                                <SelectItem value="Truck">Caminhão</SelectItem>
                                <SelectItem value="Box Truck">Baú</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localização Principal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione sua localização" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="São Paulo, SP">São Paulo, SP</SelectItem>
                                <SelectItem value="Rio de Janeiro, RJ">Rio de Janeiro, RJ</SelectItem>
                                <SelectItem value="Belo Horizonte, MG">Belo Horizonte, MG</SelectItem>
                                <SelectItem value="Curitiba, PR">Curitiba, PR</SelectItem>
                                <SelectItem value="Salvador, BA">Salvador, BA</SelectItem>
                                <SelectItem value="Brasília, DF">Brasília, DF</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Documentação</h3>
                      <p className="text-sm text-gray-500">Informe seus documentos para verificação</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="document"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número da CNH</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 12345678990" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="border border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium mb-1">Arraste e solte ou clique para upload</p>
                        <p className="text-xs text-gray-500">Foto da CNH, documentos do veículo e foto do veículo</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Selecionar Arquivos
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceito os termos e condições
                      </label>
                      <p className="text-sm text-gray-500">
                        Ao se cadastrar, você concorda com nossos termos de serviço e política de privacidade.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!agreedToTerms || registerDriverMutation.isPending}
                  >
                    {registerDriverMutation.isPending ? "Cadastrando..." : "Cadastrar como Motorista"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverRegistration;
