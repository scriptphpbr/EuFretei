import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertDriverSchema, 
  insertFreightSchema, 
  insertRatingSchema,
  profileUpdateSchema,
  highlightUpdateSchema,
  insertWithdrawalRequestSchema,
  insertSystemSettingSchema,
  feeUpdateSchema
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

function requireAdminRole(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin role required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota temporária para transformar usuário em admin (remover em produção)
  app.get("/api/make-admin/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      const updatedUser = await storage.updateUser(userId, { role: "admin" });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Falha ao atualizar usuário" });
      }
      
      res.status(200).json({ message: "Usuário promovido a administrador com sucesso!", user: updatedUser });
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      res.status(500).json({ message: "Erro ao promover usuário" });
    }
  });
  
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
      console.log("Recebendo solicitação para criar perfil de motorista:", req.body);
      
      // Verificar se o usuário já é motorista
      const existingDriver = await storage.getDriverByUserId(req.user!.id);
      if (existingDriver) {
        return res.status(400).json({ message: "Você já tem um perfil de motorista" });
      }
      
      // Validate driver data
      const driverData = insertDriverSchema.parse({
        ...req.body,
        userId: req.user!.id,
        balance: 0,
        averageRating: 0,
        totalRatings: 0,
        isAvailable: true,
        latitude: 0,
        longitude: 0
      });
      
      console.log("Dados validados do motorista:", driverData);
      
      // Update user role to driver
      await storage.updateUser(req.user!.id, { role: "driver" });
      
      // Create the driver profile
      const driver = await storage.createDriver(driverData);
      console.log("Perfil de motorista criado com sucesso:", driver);
      
      // Get the updated user
      const updatedUser = await storage.getUser(req.user!.id);
      
      res.status(201).json({
        driver,
        user: updatedUser
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Erro de validação ao criar motorista:", validationError);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Erro ao criar perfil de motorista:", error);
      res.status(500).json({ message: "Falha ao criar perfil de motorista" });
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
      
      // Get withdrawal requests for this driver
      const withdrawalRequests = await storage.getWithdrawalRequestsByDriver(driver.id);
      const pendingWithdrawals = withdrawalRequests.filter(wr => wr.status === "pending");
      
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
          totalRatings: driver.totalRatings,
          pendingWithdrawals: pendingWithdrawals.length
        },
        pendingFreights: pendingFreights.length,
        withdrawalRequests: withdrawalRequests
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

  // Withdrawal Request API
  app.post("/api/driver/withdrawal-request", requireDriverRole, async (req, res) => {
    try {
      // Validate withdrawal request data
      const { amount, pixKey, bankInfo } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
      }
      
      if (!pixKey && !bankInfo) {
        return res.status(400).json({ message: "Either PIX key or bank information is required" });
      }
      
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      // Check if driver has sufficient balance
      if (driver.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance for withdrawal" });
      }
      
      // Check if driver has pending withdrawal requests
      const withdrawalRequests = await storage.getWithdrawalRequestsByDriver(driver.id);
      const pendingWithdrawals = withdrawalRequests.filter(wr => wr.status === "pending");
      
      if (pendingWithdrawals.length > 0) {
        return res.status(400).json({ 
          message: "You already have pending withdrawal requests",
          pendingRequests: pendingWithdrawals 
        });
      }
      
      // Create withdrawal request
      const withdrawalData = insertWithdrawalRequestSchema.parse({
        driverId: driver.id,
        amount,
        status: "pending",
        pixKey: pixKey || null,
        bankInfo: bankInfo || null,
        requestDate: new Date()
      });
      
      const request = await storage.createWithdrawalRequest(withdrawalData);
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating withdrawal request:", error);
      res.status(500).json({ message: "Failed to create withdrawal request" });
    }
  });

  // Get driver's withdrawal requests
  app.get("/api/driver/withdrawal-requests", requireDriverRole, async (req, res) => {
    try {
      // Find driver record by user ID
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver profile not found" });
      }
      
      // Get all withdrawal requests for this driver
      const requests = await storage.getWithdrawalRequestsByDriver(driver.id);
      
      res.json(requests);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      res.status(500).json({ message: "Failed to fetch withdrawal requests" });
    }
  });

  // Driver highlight API
  app.post("/api/driver/highlight", requireDriverRole, async (req, res) => {
    try {
      // Validar os dados do destaque
      const highlightData = highlightUpdateSchema.parse(req.body);
      
      // Encontrar o motorista pelo ID do usuário
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Perfil de motorista não encontrado" });
      }
      
      // Obter os dias de destaque e o status
      const { days, isHighlighted } = highlightData;
      
      // Atualizar o destaque do motorista
      const updatedDriver = await storage.updateDriverHighlight(
        driver.id, 
        isHighlighted, 
        days
      );
      
      if (!updatedDriver) {
        return res.status(404).json({ message: "Erro ao atualizar o destaque do motorista" });
      }
      
      res.json({
        success: true,
        driver: updatedDriver
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Erro ao destacar motorista:", error);
      res.status(500).json({ message: "Falha ao destacar o perfil do motorista" });
    }
  });
  
  // Driver subscription API
  app.post("/api/driver/subscription", requireDriverRole, async (req, res) => {
    try {
      // Validar os dados da assinatura
      const { subscriptionType } = req.body;
      
      if (!subscriptionType || !["basic", "premium", "vip"].includes(subscriptionType)) {
        return res.status(400).json({ message: "Tipo de assinatura inválido" });
      }
      
      // Encontrar o motorista pelo ID do usuário
      const driver = await storage.getDriverByUserId(req.user!.id);
      if (!driver) {
        return res.status(404).json({ message: "Perfil de motorista não encontrado" });
      }
      
      // Atualizar a assinatura do motorista
      const updatedDriver = await storage.updateDriverSubscription(
        driver.id,
        subscriptionType
      );
      
      if (!updatedDriver) {
        return res.status(404).json({ message: "Erro ao atualizar a assinatura do motorista" });
      }
      
      res.json({
        success: true,
        driver: updatedDriver
      });
    } catch (error) {
      console.error("Erro ao atualizar assinatura:", error);
      res.status(500).json({ message: "Falha ao atualizar assinatura do motorista" });
    }
  });

  // Admin API routes
  // Admin dashboard statistics
  app.get("/api/admin/stats", requireAdminRole, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ message: "Failed to fetch system statistics" });
    }
  });

  // Admin drivers list with user data
  app.get("/api/admin/drivers", requireAdminRole, async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      
      // Fetch user data for each driver
      const driversWithUserInfo = await Promise.all(
        drivers.map(async (driver) => {
          const user = await storage.getUser(driver.userId);
          return {
            ...driver,
            user: user || undefined
          };
        })
      );
      
      res.json(driversWithUserInfo);
    } catch (error) {
      console.error("Error fetching drivers for admin:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  // Admin withdrawal requests
  app.get("/api/admin/withdrawal-requests", requireAdminRole, async (req, res) => {
    try {
      const requests = await storage.getPendingWithdrawalRequests();
      
      // Fetch driver and user data for each request
      const requestsWithInfo = await Promise.all(
        requests.map(async (request) => {
          const driver = await storage.getDriver(request.driverId);
          let driverWithUser = { ...driver };
          
          if (driver) {
            const user = await storage.getUser(driver.userId);
            if (user) {
              driverWithUser.user = user;
            }
          }
          
          return {
            ...request,
            driver: driverWithUser
          };
        })
      );
      
      res.json(requestsWithInfo);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      res.status(500).json({ message: "Failed to fetch withdrawal requests" });
    }
  });

  // Process withdrawal request
  app.put("/api/admin/withdrawal-requests/:id/process", requireAdminRole, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
      }
      
      // Get the withdrawal request
      const request = await storage.getWithdrawalRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Withdrawal request not found" });
      }
      
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Can only process pending withdrawal requests" });
      }
      
      // Update the request
      const updatedRequest = await storage.updateWithdrawalRequest(requestId, {
        status,
        processedBy: req.user!.id,
        processedDate: new Date(),
        notes: notes || null
      });
      
      // If approved, create a transaction record
      if (status === "approved") {
        await storage.createTransaction({
          type: "withdrawal",
          amount: request.amount,
          description: `Withdrawal approved by admin: ${req.user!.name}`,
          status: "completed",
          driverId: request.driverId,
          transactionDate: new Date(),
          paymentMethod: "pix",
          paymentDetails: request.pixKey || ""
        });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error processing withdrawal request:", error);
      res.status(500).json({ message: "Failed to process withdrawal request" });
    }
  });

  // System settings CRUD
  app.get("/api/admin/settings", requireAdminRole, async (req, res) => {
    try {
      const settings = await storage.getAllSystemSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ message: "Failed to fetch system settings" });
    }
  });

  app.get("/api/admin/settings/:category", requireAdminRole, async (req, res) => {
    try {
      const settings = await storage.getSystemSettingsByCategory(req.params.category);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching system settings by category:", error);
      res.status(500).json({ message: "Failed to fetch system settings" });
    }
  });

  app.post("/api/admin/settings", requireAdminRole, async (req, res) => {
    try {
      const settingData = insertSystemSettingSchema.parse({
        ...req.body,
        updatedBy: req.user!.id
      });
      
      const setting = await storage.createSystemSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating system setting:", error);
      res.status(500).json({ message: "Failed to create system setting" });
    }
  });

  app.put("/api/admin/settings/:key", requireAdminRole, async (req, res) => {
    try {
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }
      
      const setting = await storage.getSystemSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      const updatedSetting = await storage.updateSystemSetting(
        req.params.key,
        value,
        req.user!.id
      );
      
      res.json(updatedSetting);
    } catch (error) {
      console.error("Error updating system setting:", error);
      res.status(500).json({ message: "Failed to update system setting" });
    }
  });

  // Fee management
  app.post("/api/admin/fees", requireAdminRole, async (req, res) => {
    try {
      const { feeType, value, description } = req.body;
      
      // Validate fee data
      const feeData = feeUpdateSchema.parse({
        feeType,
        value,
        description,
        category: "fees"
      });
      
      // Create the setting with the key based on fee type
      const setting = await storage.createSystemSetting({
        key: `fee_${feeData.feeType}`,
        value: feeData.value,
        description: feeData.description || `System fee for ${feeData.feeType}`,
        category: feeData.category,
        updatedBy: req.user!.id
      });
      
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating fee:", error);
      res.status(500).json({ message: "Failed to create fee" });
    }
  });
  
  app.put("/api/admin/fees/:feeType", requireAdminRole, async (req, res) => {
    try {
      const { value, description } = req.body;
      const { feeType } = req.params;
      
      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }
      
      // Validate fee type
      if (!["base", "distance", "time", "weight", "size", "urgent", "special", "platform"].includes(feeType)) {
        return res.status(400).json({ message: "Invalid fee type" });
      }
      
      const key = `fee_${feeType}`;
      
      // Check if the fee setting exists
      const setting = await storage.getSystemSetting(key);
      
      if (!setting) {
        // If it doesn't exist, create it
        const newSetting = await storage.createSystemSetting({
          key,
          value,
          description: description || `System fee for ${feeType}`,
          category: "fees",
          updatedBy: req.user!.id
        });
        
        return res.status(201).json(newSetting);
      }
      
      // If it exists, update it
      const updatedSetting = await storage.updateSystemSetting(
        key,
        value,
        req.user!.id
      );
      
      // If description was provided, update it too
      if (description && setting.description !== description) {
        // Note: This is just a workaround since our updateSystemSetting only updates the value
        // In a real system, we would modify the updateSystemSetting to handle this properly
        const settingWithUpdatedDesc = {
          ...updatedSetting,
          description
        };
        
        return res.json(settingWithUpdatedDesc);
      }
      
      res.json(updatedSetting);
    } catch (error) {
      console.error("Error updating fee:", error);
      res.status(500).json({ message: "Failed to update fee" });
    }
  });
  
  app.get("/api/admin/fees", requireAdminRole, async (req, res) => {
    try {
      // Get settings in the "fees" category
      const settings = await storage.getSystemSettingsByCategory("fees");
      
      // Convert to a more user-friendly format
      const fees = settings.map(setting => {
        const feeType = setting.key.replace("fee_", "");
        return {
          feeType,
          value: setting.value,
          description: setting.description,
          updatedBy: setting.updatedBy,
          updatedAt: setting.updatedAt
        };
      });
      
      res.json(fees);
    } catch (error) {
      console.error("Error fetching fees:", error);
      res.status(500).json({ message: "Failed to fetch fees" });
    }
  });

  // User management
  app.get("/api/admin/users", requireAdminRole, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/:role", requireAdminRole, async (req, res) => {
    try {
      const users = await storage.getUsersByRole(req.params.role);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
