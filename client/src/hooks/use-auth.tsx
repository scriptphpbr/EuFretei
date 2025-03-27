import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { 
  User, 
  LoginData, 
  UserRegistration, 
  DriverRegistration 
} from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerUserMutation: UseMutationResult<User, Error, UserRegistration>;
  registerDriverMutation: UseMutationResult<User, Error, DriverRegistration>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerUserMutation = useMutation({
    mutationFn: async (userData: UserRegistration) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const registerDriverMutation = useMutation({
    mutationFn: async (driverData: DriverRegistration) => {
      try {
        // First check if we're already logged in
        const currentUser = queryClient.getQueryData<User | null>(["/api/user"]);
        
        let userData;
        
        if (!currentUser) {
          // If not logged in, register a new user first
          const userRes = await apiRequest("POST", "/api/register", {
            username: driverData.username,
            password: driverData.password,
            name: driverData.name,
            email: driverData.email,
            phone: driverData.phone,
            role: "driver"
          });
          
          userData = await userRes.json();
          
          // Ensure we have a successful user registration before proceeding
          if (!userData || !userData.id) {
            throw new Error("Falha ao registrar usuário");
          }
        } else {
          // We're already logged in, use the current user
          userData = currentUser;
        }
        
        // Then create the driver profile
        const driverRes = await apiRequest("POST", "/api/drivers", {
          vehicleModel: driverData.vehicleModel,
          licensePlate: driverData.licensePlate,
          vehicleType: driverData.vehicleType,
          location: driverData.location,
          document: driverData.document
        });
        
        if (!driverRes.ok) {
          const errorData = await driverRes.json();
          throw new Error(errorData.message || "Falha ao criar perfil de motorista");
        }
        
        // Update user data with driver role
        const updatedUser = {
          ...userData,
          role: "driver"
        };
        
        return updatedUser;
      } catch (error) {
        console.error("Driver registration error:", error);
        throw error;
      }
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Driver registration successful",
        description: "Your driver account has been created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Driver registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerUserMutation,
        registerDriverMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
