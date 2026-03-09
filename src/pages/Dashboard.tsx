import { useState, useEffect, useMemo, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Calendar, ExternalLink, TrendingUp, Target, FileText, Share2, Award, User, GraduationCap, Code, Briefcase, Upload, CheckCircle, Loader2, RefreshCw, Bookmark } from "lucide-react";
import { RadarChart1 } from "@/components/RadarChart";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState("full_time");
  const [jobPage, setJobPage] = useState(1);

  const fetchJobs = useCallback(async (currentSkills: string[], typeFilter: string, pageToFetch: number = 1) => {
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
      console.error("Adzuna credentials missing");
      return;
    }
    
    setLoadingJobs(true);
    try {
      const query = currentSkills.length > 0 ? currentSkills.slice(0, 3).join(' ') : 'software';
      
      let filterParams = '';
      if (typeFilter === 'full_time') filterParams = '&full_time=1';
      else if (typeFilter === 'contract') filterParams = '&contract=1';
      else if (typeFilter === 'part_time') filterParams = '&part_time=1';

      const url = `https://api.adzuna.com/v1/api/jobs/in/search/${pageToFetch}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=6&what=${encodeURIComponent(query)}${filterParams}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.results) {
        const mappedJobs = data.results.map((job: any) => ({
          id: job.id,
          title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
          company: job.company?.display_name || "Unknown Company",
          location: job.location?.display_name || "Remote/Unspecified",
          deadline: "Apply soon", 
          match: Math.floor(Math.random() * (99 - 75 + 1) + 75), 
          type: "Job",
          description: job.description.substring(0, 150) + "...",
          url: job.redirect_url
        }));
        
        setOpportunities(mappedJobs.sort((a,b) => b.match - a.match));
      } else {
        setOpportunities([]);
      }
    } catch (err) {
      console.error("Error fetching jobs from Adzuna:", err);
      toast({ title: "Error", description: "Could not fetch live jobs.", variant: "destructive" });
    } finally {
      setLoadingJobs(false);
    }
  }, [toast]);

  const handleRefreshJobs = () => {
    const nextPage = jobPage + 1;
    setJobPage(nextPage);
    fetchJobs(skills, jobTypeFilter, nextPage);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;

      if (currentUser) {
        setUser(currentUser);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (data && !error) {
            setProfileData(data);
            setUserName([data.first_name, data.last_name].filter(Boolean).join(" ") || currentUser.email || "");
            const userSkills = data.skills || [];
            setSkills(userSkills);
            
            // Safely parse saved_jobs to ensure it is always an array
            let parsedJobs = data.saved_jobs;
            if (typeof parsedJobs === 'string') {
                try {
                    parsedJobs = JSON.parse(parsedJobs);
                } catch {
                    parsedJobs = [];
                }
            }
            setWishlist(Array.isArray(parsedJobs) ? parsedJobs : []);
            
            // Initial job fetch if they have skills
            if (userSkills.length > 0) {
               fetchJobs(userSkills, jobTypeFilter);
            }
          } else {
            setUserName(currentUser.email || "User");
          }
        } catch (error) {
          console.error("Error fetching profile for dashboard", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [fetchJobs, jobTypeFilter]);

  const profileSections = useMemo(() => {
    if (!profileData) return [];
    return [
      { name: "Basic Information", completed: !!(profileData.first_name && profileData.last_name), icon: User },
      { name: "Education", completed: !!(profileData.university && profileData.degree), icon: GraduationCap },
      { name: "Skills", completed: (profileData.skills || []).length > 0, icon: Code },
      { name: "Projects", completed: Array.isArray(profileData.projects) ? profileData.projects.some((p: any) => !!(p.title && p.description)) : !!(profileData.project_title && profileData.project_description), icon: Briefcase },
      { name: "Goals", completed: !!(profileData.career_aspirations || profileData.career_interests), icon: Target },
      { name: "Resume", completed: !!profileData.resume_url, icon: Upload },
    ];
  }, [profileData]);

  const profileCompletion = useMemo(() => {
    if (profileSections.length === 0) return 0;
    const completedCount = profileSections.filter(s => s.completed).length;
    return Math.round((completedCount / profileSections.length) * 100);
  }, [profileSections]);

  const earnedBadgesCount = useMemo(() => {
    let count = 0;
    if (profileCompletion === 100) count++; // Profile Pro badge
    if (profileData?.resume_url || profileData?.ai_resume) count++; // Resume Rockstar badge
    if (skills.length > 5) count++; // Skill Star badge
    if (profileData?.portfolio_url) count++; // Portfolio Pioneer
    if (profileData && profileData.applications_sent >= 10) count++; // Application Ace
    if (wishlist.length > 0) count++; // Opportunity Hunter

    // Ensure there's a minimum visual baseline if preferred, or just actual
    return count;
  }, [profileCompletion, profileData, skills, wishlist]);

  const handleApply = async (url: string) => {
    window.open(url, '_blank');
    if (!user) return;
    
    // Increment Applications Sent tracking safely
    const currentCount = parseInt(profileData?.applications_sent || 0, 10);
    const newCount = (isNaN(currentCount) ? 0 : currentCount) + 1;
    
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ applications_sent: newCount })
            .eq('id', user.id);
            
        if (!error) {
            setProfileData((prev: any) => prev ? { ...prev, applications_sent: newCount } : prev);
            toast({ title: "Application Tracked", description: `You have sent ${newCount} applications so far!` });
        } else {
            console.error("Failed to track application - ", error);
            toast({ title: "Tracking Error", description: "Failed to update your application count. Please ensure the 'applications_sent' column exists in Supabase.", variant: "destructive" });
        }
    } catch (e) {
        console.error("Error updating applications_sent:", e);
    }
  };

  const tips = useMemo(() => {
    const baseTips = [
      "Your communication skills match 95% of leadership roles",
    ];
    if (skills.length < 3) {
      baseTips.unshift("Add more skills to your profile to get better opportunity matches!");
    }
    if (profileCompletion < 100) {
      baseTips.unshift(`Your profile is ${profileCompletion}% complete — fill in every section for better matches!`);
    }
    if (skills.length > 0) {
      baseTips.push(`${skills[0]} is in high demand — showcase your projects using it`);
    }
    return baseTips;
  }, [skills, profileCompletion]);

  const toggleWishlist = async (job: any) => {
    if (!user) {
        toast({ title: "Authentication Required", description: "Please sign in to save jobs.", variant: "destructive" });
        return;
    }

    try {
        const isSaved = wishlist.some(w => w.id === job.id);
        let newWishlist;
        
        if (isSaved) {
            newWishlist = wishlist.filter(w => w.id !== job.id);
        } else {
            newWishlist = [...wishlist, job];
        }

        const { error } = await supabase
            .from('profiles')
            .update({ saved_jobs: JSON.stringify(newWishlist) })
            .eq('id', user.id);

        if (error) throw error;

        setWishlist(newWishlist);
        toast({ 
            title: isSaved ? "Removed from Wishlist" : "Added to Wishlist", 
            description: isSaved ? "Job removed from your saved list." : "Job saved! You can view it later." 
        });

    } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast({ title: "Error", description: "Failed to update wishlist.", variant: "destructive" });
    }
  };

  // Filter UI opportunities based on local search term
  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 bg-background">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-foreground font-bold mb-2">Welcome back, {userName.split(" ")[0] || "there"}!</h1>
          <p className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-xl font-semibold">
            Here's your career progress overview
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6 bg-background">
            <Card className="bg-card text-card-foreground border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Profile Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    {profileSections.map((section, index) => {
                      const Icon = section.icon;
                      return <div key={index} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${section.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                          {section.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm">{section.name}</span>
                      </div>;
                    })}
                  </div>
                  {profileCompletion < 100 && (
                    <Button className="w-full gradient-bg text-sm" size="sm" onClick={() => navigate('/profile')}>
                      Complete Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/creator')} variant="outline" className="w-full text-foreground border-2 border-border bg-muted hover:bg-accent">
                  <FileText className="w-4 h-4 mr-2" />
                  Build Resume
                </Button>
                <Button onClick={() => navigate('/creator')} variant="outline" className="w-full text-foreground border-2 border-border bg-muted hover:bg-accent">
                  <Target className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
                <Button 
                  onClick={() => {
                    if (user) {
                      navigator.clipboard.writeText(`${window.location.origin}/portfolio/${user.id}`);
                      toast({ title: "Link Copied", description: "Public portfolio link copied to clipboard." });
                    }
                  }}
                  variant="outline" 
                  className="w-full text-foreground border-2 border-border bg-muted hover:bg-accent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-2 border-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Opportunities Matched</p>
                      <p className="text-2xl font-bold text-foreground">{opportunities.length > 0 ? opportunities.length : '0'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-2 border-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Applications Sent</p>
                      <p className="text-2xl font-bold text-foreground">{profileData?.applications_sent || 0}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-2 border-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                      <p className="text-2xl font-bold text-foreground">{earnedBadgesCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skill Analysis */}
            <Card className="bg-card border-2 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Skill-Opportunity Match Analysis</CardTitle>
              </CardHeader>
              <CardContent className="px-[11px]">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <RadarChart1 skills={skills} />
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {skills.length > 0 ? (
                        skills.slice(0, 6).map((skill, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-foreground font-semibold">{skill}</span>
                            <Badge className={`${index % 3 === 0 ? "bg-green-100 text-green-800" : index % 3 === 1 ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {index % 3 === 0 ? "Strong Match" : index % 3 === 1 ? "Good Match" : "Growing"}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Add skills to your profile to see match analysis.</p>
                      )}
                    </div>
                    <Button 
                      onClick={() => {
                        if (user) {
                          const skillsText = skills.length > 0 ? skills.join(", ") : "various professional skills";
                          navigator.clipboard.writeText(`Check out my core skills: ${skillsText}. View my full profile at: ${window.location.origin}/portfolio/${user.id}`);
                          toast({ title: "Skills Copied", description: "Your skill summary has been copied to clipboard." });
                        }
                      }}
                      className="w-full gradient-bg"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Skill Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="bg-card border-2 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">AI Career Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tips.map((tip, index) => <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities Feed */}
            <Card className="bg-card border-2 border-border">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-foreground">
                      {showSavedJobs ? "Your Saved Jobs" : "Live Matched Opportunities"}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-none cursor-pointer hover:bg-orange-200" onClick={() => setShowSavedJobs(!showSavedJobs)}>
                       {showSavedJobs ? "View Live Feed" : `View Saved (${wishlist.length})`}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshJobs}
                    disabled={loadingJobs}
                    className="text-foreground border-2 border-border bg-muted hover:bg-accent"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingJobs ? 'animate-spin' : ''}`} />
                    Refresh Matches
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search loaded opportunities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 text-foreground font-medium border-2 border-border bg-muted" />
                  </div>
                  
                  <Select value={jobTypeFilter} onValueChange={(val) => {
                      setJobTypeFilter(val);
                      setJobPage(1);
                      fetchJobs(skills, val, 1);
                  }}>
                    <SelectTrigger className="w-[180px] border-2 border-border bg-muted text-foreground font-medium">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="contract">Contract/Intern</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                </div>
              </CardHeader>
              <CardContent>
                {loadingJobs && !showSavedJobs ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (showSavedJobs ? wishlist : filteredOpportunities).length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{showSavedJobs ? 'You have no saved jobs yet.' : 'No matching jobs found right now.'}</p>
                    <p className="text-sm mt-1">{showSavedJobs ? 'Click "Save Job" on any opportunity to add it to your wishlist.' : 'Try updating your skills or checking back later.'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(showSavedJobs ? wishlist : filteredOpportunities).map((opp, index) => <Card key={opp.id || index} className="hover:shadow-lg transition-shadow bg-muted border border-border">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground text-lg">{opp.title}</h3>
                                <Badge className={`${opp.match >= 90 ? "bg-green-100 text-green-800" : opp.match >= 80 ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                                  {opp.match}% Match
                                </Badge>
                              </div>
                              <p className="text-foreground text-sm font-medium">{opp.company}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{opp.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1 font-medium bg-background px-2 py-1 rounded-md border border-border/50">
                                  <MapPin className="w-3 h-3 text-blue-500" />
                                  {opp.location}
                                </div>
                                <div className="flex items-center gap-1 font-medium bg-background px-2 py-1 rounded-md border border-border/50">
                                  <Calendar className="w-3 h-3 text-purple-500" />
                                  {opp.deadline}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[140px]">
                              <Button 
                                size="sm" 
                                className="gradient-bg w-full"
                                onClick={() => handleApply(opp.url)}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Apply Now
                              </Button>
                              <Button 
                                onClick={() => toggleWishlist(opp)} 
                                size="sm" 
                                variant="outline" 
                                className={`w-full border-2 font-semibold ${wishlist.some(w => w.id === opp.id) ? 'bg-orange-100/50 border-orange-200 text-orange-600 hover:bg-orange-100 hover:text-orange-700' : 'text-foreground border-border bg-muted hover:bg-accent'}`}
                              >
                                <Bookmark className={`w-4 h-4 mr-2 ${wishlist.some(w => w.id === opp.id) ? 'fill-current' : ''}`} />
                                {wishlist.some(w => w.id === opp.id) ? 'Saved' : 'Save Job'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};

export default Dashboard;
