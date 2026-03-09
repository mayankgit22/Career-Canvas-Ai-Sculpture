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
  return <Card className="border-2 border-border rounded hover:bg-accent cursor-pointer hover:scale-105 transition-all duration-175 bg-card">
      <CardHeader className="bg-card">
        <div className="bg-card">
          <Icon className="text-foreground" />
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-card">
        <p className="leading-relaxed text-foreground text-lg">{description}</p>
      </CardContent>
    </Card>;
};