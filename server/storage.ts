import { users, drivers, freights, ratings } from "@shared/schema";
import type { User, InsertUser, Driver, InsertDriver, Freight, InsertFreight, Rating, InsertRating } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

// Configuração do Supabase
const supabaseUrl = 'https://gzjyywhnpmujsxdtypkl.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
console.log("Utilizando Supabase URL:", supabaseUrl);
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
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drivers: Map<number, Driver>;
  private freights: Map<number, Freight>;
  private ratings: Map<number, Rating>;
  
  userCurrentId: number;
  driverCurrentId: number;
  freightCurrentId: number;
  ratingCurrentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.drivers = new Map();
    this.freights = new Map();
    this.ratings = new Map();
    
    this.userCurrentId = 1;
    this.driverCurrentId = 1;
    this.freightCurrentId = 1;
    this.ratingCurrentId = 1;
    
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

  // Seed initial data for demo
  private async seedInitialData() {
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
      // Verificar se as tabelas necessárias existem, se não existirem, serão criadas
      // automaticamente pelo Supabase quando usarmos os métodos insert/update
      console.log('Inicializando conexão com Supabase...');
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
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
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
      
    if (error) throw new Error(`Erro ao criar usuário: ${error.message}`);
    return data as User;
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
    return data as Driver;
  }
  
  async getDriverByUserId(userId: number): Promise<Driver | undefined> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('userId', userId)
      .single();
      
    if (error || !data) return undefined;
    return data as Driver;
  }
  
  async getAllDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');
      
    if (error || !data) return [];
    return data as Driver[];
  }
  
  async getAvailableDrivers(): Promise<Driver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('isAvailable', true);
      
    if (error || !data) return [];
    return data as Driver[];
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .insert({
        ...driver,
        averageRating: 0,
        totalRatings: 0,
        balance: 0
      })
      .select()
      .single();
      
    if (error) throw new Error(`Erro ao criar motorista: ${error.message}`);
    return data as Driver;
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
export const storage = new SupabaseStorage();
