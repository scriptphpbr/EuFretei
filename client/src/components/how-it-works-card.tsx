import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HowItWorksCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const HowItWorksCard = ({ icon, title, description }: HowItWorksCardProps) => {
  return (
    <Card className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
      <CardContent className="p-0">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-primary text-2xl mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default HowItWorksCard;
