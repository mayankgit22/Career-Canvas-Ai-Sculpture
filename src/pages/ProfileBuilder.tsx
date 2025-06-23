import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Plus, X, User, GraduationCap, Briefcase, Code, Target, CheckCircle } from "lucide-react";
const ProfileBuilder = () => {
  const [skills, setSkills] = useState(["Python", "React", "SQL", "Machine Learning"]);
  const [newSkill, setNewSkill] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(75);
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setProfileCompletion(Math.min(profileCompletion + 5, 100));
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  const profileSections = [{
    name: "Basic Information",
    completed: true,
    icon: User
  }, {
    name: "Education",
    completed: true,
    icon: GraduationCap
  }, {
    name: "Skills",
    completed: true,
    icon: Code
  }, {
    name: "Projects",
    completed: false,
    icon: Briefcase
  }, {
    name: "Goals",
    completed: false,
    icon: Target
  }];
  return <div className="min-h-screen bg-background ">
      <Navigation />
      
      <div className="bg-gray-50 p-2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl  text-black font-bold mb-4">Build Your Profile</h1>
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-semibold">
              Tell us about yourself to get personalized opportunity matches
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-200 text-black  border-2 border-black">
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

              <Card className="border-2 border-black bg-gray-200">
                <CardHeader>
                  <CardTitle>Quick Import</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full text-zinc-950 border-2 border-black bg-zinc-100">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Button>
                  <Button variant="outline" className="w-full text-zinc-950 border-2 border-black bg-zinc-300 hover:bg-zinc-200">
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
              <Card className="bg-gray-200 text-black  border-2 border-black">
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
                      <Input id="firstName" placeholder="John" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@email.com" className="text-black border-1 border-black bg-gray-400" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself, your interests, and career goals..." rows={3} className="text-black border-1 border-black bg-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="bg-gray-200 text-black  border-2 border-black">
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
                      <Input id="university" placeholder="Stanford University" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input id="degree" placeholder="Bachelor of Science" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="major">Major</Label>
                      <Input id="major" placeholder="Computer Science" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                    <div>
                      <Label htmlFor="graduation">Graduation Year</Label>
                      <Input id="graduation" placeholder="2024" className="text-black border-1 border-black bg-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input id="gpa" placeholder="3.8" className="text-black border-1 border-black bg-gray-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-gray-200 border-black border-2">
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Code className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>)}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} className="bg-gray-400 text-black border-2 border-black" />
                    <Button onClick={addSkill}>
                      <Plus className="w-4 h-4 text-black" />
                    </Button>
                  </div>
                  <p className="text-sm text-black ">
                    Add skills like programming languages, tools, soft skills, etc.
                  </p>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="border-black border-2 rounded-4xl bg-white">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Briefcase className="w-5 h-5" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 bg-gray-50">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input id="projectTitle" placeholder="E-commerce Web Application" className="border-black text-black border-2 bg-gray-400" />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description</Label>
                    <Textarea id="projectDescription" placeholder="Describe your project, technologies used, and your role..." rows={3} className="border-black text-black border-2 bg-gray-400" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectLink">Project Link (Optional)</Label>
                      <Input id="projectLink" placeholder="https://github.com/..." className="bg-gray-400 text-black border-2 border-black" />
                    </div>
                    <div>
                      <Label htmlFor="technologies">Technologies Used</Label>
                      <Input id="technologies" placeholder="React, Node.js, MongoDB" className="bg-gray-400 text-black border-2 border-black" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-zinc-50 bg-blue-700 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Project
                  </Button>
                </CardContent>
              </Card>

              {/* Career Goals */}
              <Card className="bg-gray-200 border-2 border-black ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="careerGoals">What are your career aspirations?</Label>
                    <Textarea id="careerGoals" placeholder="I want to work as a software engineer at a tech company, focusing on AI and machine learning..." rows={3} className="bg-gray-400 text-black border-2 border-black" />
                  </div>
                  <div>
                    <Label htmlFor="interests">Industry Interests</Label>
                    <Input id="interests" placeholder="Technology, Healthcare, Finance, etc." className="bg-gray-400 text-black border-2 border-black" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center  pb-5">
                <Button size="lg" className="gradient-bg px-8">
                  Save Profile & Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileBuilder;