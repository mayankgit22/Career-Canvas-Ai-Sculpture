import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  FileText, 
  Globe, 
  Download, 
  Share2, 
  Eye, 
  Edit3, 
  Palette, 
  Target, 
  CheckCircle, 
  Loader2, 
  Upload, 
  RefreshCw, 
  Save,
  Layout,
  ExternalLink,
  Copy
} from "lucide-react";
import PortfolioRenderer from "@/components/PortfolioRenderer";
import ResumeRenderer from "@/components/ResumeRenderer";
import { supabase, uploadAIResumeToStorage } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateAIResume, generateAIPortfolio, generateAICoverLetter } from "@/services/aiAgent";
import { Textarea } from "@/components/ui/textarea";

const ContentCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  
  // AI Generation States
  const [generatingResume, setGeneratingResume] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>("");
  const [isEditingGeneratedResume, setIsEditingGeneratedResume] = useState(false);
  
  const [generatingPortfolio, setGeneratingPortfolio] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<string>("");

  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>("");
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

            if (data && !error) {
            setProfileData(data);
            setResumeUrl(data.resume_url || "");
            setGeneratedResume(data.ai_resume || "");
            setGeneratedPortfolio(data.ai_portfolio || "");
            setGeneratedCoverLetter(data.ai_cover_letter || "");
          }
        } catch (error) {
          console.error("Error fetching profile for content creator", error);
        }
      }
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleProtectedAction = (actionName: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: `Please sign in to ${actionName}.`,
        variant: "destructive",
      });
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleGenerateAIResume = async () => {
    if (!handleProtectedAction("generate a resume")) return;
    if (!profileData) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile first to generate a tailored resume.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingResume(true);
    try {
      const content = await generateAIResume(profileData);
      setGeneratedResume(content);
      toast({
        title: "Resume Generated",
        description: "Your AI-tailored resume is ready for review.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate resume.",
        variant: "destructive",
      });
    } finally {
      setGeneratingResume(false);
    }
  };

  const handleGenerateAIPortfolio = async () => {
    if (!handleProtectedAction("generate a portfolio")) return;
    if (!profileData) {
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile first to generate a portfolio.",
          variant: "destructive",
        });
        return;
      }

    setGeneratingPortfolio(true);
    try {
      const content = await generateAIPortfolio(profileData);
      setGeneratedPortfolio(content);
      toast({
        title: "Portfolio Content Generated",
        description: "Your AI portfolio structure is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate portfolio.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPortfolio(false);
    }
  };

  const handleGenerateAICoverLetter = async () => {
    if (!handleProtectedAction("generate a cover letter")) return;
    if (!profileData) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile first to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    const opportunity = opportunities.find(o => o.id === selectedOpportunity) || opportunities[0];

    setGeneratingCoverLetter(true);
    try {
      const content = await generateAICoverLetter(profileData, opportunity);
      setGeneratedCoverLetter(content);
      toast({
        title: "Cover Letter Generated",
        description: "Your AI-tailored cover letter is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate cover letter.",
        variant: "destructive",
      });
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (generatedCoverLetter) {
      navigator.clipboard.writeText(generatedCoverLetter);
      toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
    } else {
      const fallbackText = `Dear ${selectedOpportunity === "google-internship" ? "Google" : "Meta"} Hiring Team,\n\nI am writing to express my strong interest in the ${selectedOpportunity === "google-internship" ? "Data Science Internship" : "Software Engineering Internship"} position at ${selectedOpportunity === "google-internship" ? "Google" : "Meta"}. ${profileData?.university ? `As a student at ${profileData.university}` : "As a dedicated student"}${profileData?.degree ? ` studying ${profileData.degree}` : ""}, I am excited about the opportunity to contribute to your innovative projects.\n\nThank you for considering my application.\n\nSincerely,\n${fullName || "Your Name"}`;
      navigator.clipboard.writeText(fallbackText);
      toast({ title: "Copied!", description: "Default cover letter copied to clipboard." });
    }
  };

  const handleDownloadResume = async () => {
    if (!handleProtectedAction("download your resume")) return;
    
    // If we have generated content, download that instead of the original file if preferred
    // For now, let's stick to downloading the uploaded file or the profile-based one
    if (!resumeUrl && !generatedResume) {
      toast({
        title: "No Resume Found",
        description: "Please upload or generate a resume first.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (generatedResume) {
        // Download generated resume as a text file for now (could be PDF with more libs)
        const blob = new Blob([generatedResume], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fullName.replace(/\s+/g, '_')}_AI_Resume.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const response = await fetch(resumeUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const ext = resumeUrl.split('.').pop()?.split('?')[0] || 'pdf';
        link.download = `${fullName.replace(/\s+/g, '_')}_resume.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: "Download Started",
        description: "Your resume is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the resume.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewResume = () => {
    if (!handleProtectedAction("preview your resume")) return;
    if (!resumeUrl && !generatedResume) {
      toast({
        title: "No Resume Found",
        description: "Please upload or generate a resume first.",
        variant: "destructive",
      });
      return;
    }
    if (generatedResume) {
      // In a real app, we might render this to a new window with styling
      toast({
        title: "Preview",
        description: "AI-generated resume is visible in the preview pane.",
      });
    } else {
      window.open(resumeUrl, '_blank');
    }
  };

  const handleShareResume = () => {
    if (!handleProtectedAction("share your resume")) return;
    const urlToShare = generatedResume ? "AI Generated Content" : resumeUrl;
    if (!urlToShare) {
      toast({
        title: "No Resume Found",
        description: "Nothing to share.",
        variant: "destructive",
      });
      return;
    }
    navigator.clipboard.writeText(urlToShare);
    toast({
      title: "Action Recorded",
      description: "Resume link/content copied.",
    });
  };

  const handleSaveAIContent = async (type: 'resume' | 'portfolio' | 'cover-letter') => {
    if (!handleProtectedAction(`save your ${type}`)) return;
    if (!profileData) return;

    const contentToSave = type === 'resume' ? generatedResume : (type === 'portfolio' ? generatedPortfolio : generatedCoverLetter);
    if (!contentToSave) {
      toast({
        title: "No Content",
        description: `Please generate a ${type} first.`,
        variant: "destructive",
      });
      return;
    }

    try {
      let finalDataToSave = contentToSave;

      // For resumes, upload to storage bucket directly as requested by the user
      if (type === 'resume') {
        toast({
          title: "Uploading Resume",
          description: "Saving document to your secure cloud storage...",
        });
        const publicUrl = await uploadAIResumeToStorage(user.id, contentToSave);
        finalDataToSave = publicUrl; // Save the URL instead of raw text
      }

      const updateData: any = {
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (type === 'resume') {
        updateData.ai_resume = finalDataToSave;
      } else if (type === 'portfolio') {
        updateData.ai_portfolio = finalDataToSave;
      } else {
        updateData.ai_cover_letter = finalDataToSave;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData);

      if (error) {
        if (error.message.includes("column") && error.message.includes("does not exist")) {
          throw new Error(`The database column 'ai_${type}' does not exist. Please add it to your 'profiles' table in Supabase.`);
        }
        throw error;
      }

      toast({
        title: "Saved Successfully",
        description: `Your AI-generated ${type} has been saved to your profile and storage bucket.`,
      });
    } catch (error: any) {
      console.error(`Error saving AI ${type}:`, error);
      toast({
        title: "Save Failed",
        description: error.message || `Failed to save ${type}.`,
        variant: "destructive",
      });
    }
  };

  // Build resume display data from profile
  const fullName = profileData ? [profileData.first_name, profileData.last_name].filter(Boolean).join(" ") : "";
  const skills = profileData?.skills || [];
  const projects = Array.isArray(profileData?.projects) ? profileData.projects : [];

  const [selectedOpportunity, setSelectedOpportunity] = useState("google-internship");
  const opportunities = [{
    id: "google-internship",
    title: "Google Data Science Internship",
    company: "Google",
    match: 92
  }, {
    id: "meta-internship",
    title: "Meta Software Engineering Internship",
    company: "Meta",
    match: 88
  }];
  const resumeTemplates = [{
    id: "tech",
    name: "Tech Professional",
    description: "Clean, ATS-optimized for tech roles"
  }, {
    id: "creative",
    name: "Creative",
    description: "Visual appeal for design roles"
  }, {
    id: "business",
    name: "Business",
    description: "Professional for business roles"
  }];

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

  return <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-bold mb-4 text-3xl md:text-4xl text-foreground">AI Content Creator</h1>
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold text-xl sm:text-2xl">
              Partner with AI agents to build your career materials
            </p>
          </div>

          <Tabs defaultValue="resume" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-muted border-2 border-border p-1">
              <TabsTrigger value="resume" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Resume/CV Agent</TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Portfolio Agent</TabsTrigger>
              <TabsTrigger value="cover-letter" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Cover Letter</TabsTrigger>
            </TabsList>

            <TabsContent value="resume" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-card border-2 border-border shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        AI Agent Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        onClick={handleGenerateAIResume} 
                        disabled={generatingResume}
                        className="w-full gradient-bg hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        {generatingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Personal Resume
                      </Button>
                      
                      <Button 
                        onClick={() => handleSaveAIContent('resume')}
                        variant="outline"
                        className="w-full border-border hover:bg-muted mb-2"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save to Profile
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          setGeneratedResume("");
                          setIsEditingGeneratedResume(false);
                        }}
                        variant="outline"
                        className="w-full border-border hover:bg-muted"
                      >
                        Reset/Clear
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Our Content Crafter agent will analyze your profile and create a tailored resume.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-2 border-border">
                    <CardHeader>
                      <CardTitle>Target Opportunity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {opportunities.map(opp => <div key={opp.id} onClick={() => setSelectedOpportunity(opp.id)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedOpportunity === opp.id ? "bg-blue-600/20 border border-blue-500" : "bg-muted hover:bg-accent border border-transparent"}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{opp.title}</p>
                                <p className="text-xs text-muted-foreground">{opp.company}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {opp.match}%
                              </Badge>
                            </div>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="bg-card border-2 border-border shadow-lg">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Resume Workspace
                        </CardTitle>
                        <div className="flex gap-2">
                          {generatedResume && (
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleSaveAIContent('resume')}
                                variant="outline" 
                                size="sm" 
                                className="border-border bg-muted hover:bg-accent flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" /> 
                                {isEditingGeneratedResume ? "Save Changes" : "Save to Profile"}
                              </Button>
                              <Button 
                                onClick={() => setIsEditingGeneratedResume(!isEditingGeneratedResume)} 
                                variant="outline" 
                                size="sm" 
                                className="border-border bg-muted hover:bg-accent flex items-center gap-2"
                              >
                                {isEditingGeneratedResume ? <><CheckCircle className="w-4 h-4" /> Done Editing</> : <><Edit3 className="w-4 h-4" /> Edit AI Result</>}
                              </Button>
                            </div>
                          )}
                          <Button onClick={handleGenerateAIResume} disabled={generatingResume} variant="ghost" size="sm" className="hover:bg-muted p-1">
                            <RefreshCw className={`w-4 h-4 ${generatingResume ? "animate-spin" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="min-h-[600px] border rounded-lg bg-white overflow-y-auto">
                        {generatingResume ? (
                          <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                            <p className="text-muted-foreground animate-pulse">Content Crafter is building your resume...</p>
                          </div>
                        ) : generatedResume ? (
                          isEditingGeneratedResume ? (
                            <Textarea 
                              value={generatedResume}
                              onChange={(e) => setGeneratedResume(e.target.value)}
                              className="w-full h-[600px] p-8 font-mono text-sm border-0 focus-visible:ring-0 text-black bg-white"
                            />
                          ) : (
                            <ResumeRenderer content={generatedResume} />
                          )
                        ) : resumeUrl ? (
                          <iframe src={resumeUrl} className="w-full h-[600px] border-0" title="Resume Preview" />
                        ) : (
                          <div className="h-[600px] flex flex-col items-center justify-center p-10 text-center space-y-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                              <Sparkles className="w-10 h-10 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold mb-2">No Content Yet</h3>
                              <p className="text-muted-foreground max-w-sm">
                                Use our AI Agent to generate a tailored resume based on your profile or upload one in settings.
                              </p>
                            </div>
                            <Button onClick={handleGenerateAIResume} className="gradient-bg">Generate with AI Agent</Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <Button onClick={handleDownloadResume} className="gradient-bg font-medium px-8 min-w-[120px]">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button onClick={handleShareResume} variant="outline" className="border-border bg-muted hover:bg-accent min-w-[120px]">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button onClick={handlePreviewResume} variant="outline" className="border-border bg-muted hover:bg-accent min-w-[120px]">
                          <Eye className="w-4 h-4 mr-2" />
                          Full View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-card border-2 border-border shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-500" />
                        Showcase Agent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        onClick={handleGenerateAIPortfolio} 
                        disabled={generatingPortfolio}
                        className="w-full gradient-bg hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        {generatingPortfolio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Portfolio Content
                      </Button>
                      
                      <p className="text-sm text-muted-foreground">
                        Our Showcase Agent creates a complete structure for your personal portfolio website.
                      </p>

                      {generatedPortfolio && (
                        <Button 
                          onClick={() => handleSaveAIContent('portfolio')}
                          variant="outline"
                          className="w-full border-border hover:bg-muted mb-2"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Portfolio Structure
                        </Button>
                      )}

                      <div className="pt-4 border-t space-y-2">
                        <h4 className="text-sm font-semibold">Stats Summary</h4>
                        <div className="flex justify-between text-xs">
                          <span>Projects:</span>
                          <span className="font-bold">{projects.length}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Skills:</span>
                          <span className="font-bold">{skills.length}</span>
                        </div>
                      </div>

                      {user && (
                        <div className="pt-4 border-t">
                          <Button 
                            variant="link" 
                            className="w-full text-blue-600 hover:text-blue-700 p-0 h-auto font-medium flex items-center justify-center gap-1"
                            onClick={() => window.open(`/portfolio/${user.id}`, '_blank')}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Public Portfolio
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="bg-card border-2 border-border shadow-lg">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-500" />
                        Portfolio Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="min-h-[400px] border rounded-lg bg-muted/30 p-8">
                        {generatingPortfolio ? (
                          <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                            <p className="text-muted-foreground">Showcase Agent is designing your portfolio...</p>
                          </div>
                        ) : generatedPortfolio ? (
                          <PortfolioRenderer content={generatedPortfolio} />
                        ) : (
                          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                            <Globe className="w-12 h-12 text-muted-foreground opacity-50" />
                            <h3 className="text-xl font-bold">Your Professional Showcase</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                              Let our AI Showcase Agent build a premium personal portfolio narrative for you.
                            </p>
                            <Button onClick={handleGenerateAIPortfolio} className="gradient-bg px-10">Generate Portfolio</Button>
                          </div>
                        )}
                      </div>
                      
                      {generatedPortfolio && (
                        <div className="flex justify-center gap-4 mt-8">
                          <Button variant="outline" onClick={handleGenerateAIPortfolio} className="border-border hover:bg-muted min-w-[150px]">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                          <Button 
                            onClick={() => handleSaveAIContent('portfolio')}
                            className="gradient-bg font-medium px-8 min-w-[150px]"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save to Profile
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cover-letter" className="space-y-6">
              <Card className="bg-card border-2 border-border shadow-lg">
                <CardHeader className="border-b flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Tailored Cover Letter
                  </CardTitle>
                  <div className="flex gap-2">
                    {generatedCoverLetter && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCopyCoverLetter}
                          variant="outline" 
                          size="sm" 
                          className="border-border bg-muted hover:bg-accent flex items-center gap-2 font-semibold"
                        >
                          <Copy className="w-4 h-4" /> 
                          Copy Letter
                        </Button>
                        <Button 
                          onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)} 
                          variant="outline" 
                          size="sm" 
                          className="border-border bg-muted hover:bg-accent flex items-center gap-2"
                        >
                          {isEditingCoverLetter ? <><CheckCircle className="w-4 h-4" /> Done Editing</> : <><Edit3 className="w-4 h-4" /> Edit AI Result</>}
                        </Button>
                      </div>
                    )}
                    <Button 
                      onClick={handleGenerateAICoverLetter} 
                      disabled={generatingCoverLetter}
                      variant="outline" 
                      size="sm" 
                      className="gradient-bg text-white border-0"
                    >
                      {generatingCoverLetter ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      Perfect with AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="bg-white border rounded-lg p-10 min-h-[500px] shadow-inner text-black prose max-w-none">
                    {generatingCoverLetter ? (
                      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        <p className="text-muted-foreground">AI is crafting your cover letter...</p>
                      </div>
                    ) : (generatedCoverLetter || isEditingCoverLetter) ? (
                      isEditingCoverLetter ? (
                        <Textarea 
                          value={generatedCoverLetter}
                          onChange={(e) => setGeneratedCoverLetter(e.target.value)}
                          className="w-full h-[500px] p-0 font-sans text-sm border-0 focus-visible:ring-0 text-black bg-transparent resize-none"
                          placeholder="Write or generate your cover letter..."
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm">
                          {generatedCoverLetter}
                        </div>
                      )
                    ) : (
                      <div className="space-y-4 text-sm">
                        <p>Dear {selectedOpportunity === "google-internship" ? "Google" : "Meta"} Hiring Team,</p>
                        
                        <p>
                          I am writing to express my strong interest in the {selectedOpportunity === "google-internship" ? "Data Science Internship" : "Software Engineering Internship"} position at {selectedOpportunity === "google-internship" ? "Google" : "Meta"}. 
                          {profileData?.university ? ` As a student at ${profileData.university}` : " As a dedicated student"}{profileData?.degree ? ` studying ${profileData.degree}` : ""}, I am excited about the opportunity to contribute to your innovative projects.
                        </p>
                        
                        <p>
                          {skills.length > 0 
                            ? `My background includes expertise in ${skills.slice(0, 4).join(", ")}${skills.length > 4 ? " and more" : ""}, developed through both coursework and hands-on projects.`
                            : "I have developed strong technical skills through my coursework and specialized projects."
                          }
                          {projects.length > 0 && projects[0].title
                            ? ` Most notably, I worked on ${projects[0].title}${projects[0].description ? `, where I ${projects[0].description.substring(0, 150)}...` : ""}`
                            : ""
                          }
                        </p>
                        
                        <p>
                          I am particularly drawn to {selectedOpportunity === "google-internship" ? "Google's" : "Meta's"} commitment to pushing the boundaries of technology. 
                          {profileData?.career_aspirations ? ` ${profileData.career_aspirations}` : " I am passionate about solving complex problems and contributing to high-impact teams."}
                        </p>
                        
                        <p>
                          Thank you for considering my application. I look forward to the possibility of discussing how my 
                          background and enthusiasm can contribute to your team.
                        </p>
                        
                        <div className="pt-8">
                          <p>Sincerely,</p>
                          <p className="font-bold">{fullName || "Your Name"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};

export default ContentCreator;
