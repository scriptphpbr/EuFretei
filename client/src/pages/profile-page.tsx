import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, FileText, Upload, Save, Loader2 } from "lucide-react";

// Schema para validação dos dados do perfil
const profileFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  postalCode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tab, setTab] = useState("personal");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null);
  const [addressDocumentFile, setAddressDocumentFile] = useState<File | null>(null);
  const [addressDocumentPreview, setAddressDocumentPreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Busca os dados do perfil do usuário
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  // Configuração do formulário
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      neighborhood: "",
      profileImage: "",
    },
  });

  // Preenche o formulário quando os dados do perfil são carregados
  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        cpf: profileData.cpf || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        postalCode: profileData.postalCode || "",
        neighborhood: profileData.neighborhood || "",
        profileImage: profileData.profileImage || "",
      });

      if (profileData.profileImage) {
        setProfileImagePreview(profileData.profileImage);
      }
    }
  }, [profileData, form]);

  // Mutation para atualizar o perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const formData = new FormData();
      
      // Adiciona os dados do perfil ao FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "profileImage") {
          formData.append(key, value);
        }
      });
      
      // Adiciona os arquivos ao FormData se existirem
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      
      if (idDocumentFile) {
        formData.append("idDocument", idDocumentFile);
      }
      
      if (addressDocumentFile) {
        formData.append("addressDocument", addressDocumentFile);
      }
      
      const response = await apiRequest("PATCH", "/api/user/profile", formData, true);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      // Invalida a query para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Busca o endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    try {
      cep = cep.replace(/\D/g, ""); // Remove caracteres não numéricos
      if (cep.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue("address", data.logradouro || "");
        form.setValue("neighborhood", data.bairro || "");
        form.setValue("city", data.localidade || "");
        form.setValue("state", data.uf || "");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Função para obter a localização do usuário
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            
            const data = await response.json();
            
            if (data.address) {
              form.setValue("address", data.address.road || "");
              form.setValue("neighborhood", data.address.suburb || "");
              form.setValue("city", data.address.city || data.address.town || "");
              form.setValue("state", data.address.state || "");
              form.setValue("postalCode", data.address.postcode || "");
            }
            
            setIsGettingLocation(false);
            
            toast({
              title: "Localização obtida",
              description: "Seu endereço foi preenchido automaticamente.",
            });
          } catch (error) {
            console.error("Erro ao buscar endereço pela localização:", error);
            setIsGettingLocation(false);
            
            toast({
              title: "Erro ao obter localização",
              description: "Não foi possível obter seu endereço. Tente novamente.",
              variant: "destructive",
            });
          }
        },
        (error) => {
          console.error("Erro de geolocalização:", error);
          setIsGettingLocation(false);
          
          toast({
            title: "Erro ao obter localização",
            description: "Verifique se você autorizou o acesso à sua localização.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
    }
  };

  // Handler para alteração de CEP
  const handleCepChange = (value: string) => {
    if (value.length >= 8) {
      fetchAddressByCep(value);
    }
  };
  
  // Handler para upload de imagem de perfil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };
  
  // Handler para upload de documento de identidade
  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setIdDocumentFile(file);
      const previewUrl = URL.createObjectURL(file);
      setIdDocumentPreview(previewUrl);
    }
  };
  
  // Handler para upload de comprovante de residência
  const handleAddressDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAddressDocumentFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAddressDocumentPreview(previewUrl);
    }
  };

  // Envio do formulário
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Meus Dados</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar com perfil */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>Suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-2">
                      {profileImagePreview ? (
                        <AvatarImage src={profileImagePreview} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.name || "Usuário"}</h3>
                    <p className="text-gray-500">{user?.email || ""}</p>
                  </div>
                  
                  <nav className="space-y-1">
                    <Button 
                      variant={tab === "personal" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setTab("personal")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Informações Pessoais
                    </Button>
                    <Button 
                      variant={tab === "address" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setTab("address")}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Endereço
                    </Button>
                    <Button 
                      variant={tab === "documents" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setTab("documents")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Documentos
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Conteúdo principal */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === "personal" && "Informações Pessoais"}
                    {tab === "address" && "Endereço"}
                    {tab === "documents" && "Documentos"}
                  </CardTitle>
                  <CardDescription>
                    {tab === "personal" && "Atualize seus dados pessoais"}
                    {tab === "address" && "Informe seu endereço"}
                    {tab === "documents" && "Envie os documentos necessários"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Tab de Informações Pessoais */}
                        {tab === "personal" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Seu nome" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CPF</FormLabel>
                                    <FormControl>
                                      <Input placeholder="000.000.000-00" {...field} />
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
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                      <Input placeholder="seu@email.com" {...field} />
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
                                      <Input placeholder="(00) 00000-0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Foto de Perfil</h3>
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  {profileImagePreview ? (
                                    <AvatarImage src={profileImagePreview} />
                                  ) : (
                                    <AvatarFallback>
                                      {user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                
                                <div>
                                  <label htmlFor="profile-image" className="cursor-pointer">
                                    <div className="flex items-center gap-2 text-primary hover:underline">
                                      <Upload className="h-4 w-4" />
                                      <span>Upload de foto</span>
                                    </div>
                                    <input
                                      id="profile-image"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleProfileImageChange}
                                    />
                                  </label>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Imagens JPG, PNG. Tamanho máximo de 2MB.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Tab de Endereço */}
                        {tab === "address" && (
                          <>
                            <div className="flex gap-4 items-end mb-2">
                              <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="00000-000" 
                                        {...field} 
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleCepChange(e.target.value);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                              >
                                {isGettingLocation ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <MapPin className="h-4 w-4 mr-2" />
                                )}
                                Usar localização atual
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Rua, Avenida, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="neighborhood"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Seu bairro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Sua cidade" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                      <Input placeholder="UF" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Tab de Documentos */}
                        {tab === "documents" && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-4">Documento de Identidade (RG ou CNH)</h3>
                              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                {idDocumentPreview ? (
                                  <div className="mb-4">
                                    <img 
                                      src={idDocumentPreview} 
                                      alt="Documento de identidade" 
                                      className="max-h-48 mx-auto object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-4 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-2" />
                                    <p>Nenhum documento enviado</p>
                                  </div>
                                )}
                                
                                <label htmlFor="id-document" className="cursor-pointer">
                                  <Button variant="outline" type="button" className="mt-2">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {idDocumentPreview ? "Alterar documento" : "Enviar documento"}
                                  </Button>
                                  <input
                                    id="id-document"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={handleIdDocumentChange}
                                  />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                  Formatos: JPG, PNG, PDF. Tamanho máximo de 5MB.
                                </p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="font-medium mb-4">Comprovante de Endereço</h3>
                              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                {addressDocumentPreview ? (
                                  <div className="mb-4">
                                    <img 
                                      src={addressDocumentPreview} 
                                      alt="Comprovante de endereço" 
                                      className="max-h-48 mx-auto object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-4 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-2" />
                                    <p>Nenhum comprovante enviado</p>
                                  </div>
                                )}
                                
                                <label htmlFor="address-document" className="cursor-pointer">
                                  <Button variant="outline" type="button" className="mt-2">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {addressDocumentPreview ? "Alterar comprovante" : "Enviar comprovante"}
                                  </Button>
                                  <input
                                    id="address-document"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={handleAddressDocumentChange}
                                  />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                  Envie uma conta de luz, água, telefone ou extrato bancário (até 90 dias).
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="gap-2"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Salvar alterações
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;