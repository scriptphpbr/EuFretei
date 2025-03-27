import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Bell,
  Wallet,
  FileText,
  User,
  Settings,
  LogOut,
  Truck,
  Star,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DriverMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  newFreights?: number;
}

const DriverMobileMenu = ({ 
  isOpen, 
  onClose, 
  onLogout, 
  newFreights = 0 
}: DriverMobileMenuProps) => {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "D";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col md:hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-primary text-2xl">
            <Truck className="h-6 w-6" />
          </span>
          <span className="font-bold text-lg text-white">FreteJá</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col text-white">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage 
              src={user?.profileImage || ""} 
              alt={user?.name || "Motorista"} 
            />
            <AvatarFallback className="bg-primary text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || "Motorista"}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span>4.5</span>
            </div>
          </div>
        </div>
        
        <nav className="space-y-3">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/dashboard") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/freights") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/freights")}
          >
            <Bell className="w-5 h-5" />
            <span>Fretes</span>
            {newFreights > 0 && (
              <Badge className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                {newFreights}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/finances") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/finances")}
          >
            <Wallet className="w-5 h-5" />
            <span>Financeiro</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/documents") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/documents")}
          >
            <FileText className="w-5 h-5" />
            <span>Documentos</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/plans") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/plans")}
          >
            <Star className="w-5 h-5" />
            <span>Planos e Destaques</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/profile") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/profile")}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-3 w-full justify-start text-white",
              isActive("/driver/settings") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}
            onClick={() => handleNavigation("/driver/settings")}
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </Button>
        </nav>
        
        <Button
          variant="ghost"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="mt-auto flex items-center gap-3 justify-start text-white hover:bg-white hover:bg-opacity-10"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default DriverMobileMenu;
