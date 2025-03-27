import { Link, useLocation } from "wouter";
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
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DriverSidebarProps {
  onLogout: () => void;
  newFreights?: number;
}

const DriverSidebar = ({ onLogout, newFreights = 0 }: DriverSidebarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className="w-64 bg-gray-900 text-white h-full flex-shrink-0 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-primary text-2xl">
            <Truck className="h-6 w-6" />
          </span>
          <span className="font-bold text-lg">FreteJá</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">Painel do Motorista</div>
      </div>
      
      <div className="p-4 flex-1">
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
        
        <nav className="space-y-2">
          <Link href="/driver/dashboard">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/dashboard") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          
          <Link href="/driver/freights">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/freights") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Bell className="w-5 h-5" />
              <span>Fretes</span>
              {newFreights > 0 && (
                <Badge className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  {newFreights}
                </Badge>
              )}
            </a>
          </Link>
          
          <Link href="/driver/finances">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/finances") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Wallet className="w-5 h-5" />
              <span>Financeiro</span>
            </a>
          </Link>
          
          <Link href="/driver/documents">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/documents") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <FileText className="w-5 h-5" />
              <span>Documentos</span>
            </a>
          </Link>
          
          <Link href="/driver/plans">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/plans") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Star className="w-5 h-5" />
              <span>Planos e Destaques</span>
            </a>
          </Link>
          
          <Link href="/driver/profile">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/profile") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </a>
          </Link>
          
          <Link href="/driver/settings">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/driver/settings") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </a>
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="flex items-center gap-3 w-full justify-start text-white hover:bg-white hover:bg-opacity-10"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default DriverSidebar;
