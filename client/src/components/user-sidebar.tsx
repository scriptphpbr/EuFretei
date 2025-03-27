import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Bell,
  Truck,
  User,
  Settings,
  LogOut,
  Clock,
  History
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserSidebarProps {
  onLogout: () => void;
}

const UserSidebar = ({ onLogout }: UserSidebarProps) => {
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
        <div className="text-sm text-gray-400 mt-1">Painel do Usuário</div>
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage 
              src={user?.profileImage || ""} 
              alt={user?.name || "Usuário"} 
            />
            <AvatarFallback className="bg-primary text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || "Usuário"}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/dashboard") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          
          <Link href="/dashboard?tab=active">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              (isActive("/dashboard") && location.includes("tab=active"))
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Clock className="w-5 h-5" />
              <span>Fretes Ativos</span>
            </a>
          </Link>
          
          <Link href="/dashboard?tab=history">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              (isActive("/dashboard") && location.includes("tab=history"))
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <History className="w-5 h-5" />
              <span>Histórico</span>
            </a>
          </Link>
          
          <Link href="/notifications">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/notifications") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <Bell className="w-5 h-5" />
              <span>Notificações</span>
            </a>
          </Link>
          
          <Link href="/profile">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/profile") 
                ? "bg-primary bg-opacity-20" 
                : "hover:bg-white hover:bg-opacity-10"
            )}>
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </a>
          </Link>
          
          <Link href="/settings">
            <a className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive("/settings") 
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

export default UserSidebar;
