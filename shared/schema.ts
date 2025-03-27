import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table - basic user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("user"), // "user", "driver" ou "admin"
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Campos adicionais para o perfil do usuário
  cpf: text("cpf"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  neighborhood: text("neighborhood"),
  idDocumentUrl: text("id_document_url"),
  addressDocumentUrl: text("address_document_url"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

// Driver table - extends user with driver-specific information
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  vehicleModel: text("vehicle_model").notNull(),
  licensePlate: text("license_plate").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  location: text("location").notNull(),
  isAvailable: boolean("is_available").default(true),
  averageRating: doublePrecision("average_rating").default(0),
  totalRatings: integer("total_ratings").default(0),
  balance: doublePrecision("balance").default(0),
  document: text("document").notNull(),
  isHighlighted: boolean("is_highlighted").default(false),
  highlightEndDate: timestamp("highlight_end_date"),
  subscriptionType: text("subscription_type"),
  subscriptionEndDate: timestamp("subscription_end_date"),
});

// Freight table - freight requests
export const freights = pgTable("freights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  driverId: integer("driver_id").references(() => drivers.id),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  packageType: text("package_type").notNull(),
  instructions: text("instructions"),
  status: text("status").notNull().default("pending"), // pending, accepted, completed, canceled
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ratings table - user ratings for drivers after freight completion
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  freightId: integer("freight_id").notNull().references(() => freights.id),
  userId: integer("user_id").notNull().references(() => users.id),
  driverId: integer("driver_id").notNull().references(() => drivers.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transaction table - record of all financial transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  driverId: integer("driver_id").references(() => drivers.id),
  freightId: integer("freight_id").references(() => freights.id),
  type: text("type").notNull(), // "payment", "withdrawal", "commission", "subscription", "highlight"
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "completed", "failed", "cancelled"
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  paymentMethod: text("payment_method"), // "pix", "credit_card", etc.
  paymentDetails: text("payment_details"), // pix code, last 4 digits, etc.
});

// SystemSettings table - system configuration values
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "tax", "commission", "app", etc.
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: integer("updated_by").references(() => users.id),
});

// WithdrawalRequests table - driver withdrawal requests
export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull().references(() => drivers.id),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  requestDate: timestamp("request_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  processedBy: integer("processed_by").references(() => users.id),
  bankInfo: text("bank_info"),
  pixKey: text("pix_key"),
  notes: text("notes"),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export const insertDriverSchema = createInsertSchema(drivers)
  .omit({ 
    id: true, 
    averageRating: true, 
    totalRatings: true, 
    balance: true,
    isHighlighted: true,
    highlightEndDate: true,
    subscriptionType: true,
    subscriptionEndDate: true
  });

export const insertFreightSchema = createInsertSchema(freights)
  .omit({ id: true, createdAt: true });

export const insertRatingSchema = createInsertSchema(ratings)
  .omit({ id: true, createdAt: true });

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, transactionDate: true });

export const insertSystemSettingSchema = createInsertSchema(systemSettings)
  .omit({ id: true, updatedAt: true });

export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests)
  .omit({ id: true, requestDate: true, processedDate: true });

// Extended schemas for specific use cases
export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create a driver registration schema for driver registration
export const driverRegistrationSchema = z.object({
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  role: z.literal("driver"),
  vehicleModel: z.string().min(2, "Vehicle model is required"),
  licensePlate: z.string().min(3, "License plate is required"),
  vehicleType: z.string().min(2, "Vehicle type is required"),
  location: z.string().min(2, "Location is required"),
  document: z.string().min(2, "Document is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const ratingSubmissionSchema = z.object({
  freightId: z.number(),
  driverId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// Schema para atualização de perfil do usuário
export const profileUpdateSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().min(10, "Telefone inválido").optional(),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido").optional(),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres").optional(),
  city: z.string().min(2, "Cidade é obrigatória").optional(),
  state: z.string().min(2, "Estado é obrigatório").optional(),
  postalCode: z.string().min(8, "CEP inválido").max(9, "CEP inválido").optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type DriverRegistration = z.infer<typeof driverRegistrationSchema>;

export type Freight = typeof freights.$inferSelect;
export type InsertFreight = z.infer<typeof insertFreightSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;

// Schema para atualização de planos e destaques do motorista
export const highlightUpdateSchema = z.object({
  isHighlighted: z.boolean(),
  days: z.number().min(1, "Duração mínima de 1 dia"),
  highlightDuration: z.number().min(1, "Duração mínima de 1 dia").optional(),
  subscriptionType: z.enum(["basic", "premium", "vip"]).optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RatingSubmission = z.infer<typeof ratingSubmissionSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type HighlightUpdate = z.infer<typeof highlightUpdateSchema>;

// System fees schemas
export const feeUpdateSchema = z.object({
  feeType: z.enum(["base", "distance", "time", "weight", "size", "urgent", "special", "platform"]),
  value: z.string(),
  description: z.string().optional(),
  category: z.string().default("fees")
});

export type FeeUpdate = z.infer<typeof feeUpdateSchema>;
