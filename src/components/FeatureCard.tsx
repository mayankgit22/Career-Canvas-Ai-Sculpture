import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  active?: boolean;
}
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  active = false
}: FeatureCardProps) => {
  return <Card className="border-2 border-black rounded hover:bg-gray-400 cursor-pointer hover:scale-105 transition-all duration-175">
      <CardHeader className="bg-gray-50">
        <div className="bg-gray-50">
          <Icon className="bg-gray-50" />
        </div>
        <CardTitle className="text-xl text-zinc-950">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-gray-50">
        <p className="leading-relaxed text-zinc-950 text-lg">{description}</p>
      </CardContent>
    </Card>;
};