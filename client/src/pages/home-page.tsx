import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HowItWorksCard from "@/components/how-it-works-card";
import DriverCard from "@/components/driver-card";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Truck, Users, Search, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: drivers, isLoading } = useQuery({
    queryKey: ["/api/drivers/available"],
    enabled: true,
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Seu frete na palma da <span className="text-primary">mão</span>
              </h1>
              <p className="text-lg text-neutral-700 mb-8">
                Conectamos você aos melhores motoristas de frete. Rápido, seguro e com o melhor preço.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    const driversSection = document.getElementById("motoristas");
                    driversSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-white px-6 py-6 rounded-lg transition shadow-md text-center font-medium"
                >
                  Buscar motoristas
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const driverSection = document.getElementById("seja-motorista");
                    driverSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-6 rounded-lg transition text-center font-medium"
                >
                  Seja um motorista
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="rounded-xl shadow-xl w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
                <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <g fill="#22C55E" opacity="0.2">
                    <path d="M400,600 L600,600 L600,800 L400,800 Z" />
                    <path d="M400,300 L600,300 L600,500 L400,500 Z" />
                    <path d="M700,400 L900,400 L900,600 L700,600 Z" />
                    <path d="M100,400 L300,400 L300,600 L100,600 Z" />
                  </g>
                  <g fill="#22C55E">
                    <path d="M550,550 L700,550 L700,700 L550,700 Z" />
                    <path d="M300,550 L450,550 L450,700 L300,700 Z" />
                    <path d="M500,350 L650,350 L650,500 L500,500 Z" />
                    <path d="M350,250 L500,250 L500,400 L350,400 Z" />
                  </g>
                  <g fill="#16A34A">
                    <path d="M800,300 L850,300 L850,350 L800,350 Z" />
                    <path d="M150,650 L200,650 L200,700 L150,700 Z" />
                    <path d="M700,700 L750,700 L750,750 L700,750 Z" />
                    <path d="M250,200 L300,200 L300,250 L250,250 Z" />
                  </g>
                </svg>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-medium">Mais de 500 motoristas online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Encontre o motorista ideal para seu frete em minutos, com segurança e praticidade.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksCard 
              icon={<Search className="w-8 h-8" />}
              title="Busque motoristas"
              description="Navegue pela nossa lista de motoristas disponíveis e encontre o ideal para seu frete."
            />
            
            <HowItWorksCard 
              icon={<FileText className="w-8 h-8" />}
              title="Solicite o frete"
              description="Informe os detalhes do seu frete e receba uma confirmação em tempo real."
            />
            
            <HowItWorksCard 
              icon={<Truck className="w-8 h-8" />}
              title="Acompanhe sua entrega"
              description="Monitore o status do seu frete e avalie o motorista após a conclusão."
            />
          </div>
        </div>
      </section>

      {/* Drivers Section */}
      <section id="motoristas" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Motoristas Disponíveis</h2>
              <p className="text-gray-600">Encontre o motorista ideal para seu frete</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input 
                  type="search" 
                  placeholder="Pesquisar motoristas..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {drivers && drivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg transition shadow-sm font-medium"
                  onClick={() => navigate("/drivers")}
                >
                  Ver mais motoristas
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Become a Driver Section */}
      <section id="seja-motorista" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-primary opacity-10 skew-x-12 -mr-20 hidden lg:block"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Seja um motorista parceiro</h2>
              <p className="text-gray-600 mb-6">
                Junte-se à nossa plataforma e comece a ganhar dinheiro fazendo fretes. Você define seus horários e aceita apenas os fretes que desejar.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="font-semibold text-xl mb-3">Vantagens</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="text-primary mt-1">✓</div>
                    <span>Liberdade para escolher seus horários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-primary mt-1">✓</div>
                    <span>Receba pagamentos diretamente na sua conta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-primary mt-1">✓</div>
                    <span>Suporte 24/7 para qualquer problema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="text-primary mt-1">✓</div>
                    <span>Ganhe mais com nosso sistema de avaliações</span>
                  </li>
                </ul>
              </div>
              
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-6 rounded-lg transition shadow-md text-center font-medium"
                onClick={() => navigate(user ? "/driver/register" : "/auth")}
              >
                Cadastrar como motorista
              </Button>
            </div>
            
            <div className="lg:w-1/2">
              <div className="rounded-xl shadow-xl w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
                <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <g fill="#F59E0B" opacity="0.2">
                    <path d="M400,600 L600,600 L600,800 L400,800 Z" />
                    <path d="M400,300 L600,300 L600,500 L400,500 Z" />
                    <path d="M700,400 L900,400 L900,600 L700,600 Z" />
                    <path d="M100,400 L300,400 L300,600 L100,600 Z" />
                  </g>
                  <g fill="#F59E0B">
                    <path d="M550,550 L700,550 L700,700 L550,700 Z" />
                    <path d="M300,550 L450,550 L450,700 L300,700 Z" />
                    <path d="M500,350 L650,350 L650,500 L500,500 Z" />
                    <path d="M350,250 L500,250 L500,400 L350,400 Z" />
                  </g>
                  <g fill="#D97706">
                    <path d="M800,300 L850,300 L850,350 L800,350 Z" />
                    <path d="M150,650 L200,650 L200,700 L150,700 Z" />
                    <path d="M700,700 L750,700 L750,750 L700,750 Z" />
                    <path d="M250,200 L300,200 L300,250 L250,250 Z" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
