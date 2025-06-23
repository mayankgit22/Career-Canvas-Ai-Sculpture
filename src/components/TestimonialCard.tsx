import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  achievement: string;
}
export const TestimonialCard = ({
  name,
  role,
  company,
  quote,
  rating,
  achievement
}: TestimonialCardProps) => {
  return <Card className="h-full hover:shadow-lg transition-all duration-300 bg-transparent">
      <CardContent className="p-6 bg-slate-600 rounded-md">
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
        </div>
        
        <blockquote className="text-muted-foreground mb-6 leading-relaxed">
          "{quote}"
        </blockquote>
        
        <div className="space-y-3">
          <div>
            <div className="font-semibold text-white">{name}</div>
            <div className="text-sm text-muted-foreground">{role}</div>
            <div className="text-sm font-medium text-brand-green">{company}</div>
          </div>
          
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            ✨ {achievement}
          </Badge>
        </div>
      </CardContent>
    </Card>;
};