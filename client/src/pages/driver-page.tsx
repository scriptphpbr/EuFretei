import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import DriverCard from "@/components/driver-card";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DriverPage = () => {
  const [search, setSearch] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [location, setLocation] = useState("");
  
  const { data: drivers, isLoading } = useQuery({
    queryKey: ["/api/drivers/available"],
    enabled: true,
  });
  
  // Filter and search logic
  const filteredDrivers = drivers?.filter(driver => {
    const nameMatches = driver.name.toLowerCase().includes(search.toLowerCase());
    const vehicleMatches = !vehicleType || driver.vehicleType === vehicleType;
    const locationMatches = !location || driver.location.includes(location);
    
    return nameMatches && vehicleMatches && locationMatches;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Todos os Motoristas</h1>
            <p className="text-gray-600">Encontre o motorista perfeito para seu frete</p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Pesquisar por nome..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Small Van">Furgão Pequeno</SelectItem>
                    <SelectItem value="Medium Van">Furgão Médio</SelectItem>
                    <SelectItem value="Truck">Caminhão</SelectItem>
                    <SelectItem value="Box Truck">Baú</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-64">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Curitiba">Curitiba</SelectItem>
                    <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setVehicleType("");
                  setLocation("");
                }}
                className="w-full md:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" /> Limpar Filtros
              </Button>
            </div>
          </div>
          
          {/* Drivers Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredDrivers && filteredDrivers.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDrivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nenhum motorista encontrado</h2>
              <p className="text-gray-600">Tente ajustar seus filtros de pesquisa</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverPage;
