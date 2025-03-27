import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertDriverSchema, 
  insertFreightSchema, 
  insertRatingSchema,
  profileUpdateSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireDriverRole(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user && req.user.role !== "driver") {
    return res.status(403).json({ message: "Driver role required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Drivers API
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      
      // Fetch user data for each driver to get names, profile images, etc.
      const driversWithUserInfo = await Promise.all(
        drivers.map(async (driver) => {
          const user = await storage.getUser(driver.userId);
          if (!user) return null;
          
          return {
            ...driver,
            name: user.name,
            profileImage: user.profileImage,
            phone: user.phone,
            email: user.email
          };
        })
      );
      
      // Filter out any null entries
      const validDrivers = driversWithUserInfo.filter(driver => driver !== null);
      
      res.json(validDrivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });
  
  app.get("/api/drivers/available", async (req, res) => {
    try {
      const drivers = await storage.getAvailableDrivers();
      
      // Fetch user data for each driver to get names, profile images, etc.
      const driversWithUserInfo = await Promise.all(
        drivers.map(async (driver) => {
          const user = await storage.getUser(driver.userId);
          if (!user) return null;
          
          return {
            ...driver,
            name: user.name,
            profileImage: user.profileImage,
            phone: user.phone,
            email: user.email
          };
        })
      );
      
      // Filter out any null entries
      const validDrivers = driversWithUserInfo.filter(driver => driver !== null);
      
      res.json(validDrivers);
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      res.status(500).json({ message: "Failed to fetch available drivers" });
    }
  });
  
  app.get("/api/drivers/:id", async (req, res) => {
    try {
      const driver = await storage.getDriver(parseInt(req.params.id));
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      
      const user = await storage.getUser(driver.userId);
      if (!user) {
        return res.status(404).json({ message: "Driver user data not found" });
      }
      
      const driverWithUserInfo = {
        ...driver,
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone,
        email: user.email
      };
      
      res.json(driverWithUserInfo);
    } catch (error) {
      console.error("Error fetching driver:", error);
      res.status(500).json({ message: "Failed to fetch driver" });
    }
  });
  
  app.post("/api/drivers", requireAuth, async (req, res) => {
    try {
      // Validate driver data
      const driverData = insertDriverSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Update user role to driver
      await storage.updateUser(req.user!.id, { role: "driver" });
      
      // Create the driver profile
      const driver = await storage.createDriver(driverData);
      
      res.status(201).json(driver);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating driver:", error);
      res.status(500).json({ message: "Failed to create driver profile" });
    }
  });
  
  // Freight API
  app.post("/api/freights", requireAuth, async (req, res) => {
    try {
      const freightData = insertFreightSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const freight = await storage.createFreight(freightData);
      res.status(201).json(freight);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating freight:", error);
      res.status(500).json({ message: "Failed to create freight request" });
    }
  });
  
  app.get("/api/freights/user", requireAuth, async (req, res) => {
    try {
      const freights = await storage.getFreightsByUser(req.user!.id);
      
      // Fetch driver and user info for each freight
      const freightsWithInfo = await Promise.all(
        freights.map(async (freight) => {
          let driverInfo = null;
          
          if (freight.driverId) {
            const driver = await storage.getDriver(freight.driverId);
            if (driver) {
              const user = await storage.getUser(driver.userId);
              if (user) {
                driverInfo = {
                  id: driver.id,
                  name: user.name,
                  profileImage: user.profileImage,
                  phone: user.phone,
                  vehicleModel: driver.vehicleModel
                };
              }
            }
          }
          
          return {
            ...freight,
            driver: driverInfo
          };
        })
      );
      
      res.json(freightsWithInfo);
    } catch (error) {
      console.error("Error fetching user freights:", error);
      res.status(500).json({ message: "Failed to fetch freight requests" });
    }
  });
  
  app.get("/api/freights/active", requireAuth, async (req, res) => {
    try {
      const freights = await storage.getActiveFreightsByUser(req.user!.id);
      
      // Fetch driver and user info for each freight
      const freightsWithInfo = await Promise.all(
        freights.map(async (freight) => {
          let driverInfo = null;
          
          if (freight.driverId) {
            const driver = await storage.getDriver(freight.driverId);
            if (driver) {
              const user = await storage.getUser(driver.userId);
              if (user) {
                driverInfo = {
                  id: driver.id,
                  name: user.name,
                  profileImage: user.profileImage,
                  phone: user.phone,
                  vehicleModel: driver.vehicleModel
                };
              }
            }
          }
          
          return {
            ...freight,
            driver: driverInfo
          };
        })
      );
      
      res.json(freightsWithInfo);
    } catch (error) {
      console.error("Error fetching active freights:", error);
      res.status(500).json({ message: "Failed to fetch active freight requests" });
    }
  });
  
  app.get("/api/freights/driver", requireDriverRole, async (req, res) => {
    try {
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      const freights = await storage.getFreightsByDriver(driver.id);
      
      // Fetch user info for each freight
      const freightsWithInfo = await Promise.all(
        freights.map(async (freight) => {
          const user = await storage.getUser(freight.userId);
          const userInfo = user ? {
            name: user.name,
            phone: user.phone
          } : null;
          
          return {
            ...freight,
            user: userInfo
          };
        })
      );
      
      res.json(freightsWithInfo);
    } catch (error) {
      console.error("Error fetching driver freights:", error);
      res.status(500).json({ message: "Failed to fetch freight assignments" });
    }
  });
  
  app.get("/api/freights/pending", requireDriverRole, async (req, res) => {
    try {
      const pendingFreights = await storage.getPendingFreights();
      
      // Fetch user info for each pending freight
      const freightsWithInfo = await Promise.all(
        pendingFreights.map(async (freight) => {
          const user = await storage.getUser(freight.userId);
          const userInfo = user ? {
            name: user.name,
            phone: user.phone
          } : null;
          
          return {
            ...freight,
            user: userInfo
          };
        })
      );
      
      res.json(freightsWithInfo);
    } catch (error) {
      console.error("Error fetching pending freights:", error);
      res.status(500).json({ message: "Failed to fetch pending freight requests" });
    }
  });
  
  app.put("/api/freights/:id/accept", requireDriverRole, async (req, res) => {
    try {
      const freightId = parseInt(req.params.id);
      const freight = await storage.getFreight(freightId);
      
      if (!freight) {
        return res.status(404).json({ message: "Freight request not found" });
      }
      
      if (freight.status !== "pending") {
        return res.status(400).json({ message: "Freight is not in pending status" });
      }
      
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      // Update freight with driver info and change status
      const updatedFreight = await storage.updateFreight(freightId, {
        driverId: driver.id,
        status: "accepted"
      });
      
      res.json(updatedFreight);
    } catch (error) {
      console.error("Error accepting freight:", error);
      res.status(500).json({ message: "Failed to accept freight request" });
    }
  });
  
  app.put("/api/freights/:id/complete", requireDriverRole, async (req, res) => {
    try {
      const freightId = parseInt(req.params.id);
      const freight = await storage.getFreight(freightId);
      
      if (!freight) {
        return res.status(404).json({ message: "Freight request not found" });
      }
      
      if (freight.status !== "accepted") {
        return res.status(400).json({ message: "Freight is not in accepted status" });
      }
      
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      // Verify this driver is assigned to the freight
      if (freight.driverId !== driver.id) {
        return res.status(403).json({ message: "You are not assigned to this freight" });
      }
      
      // Update freight status
      const updatedFreight = await storage.updateFreight(freightId, {
        status: "completed"
      });
      
      // Update driver balance
      await storage.updateDriverBalance(driver.id, freight.amount);
      
      res.json(updatedFreight);
    } catch (error) {
      console.error("Error completing freight:", error);
      res.status(500).json({ message: "Failed to complete freight" });
    }
  });
  
  // Rating API
  app.post("/api/ratings", requireAuth, async (req, res) => {
    try {
      const ratingData = insertRatingSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Verify the freight exists and is completed
      const freight = await storage.getFreight(ratingData.freightId);
      if (!freight) {
        return res.status(404).json({ message: "Freight not found" });
      }
      
      if (freight.status !== "completed") {
        return res.status(400).json({ message: "Cannot rate an incomplete freight" });
      }
      
      // Verify the user is the one who requested the freight
      if (freight.userId !== req.user!.id) {
        return res.status(403).json({ message: "You can only rate your own freight requests" });
      }
      
      // Create the rating
      const rating = await storage.createRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating rating:", error);
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });
  
  app.get("/api/ratings/driver/:id", async (req, res) => {
    try {
      const driverId = parseInt(req.params.id);
      const ratings = await storage.getRatingsByDriver(driverId);
      
      // Fetch user info for each rating
      const ratingsWithUserInfo = await Promise.all(
        ratings.map(async (rating) => {
          const user = await storage.getUser(rating.userId);
          const userInfo = user ? {
            name: user.name,
            profileImage: user.profileImage
          } : null;
          
          return {
            ...rating,
            user: userInfo
          };
        })
      );
      
      res.json(ratingsWithUserInfo);
    } catch (error) {
      console.error("Error fetching driver ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });
  
  // Driver dashboard data
  app.get("/api/driver/dashboard", requireDriverRole, async (req, res) => {
    try {
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      // Get freight data
      const allFreights = await storage.getFreightsByDriver(driver.id);
      const completedFreights = allFreights.filter(f => f.status === "completed");
      const activeFreights = allFreights.filter(f => f.status === "accepted");
      
      // Get total earnings
      const totalEarnings = completedFreights.reduce((sum, freight) => sum + freight.amount, 0);
      
      // Get pending freights available for acceptance
      const pendingFreights = await storage.getPendingFreights();
      
      res.json({
        driverInfo: {
          ...driver,
          name: req.user!.name,
          profileImage: req.user!.profileImage
        },
        stats: {
          totalFreights: completedFreights.length,
          activeFreights: activeFreights.length,
          balance: driver.balance,
          totalEarnings: totalEarnings,
          rating: driver.averageRating,
          totalRatings: driver.totalRatings
        },
        pendingFreights: pendingFreights.length
      });
    } catch (error) {
      console.error("Error fetching driver dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  
  // User dashboard data
  app.get("/api/user/dashboard", requireAuth, async (req, res) => {
    try {
      // Get freight data
      const allFreights = await storage.getFreightsByUser(req.user!.id);
      const completedFreights = allFreights.filter(f => f.status === "completed");
      const activeFreights = allFreights.filter(f => f.status === "accepted" || f.status === "pending");
      
      // Calculate metrics
      const totalSpent = completedFreights.reduce((sum, freight) => sum + freight.amount, 0);
      
      res.json({
        userInfo: {
          id: req.user!.id,
          name: req.user!.name,
          email: req.user!.email,
          phone: req.user!.phone,
          profileImage: req.user!.profileImage
        },
        stats: {
          totalFreights: completedFreights.length,
          activeFreights: activeFreights.length,
          totalSpent: totalSpent
        }
      });
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // User Profile API
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const userProfile = await storage.getUserProfile(req.user!.id);
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      
      // Omit sensitive information like password
      const { password, ...userProfileData } = userProfile;
      
      res.json(userProfileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    try {
      // Validate profile data
      const profileData = profileUpdateSchema.parse(req.body);
      
      // Update the user profile
      const updatedProfile = await storage.updateUserProfile(req.user!.id, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      
      // Omit sensitive information like password
      const { password, ...updatedProfileData } = updatedProfile;
      
      res.json(updatedProfileData);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  
  // Driver Location API - Motoristas próximos ao CEP
  app.get("/api/drivers/nearby", requireAuth, async (req, res) => {
    try {
      const { latitude, longitude, radius = 3 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const nearbyDrivers = await storage.getNearbyDrivers(
        parseFloat(latitude as string), 
        parseFloat(longitude as string), 
        parseFloat(radius as string)
      );
      
      // Fetch user data for each driver to get names, profile images, etc.
      const driversWithUserInfo = await Promise.all(
        nearbyDrivers.map(async (driver) => {
          const user = await storage.getUser(driver.userId);
          if (!user) return null;
          
          return {
            ...driver,
            name: user.name,
            profileImage: user.profileImage,
            phone: user.phone,
            email: user.email
          };
        })
      );
      
      // Filter out any null entries
      const validDrivers = driversWithUserInfo.filter(driver => driver !== null);
      
      res.json(validDrivers);
    } catch (error) {
      console.error("Error fetching nearby drivers:", error);
      res.status(500).json({ message: "Failed to fetch nearby drivers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
