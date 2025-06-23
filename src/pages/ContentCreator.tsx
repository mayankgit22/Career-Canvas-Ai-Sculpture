import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Share2, Eye, Edit3, Palette, Target, CheckCircle, Globe } from "lucide-react";

const ContentCreator = () => {
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
  return <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 bg-gray-50 text-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 bg-blue-100 rounded-md p-4">
            <h1 className="font-bold mb-4 text-zinc-950 text-4xl">Content Creator</h1>
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold text-2xl">
              Generate tailored resumes, cover letters, and portfolios for your target opportunities
            </p>
          </div>

          <Tabs defaultValue="resume" className="space-y-8 ">
            <TabsList className="grid w-full grid-cols-3 bg-gray-400">
              <TabsTrigger value="resume" className="text-white   bg-gradient-to-r from-blue-500 to-purple-600  mr-2 ml-2">Resume/CV Builder</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-white bg-gradient-to-r from-blue-500 to-purple-600 mr-2 ml-2">Portfolio Creator</TabsTrigger>
              <TabsTrigger value="cover-letter" className="text-white bg-gradient-to-r from-blue-500 to-purple-600 mr-2 ml-2">Cover Letter</TabsTrigger>
            </TabsList>

            {/* Resume Builder */}
            <TabsContent value="resume" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <CardHeader>
                      <CardTitle className="text-white"> Target Opportunity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 bg-gradient-to-r from-blue-500 to-purple-600">
                        {opportunities.map(opp => <div key={opp.id} onClick={() => setSelectedOpportunity(opp.id)} className="">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-black">{opp.title}</p>
                                <p className="text-xs text-zinc-950">{opp.company}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {opp.match}%
                              </Badge>
                            </div>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <CardHeader>
                      <CardTitle className="text-white">Resume Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {resumeTemplates.map(template => <div key={template.id} className="p-3 rounded-lg border hover:bg-muted cursor-pointer">
                            <p className="font-medium text-sm text-black">{template.name}</p>
                            <p className="text-xs text-zinc-950">{template.description}</p>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <CardHeader>
                      <CardTitle className="text-white">ATS Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2 bg-slate-50 rounded-xl">94%</div>
                        <p className="text-sm text-zinc-950">ATS Compatibility</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-black ">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Keywords optimized
                          </div>
                          <div className="flex items-center gap-2 text-sm text-black ">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Format compatible
                          </div>
                          <div className="flex items-center gap-2 text-sm text-black ">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Skills aligned
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resume Preview */}
                <div className="lg:col-span-2 ">
                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Resume Preview</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-zinc-950 bg-indigo-600 hover:bg-indigo-500 border-2 border-black  ">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-zinc-950 bg-indigo-600 hover:bg-indigo-500 border-2 border-black py-0">
                            <Palette className="w-4 h-4 mr-2" />
                            Style
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <div className="bg-white border rounded-lg p-8 shadow-sm min-h-[600px]">
                        {/* Resume Content */}
                        <div className="space-y-6">
                          <div className="text-center border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                            <p className="text-gray-600">Computer Science Student</p>
                            <p className="text-sm text-gray-500">john.doe@email.com | (555) 123-4567 | LinkedIn</p>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">PROFESSIONAL SUMMARY</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Driven Computer Science sophomore with expertise in Python and data visualization, 
                              demonstrated through machine learning projects achieving 87% accuracy in customer 
                              trend prediction. Passionate about leveraging data science to solve real-world problems.
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">TECHNICAL SKILLS</h3>
                            <div className="text-sm text-gray-700">
                              <p><strong>Programming:</strong> Python, SQL, JavaScript, R</p>
                              <p><strong>Technologies:</strong> Pandas, NumPy, Scikit-learn, TensorFlow, Git</p>
                              <p><strong>Tools:</strong> Jupyter, Tableau, Power BI, Docker</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">EDUCATION</h3>
                            <div className="text-sm text-gray-700">
                              <p><strong>Stanford University</strong> | Bachelor of Science in Computer Science</p>
                              <p>Expected Graduation: May 2024 | GPA: 3.8/4.0</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">PROJECTS</h3>
                            <div className="text-sm text-gray-700 space-y-2">
                              <div>
                                <p><strong>Customer Analytics Platform</strong></p>
                                <p>Developed machine learning model using Python and scikit-learn to predict customer 
                                behavior, achieving 87% accuracy and reducing analysis time by 40%.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-4 mt-6">
                        <Button className="gradient-bg">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="bg-white text-black border-2 border-black ">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Resume
                        </Button>
                        <Button variant="outline" className="bg-white text-black border-2 border-black ">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Creator */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <CardHeader className="bg-transparent">
                    <CardTitle className="text-zinc-950">Portfolio Microsite</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-lime-300">
                      <h3 className="font-semibold mb-2">Your Portfolio URL</h3>
                      <div className="flex items-center gap-2">
                        <code className="text-sm px-2 py-1 rounded bg-slate-300">
                          https://careercanvas.dev/john-doe
                        </code>
                        <Button size="sm" variant="outline" className="text-zinc-950 bg-white">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-black">Projects Showcased</span>
                        <Badge className="bg-slate-400">3 Projects</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-black">Skills Highlighted</span>
                        <Badge className="bg-slate-400">8 Skills</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-black">Design Theme</span>
                        <Badge className="bg-slate-400">Tech Professional</Badge>
                      </div>
                    </div>

                    <Button className="w-full gradient-bg">
                      <Globe className="w-4 h-4 mr-2" />
                      Generate Portfolio Site
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <CardHeader>
                    <CardTitle className="text-zinc-950">Portfolio Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg h-64 flex items-center justify-center bg-gray-50">
                      <p className="text-lg text-zinc-950">Portfolio preview will appear here</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-zinc-50">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-zinc-50">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cover Letter */}
            <TabsContent value="cover-letter" className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
                <CardHeader>
                  <CardTitle>AI-Generated Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 min-h-[400px]">
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <p>Dear Google Hiring Team,</p>
                      </div>
                      <div className="space-y-4">
                        <p>
                          I am writing to express my strong interest in the Data Science Internship position at Google. 
                          As a Computer Science student at Stanford University with a passion for machine learning and 
                          data analysis, I am excited about the opportunity to contribute to Google's innovative projects.
                        </p>
                        <p>
                          My background aligns well with your requirements. I have developed expertise in Python, SQL, 
                          and machine learning through both coursework and hands-on projects. Most notably, I created 
                          a customer analytics platform that achieved 87% accuracy in predicting customer behavior, 
                          demonstrating my ability to extract actionable insights from complex datasets.
                        </p>
                        <p>
                          I am particularly drawn to Google's commitment to using data science for positive impact. 
                          Your recent work in AI for social good resonates with my career goals of leveraging technology 
                          to solve meaningful problems.
                        </p>
                        <p>
                          Thank you for considering my application. I would welcome the opportunity to discuss how my 
                          skills and enthusiasm can contribute to Google's data science team.
                        </p>
                      </div>
                      <div>
                        <p>Sincerely,<br />John Doe</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button className="gradient-bg">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="bg-white border-2 border-black text-black ">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="bg-white border-2 border-black text-black ">
                      <Target className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
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
