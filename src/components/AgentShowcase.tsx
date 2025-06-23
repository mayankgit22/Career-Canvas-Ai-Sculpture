import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Search, Target, Lightbulb, FileText, Palette, Shield, BarChart3, Share2 } from "lucide-react";
const agents = [{
  name: "Profile Builder",
  category: "Data Analysis",
  icon: User,
  description: "Extracts and updates student skills, education, and goals using advanced NLP.",
  color: "bg-blue-500"
}, {
  name: "Opportunity Scraper",
  category: "Data Analysis",
  icon: Search,
  description: "Collects real-time opportunities from multiple APIs and job boards.",
  color: "bg-green-500"
}, {
  name: "Matcher Agent",
  category: "Data Analysis",
  icon: Target,
  description: "Uses ML to rank opportunities by relevance and identify skill gaps.",
  color: "bg-purple-500"
}, {
  name: "Insight Generator",
  category: "Data Analysis",
  icon: Lightbulb,
  description: "Analyzes trends and provides ATS-compatible application tips.",
  color: "bg-yellow-500"
}, {
  name: "Content Crafter",
  category: "Content Creation",
  icon: FileText,
  description: "Generates tailored resumes, CVs, and cover letters using generative AI.",
  color: "bg-red-500"
}, {
  name: "Designer Agent",
  category: "Content Creation",
  icon: Palette,
  description: "Creates professional visuals and templates adapted for different roles.",
  color: "bg-pink-500"
}, {
  name: "Polisher Agent",
  category: "Content Creation",
  icon: Shield,
  description: "Refines content for grammar, tone, and ATS optimization.And Make Lif Better",
  color: "bg-teal-500"
}, {
  name: "Visualizer Agent",
  category: "Data Analysis & Content",
  icon: BarChart3,
  description: "Generates interactive charts and skill-opportunity alignment visuals.",
  color: "bg-indigo-500"
}, {
  name: "Showcase Agent",
  category: "Content Creation",
  icon: Share2,
  description: "Compiles outputs into shareable portfolio microsites and PDFs.",
  color: "bg-orange-500"
}];
export const AgentShowcase = () => {
  return <div className="grid md:grid-cols-3 gap-6">
      {agents.map((agent, index) => <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">

            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className={`w-10 h-10 ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <agent.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {agent.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <p className="text-white text-sm leading-relaxed">
              {agent.description}
            </p>
          </CardContent>
        </Card>)}
    </div>;
};