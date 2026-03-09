import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Plus, X, User, GraduationCap, Briefcase, Code, Target, CheckCircle, Loader2, Trash2, Edit3 } from "lucide-react";
import { supabase } from "../utils/supabase";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState(["Python", "React", "SQL", "Machine Learning"]);
  const [newSkill, setNewSkill] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  
  const [basicInfo, setBasicInfo] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [education, setEducation] = useState({ university: "", degree: "", major: "", graduation: "", gpa: "" });
  const [projects, setProjects] = useState([{ title: "", description: "", link: "", technologies: "" }]);
  const [careerGoals, setCareerGoals] = useState({ aspirations: "", interests: "" });
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Fetch profile from Supabase (PostgreSQL)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (data && !error) {
            // If profile data exists, start in view mode
            const hasData = !!(data.first_name || data.last_name || data.university);
            setIsEditing(!hasData);
            setBasicInfo({ 
              firstName: data.first_name || "", 
              lastName: data.last_name || "", 
              email: data.email || currentUser.email || "", 
              bio: data.bio || "" 
            });
            setEducation({ 
              university: data.university || "", 
              degree: data.degree || "", 
              major: data.major || "", 
              graduation: data.graduation || "", 
              gpa: data.gpa || "" 
            });
            setSkills(data.skills || ["Python", "React", "SQL", "Machine Learning"]);
            if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
              setProjects(data.projects);
            } else if (data.project_title) {
              // Migrate legacy single-project data
              setProjects([{ title: data.project_title || "", description: data.project_description || "", link: data.project_link || "", technologies: data.project_technologies || "" }]);
            }
            setCareerGoals({ 
              aspirations: data.career_aspirations || "", 
              interests: data.career_interests || "" 
            });
            setResumeUrl(data.resume_url || null);
          } else {
            // Default if no record found
            setBasicInfo({ firstName: "", lastName: "", email: currentUser.email || "", bio: "" });
          }
        } catch (error) {
          console.error("Error fetching profile from Supabase", error);
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveProfile = async () => {
    if (!user) {
      alert("Please sign in to save your profile.");
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      // Save data to Supabase (PostgreSQL)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: basicInfo.firstName,
          last_name: basicInfo.lastName,
          email: basicInfo.email,
          bio: basicInfo.bio,
          university: education.university,
          degree: education.degree,
          major: education.major,
          graduation: education.graduation,
          gpa: education.gpa,
          skills: skills,
          projects: projects.filter(p => p.title.trim() || p.description.trim()),
          career_aspirations: careerGoals.aspirations,
          career_interests: careerGoals.interests,
          resume_url: resumeUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setIsEditing(false);
      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving profile", error);
      toast({
        title: "Save Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingResume(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('users resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('users resumes')
        .getPublicUrl(filePath);

      setResumeUrl(publicUrl);
      
      // Auto-save the resume URL to Supabase
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          resume_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;
      
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been uploaded and saved successfully.",
      });
    } catch (error) {
      console.error("Error uploading resume", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please ensure the 'users resumes' bucket exists and has the correct policies in your Supabase project.",
        variant: "destructive",
      });
    }
    setUploadingResume(false);
  };
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", link: "", technologies: "" }]);
  };

  const removeProject = (index: number) => {
    if (projects.length <= 1) return;
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };
  const profileSections = useMemo(() => {
    const sections = [
      {
        name: "Basic Information",
        completed: !!(basicInfo.firstName && basicInfo.lastName),
        icon: User
      },
      {
        name: "Education",
        completed: !!(education.university && education.degree),
        icon: GraduationCap
      },
      {
        name: "Skills",
        completed: skills.length > 0,
        icon: Code
      },
      {
        name: "Projects",
        completed: projects.some(p => !!(p.title && p.description)),
        icon: Briefcase
      },
      {
        name: "Goals",
        completed: !!(careerGoals.aspirations || careerGoals.interests),
        icon: Target
      },
      {
        name: "Resume",
        completed: !!resumeUrl,
        icon: Upload
      }
    ];
    return sections;
  }, [basicInfo, education, skills, projects, careerGoals, resumeUrl]);

  const profileCompletion = useMemo(() => {
    const completedCount = profileSections.filter(s => s.completed).length;
    return Math.round((completedCount / profileSections.length) * 100);
  }, [profileSections]);
  return <div className="min-h-screen bg-background ">
      <Navigation />
      
      <div className="bg-background p-2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-foreground font-bold mb-4">{isEditing ? "Build Your Profile" : "Your Profile"}</h1>
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-semibold">
              {isEditing ? "Tell us about yourself to get personalized opportunity matches" : "View and manage your profile information"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card text-card-foreground border-2 border-border">
                <CardHeader>
                  <CardTitle>Profile Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completion</span>
                        <span>{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-3" />
                    </div>
                    <div className="space-y-3">
                      {profileSections.map((section, index) => {
                      const Icon = section.icon;
                      return <div key={index} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${section.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                              {section.completed ? <CheckCircle className="w-4 h-4 bg-transparent" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className="">
                              {section.name}
                            </span>
                          </div>;
                    })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card">
                <CardHeader>
                  <CardTitle>Quick Import</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   <div className="relative">
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full text-foreground border-2 border-border bg-muted"
                      disabled={uploadingResume}
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      {uploadingResume ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {resumeUrl ? "Change Resume" : "Upload Resume"}
                    </Button>
                    {resumeUrl && (
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current Resume</a>
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full text-foreground border-2 border-border bg-muted hover:bg-accent">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Import from LinkedIn
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-card text-card-foreground border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={basicInfo.firstName} onChange={(e) => setBasicInfo({...basicInfo, firstName: e.target.value})} placeholder="John" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={basicInfo.lastName} onChange={(e) => setBasicInfo({...basicInfo, lastName: e.target.value})} placeholder="Doe" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={basicInfo.email} onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})} placeholder="john.doe@email.com" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={basicInfo.bio} onChange={(e) => setBasicInfo({...basicInfo, bio: e.target.value})} placeholder="Tell us about yourself, your interests, and career goals..." rows={3} disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="bg-card text-card-foreground border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input id="university" value={education.university} onChange={(e) => setEducation({...education, university: e.target.value})} placeholder="Stanford University" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input id="degree" value={education.degree} onChange={(e) => setEducation({...education, degree: e.target.value})} placeholder="Bachelor of Science" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input id="major" value={education.major} onChange={(e) => setEducation({...education, major: e.target.value})} placeholder="Computer Science" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                    <div>
                      <Label htmlFor="graduation">Graduation Year</Label>
                      <Input id="graduation" value={education.graduation} onChange={(e) => setEducation({...education, graduation: e.target.value})} placeholder="2024" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input id="gpa" value={education.gpa} onChange={(e) => setEducation({...education, gpa: e.target.value})} placeholder="3.8" disabled={!isEditing} className="text-foreground border border-border bg-muted disabled:opacity-70" />
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-card border-border border-2">
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Code className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                        {isEditing && <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>}
                      </Badge>)}
                  </div>
                  {isEditing && <>
                  <div className="flex gap-2">
                    <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} className="bg-muted text-foreground border-2 border-border" />
                    <Button onClick={addSkill}>
                      <Plus className="w-4 h-4 text-foreground" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add skills like programming languages, tools, soft skills, etc.
                  </p>
                  </>}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="border-border border-2 rounded-4xl bg-card">
                <CardHeader className="bg-card">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Briefcase className="w-5 h-5" />
                    Projects ({projects.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 bg-card">
                  {projects.map((project, index) => (
                    <div key={index} className="space-y-4">
                      {index > 0 && <hr className="border-border" />}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Project {index + 1}</span>
                        {isEditing && projects.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`projectTitle-${index}`}>Project Title</Label>
                        <Input id={`projectTitle-${index}`} value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} placeholder="E-commerce Web Application" disabled={!isEditing} className="border-border text-foreground border-2 bg-muted disabled:opacity-70" />
                      </div>
                      <div>
                        <Label htmlFor={`projectDescription-${index}`}>Description</Label>
                        <Textarea id={`projectDescription-${index}`} value={project.description} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder="Describe your project, technologies used, and your role..." rows={3} disabled={!isEditing} className="border-border text-foreground border-2 bg-muted disabled:opacity-70" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`projectLink-${index}`}>Project Link (Optional)</Label>
                          <Input id={`projectLink-${index}`} value={project.link} onChange={(e) => updateProject(index, 'link', e.target.value)} placeholder="https://github.com/..." disabled={!isEditing} className="bg-muted text-foreground border-2 border-border disabled:opacity-70" />
                        </div>
                        <div>
                          <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
                          <Input id={`technologies-${index}`} value={project.technologies} onChange={(e) => updateProject(index, 'technologies', e.target.value)} placeholder="React, Node.js, MongoDB" disabled={!isEditing} className="bg-muted text-foreground border-2 border-border disabled:opacity-70" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditing && <Button variant="outline" className="w-full text-zinc-50 bg-blue-700 hover:bg-blue-600" onClick={addProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Project
                  </Button>}
                </CardContent>
              </Card>

              {/* Career Goals */}
              <Card className="bg-card border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="careerGoals">What are your career aspirations?</Label>
                    <Textarea id="careerGoals" value={careerGoals.aspirations} onChange={(e) => setCareerGoals({...careerGoals, aspirations: e.target.value})} placeholder="I want to work as a software engineer at a tech company, focusing on AI and machine learning..." rows={3} disabled={!isEditing} className="bg-muted text-foreground border-2 border-border disabled:opacity-70" />
                  </div>
                  <div>
                    <Label htmlFor="interests">Industry Interests</Label>
                    <Input id="interests" value={careerGoals.interests} onChange={(e) => setCareerGoals({...careerGoals, interests: e.target.value})} placeholder="Technology, Healthcare, Finance, etc." disabled={!isEditing} className="bg-muted text-foreground border-2 border-border disabled:opacity-70" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 pb-5">
                {isEditing ? (
                  <Button size="lg" className="gradient-bg px-8" onClick={saveProfile} disabled={saving || loading}>
                    {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {saving ? "Saving..." : "Save Profile & Continue"}
                  </Button>
                ) : (
                  <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileBuilder;