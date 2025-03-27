import { useState, useRef } from "react";
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
import { Truck, Upload, ArrowLeft, File, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DriverRegistration = () => {
  const [, navigate] = useLocation();
  const { user, registerDriverMutation } = useAuth();
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: z.infer<typeof driverRegistrationSchema>) => {
    if (!agreedToTerms) {
      toast({
        title: "Termos e condições",
        description: "Você precisa aceitar os termos e condições para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "Documentos necessários",
        description: "Por favor, faça upload dos documentos necessários.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Simulando upload de arquivos
      setIsUploading(true);
      
      // Simulando envio de arquivos para o servidor
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      // Idealmente, você faria o upload real aqui:
      // const uploadResponse = await fetch('/api/upload', { 
      //   method: 'POST', 
      //   body: formData 
      // });
      
      // Simulando um delay para o upload dos arquivos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para fins de demonstração, consideraremos o upload bem-sucedido
      // e procederemos com o registro do motorista
      
      // Modifique os dados para incluir quaisquer informações relevantes sobre os arquivos
      const enhancedData = {
        ...data,
        // Se necessário, você poderia adicionar metadados sobre os arquivos aqui
        // fileCount: uploadedFiles.length,
        // fileNames: uploadedFiles.map(f => f.name).join(',')
      };
      
      // Após o upload bem sucedido, envie os dados do motorista
      registerDriverMutation.mutate(enhancedData, {
        onSuccess: () => {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você foi registrado como motorista.",
            variant: "default"
          });
          navigate("/driver/dashboard");
        },
        onError: (error) => {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Ocorreu um erro ao cadastrar seus dados.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar seus documentos.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
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
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf"
                        />
                        {uploadedFiles.length === 0 ? (
                          <>
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium mb-1">Arraste e solte ou clique para upload</p>
                            <p className="text-xs text-gray-500">Foto da CNH, documentos do veículo e foto do veículo</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => fileInputRef.current?.click()}
                              type="button"
                            >
                              Selecionar Arquivos
                            </Button>
                          </>
                        ) : (
                          <div className="w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">Arquivos selecionados</h4>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                              >
                                Adicionar mais
                              </Button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <div className="flex items-center space-x-2">
                                    <File className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0"
                                    type="button"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                    disabled={!agreedToTerms || registerDriverMutation.isPending || isUploading}
                  >
                    {registerDriverMutation.isPending || isUploading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4"
                              fill="none"
                            />
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </span>
                        {isUploading ? "Enviando arquivos..." : "Cadastrando..."}
                      </div>
                    ) : (
                      "Cadastrar como Motorista"
                    )}
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
