import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, FileText, Share2, Award, Users, TrendingUp, Copy, ExternalLink } from "lucide-react";

const BadgesSharing = () => {
  const earnedBadges = [{
    name: "Profile Pro",
    description: "Completed your profile with 100% accuracy",
    icon: Star,
    color: "bg-yellow-500",
    earned: true,
    earnedDate: "March 1, 2024"
  }, {
    name: "Resume Rockstar",
    description: "Generated your first AI-powered resume",
    icon: FileText,
    color: "bg-blue-500",
    earned: true,
    earnedDate: "March 3, 2024"
  }, {
    name: "Opportunity Hunter",
    description: "Matched with 25+ opportunities",
    icon: Target,
    color: "bg-green-500",
    earned: true,
    earnedDate: "March 5, 2024"
  }, {
    name: "Portfolio Pioneer",
    description: "Created your first portfolio microsite",
    icon: Award,
    color: "bg-purple-500",
    earned: false,
    progress: 75
  }, {
    name: "Application Ace",
    description: "Applied to 10 opportunities",
    icon: Trophy,
    color: "bg-red-500",
    earned: false,
    progress: 40
  }, {
    name: "Skill Star",
    description: "Added 20+ skills to your profile",
    icon: Star,
    color: "bg-orange-500",
    earned: false,
    progress: 85
  }];
  const shareableContent = [{
    type: "Skill Match",
    title: "92% match for Google Data Science Internship!",
    description: "My AI-analyzed skills align perfectly with this opportunity",
    image: "/api/placeholder/300/200",
    platforms: ["X", "LinkedIn"]
  }, {
    type: "Portfolio",
    title: "Check out my AI-crafted portfolio!",
    description: "CareerCanvas helped me create this professional showcase",
    image: "/api/placeholder/300/200",
    platforms: ["X", "LinkedIn", "Email"]
  }, {
    type: "Achievement",
    title: "Just earned my Resume Rockstar badge!",
    description: "Generated my first ATS-optimized resume with AI",
    image: "/api/placeholder/300/200",
    platforms: ["X", "LinkedIn"]
  }];
  const communityStats = [{
    label: "Students Helped",
    value: "50,000+",
    change: "+12%"
  }, {
    label: "Opportunities Matched",
    value: "2.5M+",
    change: "+8%"
  }, {
    label: "Resumes Generated",
    value: "125K+",
    change: "+15%"
  }, {
    label: "Success Stories",
    value: "3,200+",
    change: "+20%"
  }];
  return <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="max-w-6xl mx-auto ">
          <div className=" text-center mb-8 bg-blue-100 rounded-md p-4">
            <h1 className="text-3xl font-bold mb-4 text-zinc-950">Badges & Sharing</h1>
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-2xl font-semibold">
              Celebrate your achievements and share your career journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Badges Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-black bg-gradient-to-r from-blue-500 to-purple-600">
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-black" />
                    <h1 className=" text-black font-semibold">Your Badges</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {earnedBadges.map((badge, index) => {
                    const Icon = badge.icon;
                    return <Card key={index} className="bg-slate-950">
                          <CardContent className="p-4 border-black border-2 rounded-2xl bg-black">
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${badge.color}`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-zinc-50">{badge.name}</h3>
                                  {badge.earned && <Badge className="bg-green-100 text-green-800 text-xs">Earned</Badge>}
                                </div>
                                <p className="text-sm mb-2 text-zinc-50">{badge.description}</p>
                                {badge.earned ? <p className="text-xs text-zinc-100">Earned on {badge.earnedDate}</p> : <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-zinc-50">Progress</span>
                                      <span>{badge.progress}%</span>
                                    </div>
                                    <Progress value={badge.progress} className="h-2" />
                                  </div>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>;
                  })}
                  </div>
                </CardContent>
              </Card>

              {/* Shareable Content */}
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-black ">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-md">
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-black" />
                    <h1 className="text-black font-semibold">Share Your Success</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shareableContent.map((content, index) => <Card key={index} className="hover:shadow-lg transition-shadow bg-lime-300">
                        <CardContent className="p-3 bg-lime-200 border-2 border-black rounded-xl">
                          <div className="flex gap-4">
                            <div className="w-20 h-16 rounded-lg flex items-center justify-center bg-amber-950">
                              <FileText className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{content.title}</h4>
                                <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                              </div>
                              <p className="text-sm mb-3 text-zinc-900">{content.description}</p>
                              <div className="flex gap-2">
                                {content.platforms.map(platform => <Button key={platform} size="sm" variant="outline" className="bg-zinc-50 text-zinc-950">
                                    <Share2 className="w-3 h-3 mr-1" />
                                    {platform}
                                  </Button>)}
                                <Button size="sm" variant="outline" className="bg-zinc-50 text-zinc-950">
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-black ">
                <CardHeader>
                  <CardTitle className="text-black">Badge Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">3/6</div>
                      <p className="text-sm text-zinc-950">Badges Earned</p>
                    </div>
                    <Progress value={50} className="h-3" />
                    <p className="text-sm text-center text-zinc-950">
                      50% complete - 3 more badges to unlock!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-black ">
                <CardHeader>
                  <CardTitle className="text-black">Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityStats.map((stat, index) => <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-zinc-950">{stat.label}</p>
                          <p className="font-semibold text-white">{stat.value}</p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs">{stat.change}</span>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-black ">
                <CardHeader>
                  <CardTitle className="text-black">Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-lime-200">
                      <p className="text-sm font-medium">"CareerCanvas helped me land my dream internship at Google!"</p>
                      <p className="text-xs mt-1 text-zinc-950">- Sarah M.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-lime-200">
                      <p className="text-sm font-medium">"The AI resume builder got me 3x more interviews!"</p>
                      <p className="text-xs mt-1 text-zinc-950">- Alex K.</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-zinc-950 bg-zinc-50">
                      <Users className="w-4 h-4 mr-2" />
                      View All Stories
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-black ">
                <CardHeader>
                  <CardTitle className="text-black">Viral Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-2xl">🚀</div>
                    <h3 className="font-semibold text-white">#CareerCanvasChallenge</h3>
                    <p className="text-sm text-zinc-950">
                      Share your before/after resume transformation and tag 3 friends!
                    </p>
                    <Button size="sm" className="gradient-bg w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BadgesSharing;
