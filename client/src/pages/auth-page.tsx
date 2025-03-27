import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, LogIn, UserPlus } from "lucide-react";
import { LoginData, userRegistrationSchema } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerUserMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<z.infer<typeof userRegistrationSchema>>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: z.infer<typeof userRegistrationSchema>) => {
    registerUserMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Auth forms */}
        <div className="md:w-1/2 p-8">
          <div className="mb-6 flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Frete<span className="text-primary">Já</span></span>
          </div>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Entre com sua conta para solicitar fretes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
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
                        control={loginForm.control}
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
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-4 w-4 animate-spin" />
                            Entrando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Entrar
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("register")}
                  >
                    Não tem uma conta? Cadastre-se
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro</CardTitle>
                  <CardDescription>
                    Crie sua conta para solicitar fretes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
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
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu Nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
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
                          control={registerForm.control}
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
                      </div>
                      <FormField
                        control={registerForm.control}
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
                        control={registerForm.control}
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
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerUserMutation.isPending}
                      >
                        {registerUserMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 animate-spin" />
                            Cadastrando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Cadastrar
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("login")}
                  >
                    Já tem uma conta? Faça login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Hero content */}
        <div className="md:w-1/2 bg-gradient-to-br from-primary to-green-700 text-white p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">FreteJá</h1>
          <p className="text-lg mb-6">
            A melhor plataforma para encontrar motoristas de frete e gerenciar suas entregas de forma prática e segura.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
              <span>Motoristas qualificados e avaliados</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
              <span>Pagamento seguro e transparente</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
              <span>Acompanhamento em tempo real</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">✓</div>
              <span>Suporte 24/7 para qualquer problema</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
