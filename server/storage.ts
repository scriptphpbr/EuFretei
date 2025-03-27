import { users, drivers, freights, ratings } from "@shared/schema";
import type { User, InsertUser, Driver, InsertDriver, Freight, InsertFreight, Rating, InsertRating } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Driver methods
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByUserId(userId: number): Promise<Driver | undefined>;
  getAllDrivers(): Promise<Driver[]>;
  getAvailableDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined>;
  updateDriverBalance(id: number, amount: number): Promise<Driver | undefined>;
  
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

export const storage = new MemStorage();
