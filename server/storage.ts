import { users, drivers, freights, ratings, transactions, systemSettings, withdrawalRequests } from "@shared/schema";
import type { 
  User, InsertUser, 
  Driver, InsertDriver, 
  Freight, InsertFreight, 
  Rating, InsertRating,
  Transaction, InsertTransaction,
  SystemSetting, InsertSystemSetting,
  WithdrawalRequest, InsertWithdrawalRequest
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

// Configuração do Supabase
const supabaseUrl = 'https://gzjyywhnpmujsxdtypkl.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
console.log("Utilizando Supabase URL:", supabaseUrl);
console.log("Supabase Key disponível:", !!supabaseKey);

// Verificação de chaves
if (!supabaseKey) {
  console.error("ERRO: SUPABASE_ANON_KEY não configurado!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUserProfile(id: number): Promise<User | undefined>; 
  updateUserProfile(id: number, profileData: Partial<User>): Promise<User | undefined>; 
  
  // Driver methods
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByUserId(userId: number): Promise<Driver | undefined>;
  getAllDrivers(): Promise<Driver[]>;
  getAvailableDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined>;
  updateDriverBalance(id: number, amount: number): Promise<Driver | undefined>;
  updateDriverHighlight(id: number, isHighlighted: boolean, days: number): Promise<Driver | undefined>;
  updateDriverSubscription(id: number, subscriptionType: string): Promise<Driver | undefined>;
  getNearbyDrivers(latitude: number, longitude: number, radius: number): Promise<Driver[]>; 
  
  // Freight methods
  getFreight(id: number): Promise<Freight | undefined>;
  getFreightsByUser(userId: number): Promise<Freight[]>;
  getFreightsByDriver(driverId: number): Promise<Freight[]>;
  getActiveFreightsByUser(userId: number): Promise<Freight[]>;
  getPendingFreights(): Promise<Freight[]>;
  createFreight(freight: InsertFreight): Promise<Freight>;
  updateFreight(id: number, freight: Partial<Freight>): Promise<Freight | undefined>;
  
  // Rating methods
  getRating(id: number): Promise<Rating | undefined>;
  getRatingsByDriver(driverId: number): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransactionsByDriver(driverId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // System settings methods
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  getAllSystemSettings(): Promise<SystemSetting[]>;
  getSystemSettingsByCategory(category: string): Promise<SystemSetting[]>;
  createSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  updateSystemSetting(key: string, value: string, updatedBy: number): Promise<SystemSetting | undefined>;
  
  // Withdrawal request methods
  getWithdrawalRequest(id: number): Promise<WithdrawalRequest | undefined>;
  getWithdrawalRequestsByDriver(driverId: number): Promise<WithdrawalRequest[]>;
  getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]>;
  createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest>;
  updateWithdrawalRequest(id: number, request: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getSystemStats(): Promise<any>; // Returns system statistics for admin dashboard
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drivers: Map<number, Driver>;
  private freights: Map<number, Freight>;
  private ratings: Map<number, Rating>;
  private transactions: Map<number, Transaction>;
  private systemSettings: Map<string, SystemSetting>;
  private withdrawalRequests: Map<number, WithdrawalRequest>;
  
  userCurrentId: number;
  driverCurrentId: number;
  freightCurrentId: number;
  ratingCurrentId: number;
  transactionCurrentId: number;
  systemSettingCurrentId: number;
  withdrawalRequestCurrentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.drivers = new Map();
    this.freights = new Map();
    this.ratings = new Map();
    this.transactions = new Map();
    this.systemSettings = new Map();
    this.withdrawalRequests = new Map();
    
    this.userCurrentId = 1;
    this.driverCurrentId = 1;
    this.freightCurrentId = 1;
    this.ratingCurrentId = 1;
    this.transactionCurrentId = 1;
    this.systemSettingCurrentId = 1;
    this.withdrawalRequestCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Seed initial drivers for demo
    this.seedInitialData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Driver methods
  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }
  
  async getDriverByUserId(userId: number): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.userId === userId,
    );
  }
  
  async getAllDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }
  
  async getAvailableDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values()).filter(
      (driver) => driver.isAvailable === true,
    );
  }
  
  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = this.driverCurrentId++;
    const driver: Driver = { 
      ...insertDriver, 
      id, 
      averageRating: 0, 
      totalRatings: 0, 
      balance: 0 
    };
    this.drivers.set(id, driver);
    return driver;
  }
  
  async updateDriver(id: number, driverData: Partial<Driver>): Promise<Driver | undefined> {
    const driver = await this.getDriver(id);
    if (!driver) return undefined;
    
    const updatedDriver = { ...driver, ...driverData };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  
  async updateDriverBalance(id: number, amount: number): Promise<Driver | undefined> {
    const driver = await this.getDriver(id);
    if (!driver) return undefined;
    
    const updatedDriver = { 
      ...driver, 
      balance: driver.balance + amount 
    };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }

  async updateDriverHighlight(id: number, isHighlighted: boolean, days: number): Promise<Driver | undefined> {
    const driver = await this.getDriver(id);
    if (!driver) return undefined;
    
    const highlightEndDate = isHighlighted 
      ? new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000) 
      : null;
    
    const updatedDriver = { 
      ...driver, 
      isHighlighted: isHighlighted,
      highlightEndDate: highlightEndDate
    };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  
  async updateDriverSubscription(id: number, subscriptionType: string): Promise<Driver | undefined> {
    const driver = await this.getDriver(id);
    if (!driver) return undefined;
    
    // Definir a data de fim da assinatura com base no tipo (30 dias para todos os planos)
    const subscriptionEndDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const updatedDriver = { 
      ...driver, 
      subscriptionType: subscriptionType,
      subscriptionEndDate: subscriptionEndDate
    };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }
  
  async getNearbyDrivers(latitude: number, longitude: number, radius: number): Promise<Driver[]> {
    // Implementação simples: retorna todos os motoristas disponíveis
    // Em um cenário real, filtraríamos com base na distância entre as coordenadas
    const availableDrivers = await this.getAvailableDrivers();
    
    return availableDrivers;
    
    // Nota: Em uma implementação real, calcularíamos a distância entre as coordenadas
    // usando a fórmula de Haversine e filtraríamos os motoristas que estão dentro do raio especificado
  }
  
  async getUserProfile(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }
  
  async updateUserProfile(id: number, profileData: Partial<User>): Promise<User | undefined> {
    return this.updateUser(id, profileData);
  }

  // Freight methods
  async getFreight(id: number): Promise<Freight | undefined> {
    return this.freights.get(id);
  }
  
  async getFreightsByUser(userId: number): Promise<Freight[]> {
    return Array.from(this.freights.values()).filter(
      (freight) => freight.userId === userId,
    );
  }
  
  async getFreightsByDriver(driverId: number): Promise<Freight[]> {
    return Array.from(this.freights.values()).filter(
      (freight) => freight.driverId === driverId,
    );
  }
  
  async getActiveFreightsByUser(userId: number): Promise<Freight[]> {
    return Array.from(this.freights.values()).filter(
      (freight) => freight.userId === userId && 
                  (freight.status === 'pending' || freight.status === 'accepted'),
    );
  }
  
  async getPendingFreights(): Promise<Freight[]> {
    return Array.from(this.freights.values()).filter(
      (freight) => freight.status === 'pending',
    );
  }
  
  async createFreight(insertFreight: InsertFreight): Promise<Freight> {
    const id = this.freightCurrentId++;
    const freight: Freight = { 
      ...insertFreight, 
      id, 
      createdAt: new Date() 
    };
    this.freights.set(id, freight);
    return freight;
  }
  
  async updateFreight(id: number, freightData: Partial<Freight>): Promise<Freight | undefined> {
    const freight = await this.getFreight(id);
    if (!freight) return undefined;
    
    const updatedFreight = { ...freight, ...freightData };
    this.freights.set(id, updatedFreight);
    return updatedFreight;
  }

  // Rating methods
  async getRating(id: number): Promise<Rating | undefined> {
    return this.ratings.get(id);
  }
  
  async getRatingsByDriver(driverId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      (rating) => rating.driverId === driverId,
    );
  }
  
  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.ratingCurrentId++;
    const rating: Rating = { 
      ...insertRating, 
      id, 
      createdAt: new Date() 
    };
    this.ratings.set(id, rating);
    
    // Update driver average rating
    const driver = await this.getDriver(insertRating.driverId);
    if (driver) {
      const newTotalRatings = driver.totalRatings + 1;
      const newAverageRating = 
        (driver.averageRating * driver.totalRatings + insertRating.rating) / newTotalRatings;
      
      await this.updateDriver(driver.id, {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings
      });
    }
    
    return rating;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async getTransactionsByDriver(driverId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.driverId === driverId
    );
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = await this.getTransaction(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // System settings methods
  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    return this.systemSettings.get(key);
  }
  
  async getAllSystemSettings(): Promise<SystemSetting[]> {
    return Array.from(this.systemSettings.values());
  }
  
  async getSystemSettingsByCategory(category: string): Promise<SystemSetting[]> {
    return Array.from(this.systemSettings.values()).filter(
      (setting) => setting.category === category
    );
  }
  
  async createSystemSetting(insertSetting: InsertSystemSetting): Promise<SystemSetting> {
    const setting: SystemSetting = {
      ...insertSetting,
      updatedAt: new Date()
    };
    this.systemSettings.set(insertSetting.key, setting);
    return setting;
  }
  
  async updateSystemSetting(key: string, value: string, updatedBy: number): Promise<SystemSetting | undefined> {
    const setting = await this.getSystemSetting(key);
    if (!setting) return undefined;
    
    const updatedSetting = { 
      ...setting, 
      value,
      updatedBy,
      updatedAt: new Date() 
    };
    this.systemSettings.set(key, updatedSetting);
    return updatedSetting;
  }
  
  // Withdrawal request methods
  async getWithdrawalRequest(id: number): Promise<WithdrawalRequest | undefined> {
    return this.withdrawalRequests.get(id);
  }
  
  async getWithdrawalRequestsByDriver(driverId: number): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values()).filter(
      (request) => request.driverId === driverId
    );
  }
  
  async getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values()).filter(
      (request) => request.status === 'pending'
    );
  }
  
  async createWithdrawalRequest(insertRequest: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const id = this.withdrawalRequestCurrentId++;
    const request: WithdrawalRequest = {
      ...insertRequest,
      id,
      createdAt: new Date()
    };
    this.withdrawalRequests.set(id, request);
    return request;
  }
  
  async updateWithdrawalRequest(id: number, requestData: Partial<WithdrawalRequest>): Promise<WithdrawalRequest | undefined> {
    const request = await this.getWithdrawalRequest(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...requestData };
    this.withdrawalRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role
    );
  }
  
  async getSystemStats(): Promise<any> {
    // Total number of users
    const totalUsers = this.users.size;
    
    // Total number of drivers
    const totalDrivers = this.drivers.size;
    
    // Total number of freights
    const totalFreights = this.freights.size;
    
    // Total number of completed freights
    const completedFreights = Array.from(this.freights.values()).filter(
      (freight) => freight.status === 'completed'
    ).length;
    
    // Total revenue
    const totalRevenue = Array.from(this.transactions.values())
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Revenue by month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const revenueByMonth: Record<string, number> = {};
    
    // Initialize the last 6 months with zero revenue
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date();
      monthDate.setMonth(now.getMonth() - i);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
      revenueByMonth[monthKey] = 0;
    }
    
    // Calculate revenue for each month
    Array.from(this.transactions.values())
      .filter(transaction => transaction.createdAt >= sixMonthsAgo)
      .forEach(transaction => {
        const date = transaction.createdAt;
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (revenueByMonth[monthKey] !== undefined) {
          revenueByMonth[monthKey] += transaction.amount;
        }
      });
    
    return {
      totalUsers,
      totalDrivers,
      totalFreights,
      completedFreights,
      freightCompletionRate: totalFreights > 0 ? completedFreights / totalFreights : 0,
      totalRevenue,
      revenueByMonth,
      pendingWithdrawals: this.withdrawalRequests.size
    };
  }

  // Seed initial data for demo
  private async seedInitialData() {
    // Create admin user with pre-hashed password
    // A senha "admin123" já pré-hashada para evitar problemas de autenticação
    const adminUser = await this.createUser({
      username: "newadmin",
      password: "c88eb32b743e3aa21b6cfd2d0e19ebdb18d2dc0436c58d40479e2b628a748de9ad75ec0817575b89866ee87f43fcb057c05c59898d9cbd49bd2ddc7f49482c6c.70477b5ed0f749fdf57354aa5f359494",
      name: "Administrador",
      email: "admin@eufretei.com.br",
      phone: "(11) 99999-9999",
      role: "admin",
      profileImage: "https://images.unsplash.com/photo-1566753323558-f4e0952af115"
    });
    
    // Create demo users
    const user1 = await this.createUser({
      username: "driver1",
      password: "password", // This will be hashed by the auth system
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "(11) 98765-4321",
      role: "driver",
      profileImage: "https://images.unsplash.com/photo-1531384441138-2736e62e0919"
    });
    
    const user2 = await this.createUser({
      username: "driver2",
      password: "password",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@example.com",
      phone: "(21) 98765-4321",
      role: "driver",
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    });
    
    const user3 = await this.createUser({
      username: "driver3",
      password: "password",
      name: "Amanda Souza",
      email: "amanda.souza@example.com",
      phone: "(41) 98765-4321",
      role: "driver",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
    });
    
    const user4 = await this.createUser({
      username: "driver4",
      password: "password",
      name: "Marcos Pereira",
      email: "marcos.pereira@example.com",
      phone: "(31) 98765-4321",
      role: "driver",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
    });

    // Create demo drivers
    await this.createDriver({
      userId: user1.id,
      vehicleModel: "Fiorino Furgão 2020",
      licensePlate: "ABC1234",
      vehicleType: "Small Van",
      location: "São Paulo, SP",
      isAvailable: true,
      document: "123456789"
    });
    
    await this.createDriver({
      userId: user2.id,
      vehicleModel: "VW Delivery 9.170",
      licensePlate: "DEF5678",
      vehicleType: "Truck",
      location: "Rio de Janeiro, RJ",
      isAvailable: true,
      document: "987654321"
    });
    
    await this.createDriver({
      userId: user3.id,
      vehicleModel: "Renault Master Furgão",
      licensePlate: "GHI9012",
      vehicleType: "Medium Van",
      location: "Curitiba, PR",
      isAvailable: true,
      document: "456789123"
    });
    
    await this.createDriver({
      userId: user4.id,
      vehicleModel: "HR 2.5 Baú",
      licensePlate: "JKL3456",
      vehicleType: "Box Truck",
      location: "Belo Horizonte, MG",
      isAvailable: true,
      document: "789123456"
    });
  }
}

// Implementação de armazenamento utilizando Supabase
export class SupabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 horas
    });
    
    // Criar tabelas no Supabase caso não existam 
    this.initializeDatabase();
  }
  
  private async initializeDatabase() {
    try {
      console.log('Inicializando conexão com Supabase e criando tabelas...');
      
      // Verificar permissões
      console.log('Verificando permissões no Supabase...');
      
      // Em vez de verificar se as tabelas existem, vamos criar os objetos SQL diretamente
      // enviando comandos SQL para criar as tabelas
      try {
        console.log('Tentando criar tabela de usuários diretamente...');
        
        // Criar um usuário diretamente usando a API do Supabase
        const user = {
          username: "driver1_" + Date.now(), // Tornar único para evitar colisões
          password: "password", // Em produção seria criptografado
          name: "João Silva",
          email: `joao.silva.${Date.now()}@example.com`, // Tornar único para evitar colisões
          phone: "(11) 98765-4321",
          role: "driver",
          profile_image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919"
        };
        
        // Attempt to create user
        const { data: createdUser, error: userError } = await supabase
          .from('users')
          .insert(user)
          .select();
          
        if (userError) {
          console.error('Erro detalhado ao criar usuário:', userError);
          
          if (userError.message.includes('permission denied')) {
            console.log('⚠️ Permissão negada. Verifique as políticas de segurança do Supabase.');
          }
          
          if (userError.message.includes('does not exist')) {
            console.log('⚠️ A tabela não existe. É necessário criar no Console do Supabase.');
          }
        } else {
          console.log('✅ Usuário criado com sucesso:', createdUser);
        }
            
      } catch (err) {
        console.error('Erro ao criar tabelas:', err);
      }
      
      // Agora vamos tentar usar o banco normalmente
      console.log('Tentando obter dados existentes...');
      
      try {
        // Verificar se já existem usuários
        const { data: existingUsers, error: queryError } = await supabase
          .from('users')
          .select('count')
          .limit(1)
          .single();
          
        if (queryError) {
          console.error('Erro ao verificar usuários existentes:', queryError);
          
          if (queryError.message.includes('permission denied')) {
            console.log('⚠️ Permissão negada para leitura. Verifique as políticas RLS do Supabase.');
          }
          
          if (queryError.message.includes('does not exist')) {
            console.log('⚠️ A tabela users não existe. É necessário criar no Console do Supabase.');
            console.log('ℹ️ Acesse https://app.supabase.com e crie as tabelas manualmente.');
            console.log('ℹ️ Use a estrutura definida em shared/schema.ts como referência.');
          }
        } else {
          console.log('✅ Comunicação com o banco funcionando. Total de usuários:', existingUsers?.count || 0);
        }
      } catch (err) {
        console.error('Erro ao verificar dados existentes:', err);
      }
      
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  }
  
  private async seedAdditionalDataIfNeeded() {
    try {
      // Verificar se já existem mais dados no Supabase
      const { data: existingDrivers, error: driverQueryError } = await supabase
        .from('drivers')
        .select('count')
        .single();
        
      if (driverQueryError && driverQueryError.code !== '42P01') {
        console.error('Erro ao verificar quantidade de motoristas:', driverQueryError);
        return;
      }
      
      // Se já temos pelo menos 3 motoristas, não precisamos semear mais
      const driverCount = existingDrivers?.count || 0;
      if (driverCount >= 3) {
        console.log('Já existem pelo menos 3 motoristas, pulando semeadura adicional.');
        return;
      }
      
      console.log('Semeando dados adicionais no Supabase...');
      
      // Criar alguns usuários de teste
      const driverPassword = 'password'; // Em produção seria criptografado
      
      // Criar motorista 2
      const { data: user2, error: user2Error } = await supabase
        .from('users')
        .insert({
          username: "driver2",
          password: driverPassword,
          name: "Carlos Oliveira",
          email: "carlos.oliveira@example.com",
          phone: "(21) 98765-4321",
          role: "driver",
          profile_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
        })
        .select()
        .maybeSingle();
        
      if (user2Error) {
        console.error('Erro ao criar usuário 2:', user2Error);
      } else if (user2) {
        const { error: driver2Error } = await supabase
          .from('drivers')
          .insert({
            user_id: user2.id,
            vehicle_model: "VW Delivery 9.170",
            license_plate: "DEF5678",
            vehicle_type: "Truck",
            location: "Rio de Janeiro, RJ",
            is_available: true,
            document: "987654321",
            average_rating: 0,
            total_ratings: 0,
            balance: 0
          });
          
        if (driver2Error) {
          console.error('Erro ao criar motorista 2:', driver2Error);
        } else {
          console.log('Motorista 2 criado com sucesso!');
        }
      }
      
      // Criar motorista 3
      const { data: user3, error: user3Error } = await supabase
        .from('users')
        .insert({
          username: "driver3",
          password: driverPassword,
          name: "Amanda Souza", 
          email: "amanda.souza@example.com",
          phone: "(41) 98765-4321",
          role: "driver",
          profile_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
        })
        .select()
        .maybeSingle();
        
      if (user3Error) {
        console.error('Erro ao criar usuário 3:', user3Error);
      } else if (user3) {
        const { error: driver3Error } = await supabase
          .from('drivers')
          .insert({
            user_id: user3.id,
            vehicle_model: "Renault Master Furgão",
            license_plate: "GHI9012",
            vehicle_type: "Medium Van",
            location: "Curitiba, PR",
            is_available: true,
            document: "456789123",
            average_rating: 0,
            total_ratings: 0,
            balance: 0
          });
          
        if (driver3Error) {
          console.error('Erro ao criar motorista 3:', driver3Error);
        } else {
          console.log('Motorista 3 criado com sucesso!');
        }
      }
      
      console.log('Dados adicionais semeados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao semear dados adicionais:', error);
    }
  }
  
  private async seedInitialDataIfNeeded() {
    try {
      // Verificar se já existem dados no Supabase
      const { data: existingUsers, error: userQueryError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
        
      if (userQueryError) {
        console.error('Erro ao verificar dados existentes:', userQueryError);
        return;
      }
      
      // Se já existem dados, não precisamos semear
      if (existingUsers && existingUsers.length > 0) {
        console.log('Dados já existem, pulando semeadura inicial.');
        return;
      }
      
      console.log('Semeando dados iniciais no Supabase...');
      
      // Criar alguns usuários de teste
      const driverPassword = 'password'; // Em produção seria criptografado
      
      // Criar motorista 1
      const { data: user1, error: user1Error } = await supabase
        .from('users')
        .insert({
          username: "driver1",
          password: driverPassword,
          name: "João Silva",
          email: "joao.silva@example.com",
          phone: "(11) 98765-4321",
          role: "driver",
          profile_image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919"
        })
        .select()
        .single();
        
      if (user1Error) {
        console.error('Erro ao criar usuário 1:', user1Error);
      } else if (user1) {
        const { error: driver1Error } = await supabase
          .from('drivers')
          .insert({
            user_id: user1.id,
            vehicle_model: "Fiorino Furgão 2020",
            license_plate: "ABC1234",
            vehicle_type: "Small Van",
            location: "São Paulo, SP",
            is_available: true,
            document: "123456789"
          });
          
        if (driver1Error) {
          console.error('Erro ao criar motorista 1:', driver1Error);
        }
      }
      
      // Criar motorista 2
      const { data: user2, error: user2Error } = await supabase
        .from('users')
        .insert({
          username: "driver2",
          password: driverPassword,
          name: "Carlos Oliveira",
          email: "carlos.oliveira@example.com",
          phone: "(21) 98765-4321",
          role: "driver",
          profile_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
        })
        .select()
        .single();
        
      if (user2Error) {
        console.error('Erro ao criar usuário 2:', user2Error);
      } else if (user2) {
        const { error: driver2Error } = await supabase
          .from('drivers')
          .insert({
            user_id: user2.id,
            vehicle_model: "VW Delivery 9.170",
            license_plate: "DEF5678",
            vehicle_type: "Truck",
            location: "Rio de Janeiro, RJ",
            is_available: true,
            document: "987654321"
          });
          
        if (driver2Error) {
          console.error('Erro ao criar motorista 2:', driver2Error);
        }
      }
      
      console.log('Dados iniciais semeados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao semear dados iniciais:', error);
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    console.log('Tentando criar usuário:', user.username);
    
    // Converter camelCase para snake_case para o Supabase
    const supabaseUser = {
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',  // valor padrão
      profile_image: user.profileImage,
      cpf: user.cpf,
      address: user.address,
      city: user.city,
      state: user.state,
      postal_code: user.postalCode,
      neighborhood: user.neighborhood,
      id_document_url: user.idDocumentUrl,
      address_document_url: user.addressDocumentUrl,
      latitude: user.latitude,
      longitude: user.longitude
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(supabaseUser)
      .select()
      .single();
      
    if (error) {
      console.error('Erro completo ao criar usuário:', error);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Erro ao criar usuário: Resposta vazia do servidor');
    }
    
    // Converter de volta do snake_case para camelCase
    return {
      ...data,
      id: data.id,
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      profileImage: data.profile_image,
      createdAt: data.created_at,
      cpf: data.cpf,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      neighborhood: data.neighborhood,
      idDocumentUrl: data.id_document_url,
      addressDocumentUrl: data.address_document_url,
      latitude: data.latitude,
      longitude: data.longitude
    } as User;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !data) return undefined;
    return data as User;
  }
  
  async getUserProfile(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }
  
  async updateUserProfile(id: number, profileData: Partial<User>): Promise<User | undefined> {
    return this.updateUser(id, profileData);
  }
  
  // Driver methods
  async getDriver(id: number): Promise<Driver | undefined> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    
    // Convertendo snake_case para camelCase
    return {
      ...data,
      userId: data.user_id,
      vehicleModel: data.vehicle_model,
      licensePlate: data.license_plate,
      vehicleType: data.vehicle_type,
      isAvailable: data.is_available,
      averageRating: data.average_rating,
      totalRatings: data.total_ratings
    } as Driver;
  }
  
  async getDriverByUserId(userId: number): Promise<Driver | undefined> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) return undefined;
    // Convertendo snake_case para camelCase
    return {
      ...data,
      userId: data.user_id,
      vehicleModel: data.vehicle_model,
      licensePlate: data.license_plate,
      vehicleType: data.vehicle_type,
      isAvailable: data.is_available,
      averageRating: data.average_rating,
      totalRatings: data.total_ratings
    } as Driver;
  }
  
  async getAllDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');
      
    if (error || !data) return [];
    
    // Convertendo snake_case para camelCase para todos os motoristas
    return data.map(driver => ({
      ...driver,
      userId: driver.user_id,
      vehicleModel: driver.vehicle_model,
      licensePlate: driver.license_plate,
      vehicleType: driver.vehicle_type,
      isAvailable: driver.is_available,
      averageRating: driver.average_rating,
      totalRatings: driver.total_ratings
    })) as Driver[];
  }
  
  async getAvailableDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true);
      
    if (error || !data) return [];
    
    // Convertendo snake_case para camelCase para todos os motoristas
    return data.map(driver => ({
      ...driver,
      userId: driver.user_id,
      vehicleModel: driver.vehicle_model,
      licensePlate: driver.license_plate,
      vehicleType: driver.vehicle_type,
      isAvailable: driver.is_available,
      averageRating: driver.average_rating,
      totalRatings: driver.total_ratings
    })) as Driver[];
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    // Convertendo camelCase para snake_case para inserção no Supabase
    const { data, error } = await supabase
      .from('drivers')
      .insert({
        user_id: driver.userId,
        vehicle_model: driver.vehicleModel,
        license_plate: driver.licensePlate,
        vehicle_type: driver.vehicleType,
        location: driver.location,
        is_available: driver.isAvailable ?? true,
        document: driver.document,
        average_rating: 0,
        total_ratings: 0,
        balance: 0
      })
      .select()
      .single();
      
    if (error) throw new Error(`Erro ao criar motorista: ${error.message}`);
    
    // Convertendo de volta para camelCase para a aplicação
    return {
      ...data,
      userId: data.user_id,
      vehicleModel: data.vehicle_model,
      licensePlate: data.license_plate,
      vehicleType: data.vehicle_type,
      isAvailable: data.is_available,
      averageRating: data.average_rating,
      totalRatings: data.total_ratings
    } as Driver;
  }
  
  async updateDriver(id: number, driverData: Partial<Driver>): Promise<Driver | undefined> {
    const { data, error } = await supabase
      .from('drivers')
      .update(driverData)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !data) return undefined;
    return data as Driver;
  }
  
  async updateDriverBalance(id: number, amount: number): Promise<Driver | undefined> {
    // Primeiro obtemos o motorista atual para saber o saldo
    const driver = await this.getDriver(id);
    if (!driver) return undefined;
    
    // Atualizamos o saldo
    const newBalance = (driver.balance || 0) + amount;
    return this.updateDriver(id, { balance: newBalance });
  }
  
  async getNearbyDrivers(latitude: number, longitude: number, radius: number): Promise<Driver[]> {
    // Como o Supabase não tem suporte nativo para busca geoespacial, 
    // vamos implementar uma solução simples por enquanto
    // Buscamos todos os motoristas disponíveis
    const availableDrivers = await this.getAvailableDrivers();
    
    // Em uma implementação real, poderíamos filtrar usando a função de distância SQL
    // ou implementar a fórmula de Haversine diretamente no código
    return availableDrivers;
  }
  
  // Freight methods
  async getFreight(id: number): Promise<Freight | undefined> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as Freight;
  }
  
  async getFreightsByUser(userId: number): Promise<Freight[]> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('userId', userId);
      
    if (error || !data) return [];
    return data as Freight[];
  }
  
  async getFreightsByDriver(driverId: number): Promise<Freight[]> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('driverId', driverId);
      
    if (error || !data) return [];
    return data as Freight[];
  }
  
  async getActiveFreightsByUser(userId: number): Promise<Freight[]> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('userId', userId)
      .in('status', ['pending', 'accepted']);
      
    if (error || !data) return [];
    return data as Freight[];
  }
  
  async getPendingFreights(): Promise<Freight[]> {
    const { data, error } = await supabase
      .from('freights')
      .select('*')
      .eq('status', 'pending');
      
    if (error || !data) return [];
    return data as Freight[];
  }
  
  async createFreight(freight: InsertFreight): Promise<Freight> {
    const { data, error } = await supabase
      .from('freights')
      .insert(freight)
      .select()
      .single();
      
    if (error) throw new Error(`Erro ao criar frete: ${error.message}`);
    return data as Freight;
  }
  
  async updateFreight(id: number, freightData: Partial<Freight>): Promise<Freight | undefined> {
    const { data, error } = await supabase
      .from('freights')
      .update(freightData)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !data) return undefined;
    return data as Freight;
  }
  
  // Rating methods
  async getRating(id: number): Promise<Rating | undefined> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return undefined;
    return data as Rating;
  }
  
  async getRatingsByDriver(driverId: number): Promise<Rating[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('driverId', driverId);
      
    if (error || !data) return [];
    return data as Rating[];
  }
  
  async createRating(rating: InsertRating): Promise<Rating> {
    const { data, error } = await supabase
      .from('ratings')
      .insert(rating)
      .select()
      .single();
      
    if (error) throw new Error(`Erro ao criar avaliação: ${error.message}`);
    
    // Atualiza a média de avaliação do motorista
    const driver = await this.getDriver(rating.driverId);
    if (driver) {
      const ratings = await this.getRatingsByDriver(driver.id);
      const totalRatings = ratings.length;
      const totalScore = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalScore / totalRatings;
      
      await this.updateDriver(driver.id, {
        averageRating,
        totalRatings
      });
    }
    
    return data as Rating;
  }
}

// Configura a implementação de armazenamento a ser utilizada
// Temporariamente usando o armazenamento em memória até resolver os problemas do Supabase
export const storage = new MemStorage();
