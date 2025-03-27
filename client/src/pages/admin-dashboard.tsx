import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { 
  Users, 
  TruckIcon, 
  Package, 
  BarChart3, 
  Settings, 
  DollarSign,
  CreditCard
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visão-geral");

  // Verificar se o usuário é administrador
  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  // Buscar estatísticas do sistema
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  // Buscar motoristas
  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['/api/admin/drivers'],
  });

  // Buscar solicitações de saque pendentes
  const { data: withdrawalRequests, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['/api/admin/withdrawal-requests'],
  });

  // Buscar configurações do sistema
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
  });

  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Dados formatados para gráfico de receita por mês
  const formatRevenueData = () => {
    if (!stats || !stats.revenueByMonth) return [];
    
    return Object.entries(stats.revenueByMonth).map(([month, amount]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
      
      return {
        name: `${monthNames[parseInt(monthNum) - 1]}/${year.slice(2)}`,
        valor: amount
      };
    }).reverse();
  };

  // Dados formatados para gráfico de pizza
  const formatPieData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Usuários', value: stats.totalUsers || 0 },
      { name: 'Motoristas', value: stats.totalDrivers || 0 },
      { name: 'Fretes Concluídos', value: stats.completedFreights || 0 },
      { name: 'Fretes Pendentes', value: (stats.totalFreights - stats.completedFreights) || 0 }
    ];
  };

  // Formatar valor em Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (statsLoading || driversLoading || withdrawalsLoading || settingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
        Painel Administrativo EuFretei
      </h1>

      <Tabs defaultValue="visão-geral" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-8">
          <TabsTrigger value="visão-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="motoristas">Motoristas</TabsTrigger>
          <TabsTrigger value="saques">Solicitações de Saque</TabsTrigger>
          <TabsTrigger value="configurações">Configurações</TabsTrigger>
          <TabsTrigger value="taxas">Taxas</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="visão-geral" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Motoristas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TruckIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.totalDrivers || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Fretes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats?.totalFreights || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>
                  Histórico de receita nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatRevenueData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas da Plataforma</CardTitle>
                <CardDescription>
                  Distribuição entre usuários, motoristas e fretes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {formatPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Quantidade']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Motoristas */}
        <TabsContent value="motoristas">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Motoristas</CardTitle>
              <CardDescription>
                Gerenciar motoristas cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Lista de todos os motoristas cadastrados</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers && drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {driver.isHighlighted && <span className="text-yellow-500">🌟</span>}
                            {driver.user?.name}
                          </div>
                        </TableCell>
                        <TableCell>{driver.vehicleModel}</TableCell>
                        <TableCell>
                          {driver.averageRating ? driver.averageRating.toFixed(1) : '-'} 
                          ({driver.totalRatings || 0})
                        </TableCell>
                        <TableCell>{driver.location}</TableCell>
                        <TableCell>{formatCurrency(driver.balance || 0)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driver.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {driver.isAvailable ? 'Disponível' : 'Indisponível'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhum motorista encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Saque */}
        <TabsContent value="saques">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Saque</CardTitle>
              <CardDescription>
                Gerenciar solicitações de saque dos motoristas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Lista de solicitações de saque</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Chave PIX</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalRequests && withdrawalRequests.length > 0 ? (
                    withdrawalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.driver?.user?.name}</TableCell>
                        <TableCell>{formatCurrency(request.amount)}</TableCell>
                        <TableCell>{request.pixKey}</TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Pendente' : 
                             request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button 
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                              onClick={() => {
                                // Aprovar saque
                                toast({
                                  title: "Em breve",
                                  description: "Aprovação de saques será implementada em breve",
                                });
                              }}
                            >
                              Aprovar
                            </button>
                            <button 
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                              onClick={() => {
                                // Rejeitar saque
                                toast({
                                  title: "Em breve",
                                  description: "Rejeição de saques será implementada em breve",
                                });
                              }}
                            >
                              Rejeitar
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhuma solicitação de saque pendente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="configurações">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Gerenciar configurações globais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Módulo de configurações em desenvolvimento...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taxas */}
        <TabsContent value="taxas">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Taxas</CardTitle>
              <CardDescription>
                Configurar taxas de serviço da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Taxa por Quilômetro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          placeholder="Valor por km"
                          // Implementar função para atualizar
                        />
                        <span className="ml-2 text-muted-foreground">R$</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Taxa por Hora</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          placeholder="Valor por hora"
                          // Implementar função para atualizar
                        />
                        <span className="ml-2 text-muted-foreground">R$</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Taxa por Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          placeholder="Valor por volume"
                          // Implementar função para atualizar
                        />
                        <span className="ml-2 text-muted-foreground">R$</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Taxa de Serviço da Plataforma (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        placeholder="Porcentagem de cobrança"
                        // Implementar função para atualizar
                      />
                      <span className="ml-2 text-muted-foreground">%</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <button 
                    className="bg-primary text-white px-4 py-2 rounded"
                    onClick={() => {
                      toast({
                        title: "Em desenvolvimento",
                        description: "Atualização de taxas será implementada em breve",
                      });
                    }}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;