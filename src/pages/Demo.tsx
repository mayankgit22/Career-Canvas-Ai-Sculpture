import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle, FileText, Target, Briefcase } from "lucide-react";

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Platform Walkthrough
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            How to use <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">Career Canvas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            A quick visual guide on how to build your profile, generate AI materials, and start applying for your dream jobs.
          </p>

          <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-muted bg-black flex justify-center items-center">
            <video 
              controls 
              muted 
              loop
              className="w-full h-full object-cover"
              poster="/vdo/poster.jpg"
            >
              <source src="/career-canvas-ai-sculptor-97/vdo/screen-recording-2026-03-10-002931_oiF6N1jd.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Step-by-Step Guide</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">1</div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Build Your Profile
                </CardTitle>
                <CardDescription>Give the AI context.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Navigate to the Profile page.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Enter your basic info, education, and skills.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Add details about your previous projects.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> The more details you provide, the better the AI will perform!</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-4">2</div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Generate Materials
                </CardTitle>
                <CardDescription>Let AI do the heavy lifting.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Go to the Content Creator page.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Click "Generate Personal Resume" to instantly craft your resume.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Edit the result if needed, or re-run it.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Hop over to the Portfolio or Cover Letter tabs for those assets.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-border shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl mb-4">3</div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-500" />
                  Find & Apply for Jobs
                </CardTitle>
                <CardDescription>Turn prep into action.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Head to your Dashboard feed.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> View live jobs directly matching the skills from your profile.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Click "Save Job" to add it to your wishlist.</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Click "Apply Now" and watch your stats go up!</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
