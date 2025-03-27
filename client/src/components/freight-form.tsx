import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Form schema
const freightFormSchema = z.object({
  pickupAddress: z.string().min(5, "Endereço de retirada é obrigatório"),
  deliveryAddress: z.string().min(5, "Endereço de entrega é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  packageType: z.string().min(1, "Tipo de carga é obrigatório"),
  instructions: z.string().optional(),
  amount: z.number().positive("Valor deve ser positivo")
});

type FreightFormValues = z.infer<typeof freightFormSchema>;

interface FreightFormProps {
  onSubmit: (data: FreightFormValues) => void;
  isPending: boolean;
}

const FreightForm = ({ onSubmit, isPending }: FreightFormProps) => {
  const [estimatedAmount, setEstimatedAmount] = useState(120);
  
  // Set default date to today
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  // Initialize form
  const form = useForm<FreightFormValues>({
    resolver: zodResolver(freightFormSchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      date: formattedDate,
      time: "",
      packageType: "",
      instructions: "",
      amount: estimatedAmount
    }
  });
  
  // Update amount when form values change (simplified calculation for demo)
  const watchPickupAddress = form.watch("pickupAddress");
  const watchDeliveryAddress = form.watch("deliveryAddress");
  const watchPackageType = form.watch("packageType");
  
  useEffect(() => {
    // Simple mock calculation based on input length and package type
    let baseAmount = 100;
    
    // Add complexity based on address length (just for demo)
    if (watchPickupAddress.length > 0 && watchDeliveryAddress.length > 0) {
      baseAmount += Math.floor((watchPickupAddress.length + watchDeliveryAddress.length) / 10);
    }
    
    // Adjust based on package type
    switch (watchPackageType) {
      case "documents":
        baseAmount += 10;
        break;
      case "small":
        baseAmount += 20;
        break;
      case "medium":
        baseAmount += 40;
        break;
      case "large":
        baseAmount += 60;
        break;
      case "furniture":
        baseAmount += 100;
        break;
      default:
        break;
    }
    
    setEstimatedAmount(baseAmount);
    form.setValue("amount", baseAmount);
  }, [watchPickupAddress, watchDeliveryAddress, watchPackageType, form]);
  
  const handleSubmitForm = (values: FreightFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="pickupAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de retirada</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de entrega</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} min={formattedDate} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de carga</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="documents">Documentos</SelectItem>
                  <SelectItem value="small">Pequenos volumes</SelectItem>
                  <SelectItem value="medium">Volumes médios</SelectItem>
                  <SelectItem value="large">Volumes grandes</SelectItem>
                  <SelectItem value="furniture">Móveis</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções adicionais</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações importantes para o motorista" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="font-semibold text-lg mb-2">Valor estimado</div>
          <div className="text-2xl font-bold text-primary">R$ {estimatedAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-500">O valor final pode variar de acordo com a distância e o tipo de carga.</div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando...
            </span>
          ) : (
            "Ir para pagamento"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FreightForm;
