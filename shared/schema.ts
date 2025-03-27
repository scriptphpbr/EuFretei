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
  role: text("role").notNull().default("user"), // "user" or "driver"
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export const insertDriverSchema = createInsertSchema(drivers)
  .omit({ id: true, averageRating: true, totalRatings: true, balance: true });

export const insertFreightSchema = createInsertSchema(freights)
  .omit({ id: true, createdAt: true });

export const insertRatingSchema = createInsertSchema(ratings)
  .omit({ id: true, createdAt: true });

// Extended schemas for specific use cases
export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create a driver registration schema by merging user registration fields with driver fields
export const driverRegistrationSchema = z.object({
  ...userRegistrationSchema.shape,
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

export type LoginData = z.infer<typeof loginSchema>;
export type RatingSubmission = z.infer<typeof ratingSubmissionSchema>;
