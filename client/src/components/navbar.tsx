import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  Menu, 
  X, 
  Truck, 
  LogOut, 
  UserCircle,
  LayoutDashboard,
  Home,
  Info,
  HelpCircle,
  Phone,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    });
  };
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <>
      <nav 
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm" 
            : "bg-white shadow-sm"
        )}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary text-3xl">
              <Truck className="h-8 w-8" />
            </span>
            <span className="font-bold text-xl text-gray-900">
              Frete<span className="text-primary">Já</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="#como-funciona" 
              className="text-gray-600 hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById("como-funciona");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Como Funciona
            </a>
            <a 
              href="#motoristas" 
              className="text-gray-600 hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById("motoristas");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Motoristas
            </a>
            <a 
              href="#seja-motorista" 
              className="text-gray-600 hover:text-primary transition"
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById("seja-motorista");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Seja Motorista
            </a>
            
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="text-gray-600 hover:text-primary transition"
                >
                  Entrar
                </Button>
                <Button onClick={() => navigate("/auth")}>
                  Cadastrar
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.profileImage || ""} 
                        alt={user.name || "User"} 
                      />
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleNavigation("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.role === "driver" && (
                    <DropdownMenuItem 
                      onClick={() => handleNavigation("/driver/dashboard")}
                      className="cursor-pointer"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      <span>Painel do Motorista</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleNavigation("/profile")}
                    className="cursor-pointer"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={user.profileImage || ""} 
                        alt={user.name || "User"} 
                      />
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleNavigation("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.role === "driver" && (
                    <DropdownMenuItem 
                      onClick={() => handleNavigation("/driver/dashboard")}
                      className="cursor-pointer"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      <span>Painel do Motorista</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleNavigation("/profile")}
                    className="cursor-pointer"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meus Dados</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 p-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Site Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/")}
              className="justify-start"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Página Inicial</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const section = document.getElementById("como-funciona");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Como Funciona</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const section = document.getElementById("motoristas");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>Motoristas</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/about")}
              className="justify-start"
            >
              <Info className="mr-2 h-4 w-4" />
              <span>Sobre Nós</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/partners")}
              className="justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Seja Motorista</span>
            </Button>
            
            {!user && (
              <div className="mt-4 flex flex-col gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleNavigation("/auth")}
                  className="w-full"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => handleNavigation("/auth")}
                  className="w-full"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
