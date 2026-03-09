import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import PortfolioRenderer from "@/components/PortfolioRenderer";
import { Loader2, AlertCircle, ArrowLeft, Globe, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PortfolioShowcase = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!userId) {
        setError("Invalid Portfolio Link");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError || !data) {
          setError("Portfolio not found. It might be private or deleted.");
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("An unexpected error occurred while loading this portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading amazing portfolio...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h1>
        <p className="text-slate-500 max-w-md mb-8">{error}</p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const hasPortfolioContent = profile.ai_portfolio && profile.ai_portfolio.trim().length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">Showcase.ai</span>
            </div>
            
            <div className="flex items-center gap-4">
               <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 py-1 px-3 border-slate-200 text-slate-500 font-medium">
                <Award className="w-3.5 h-3.5 text-blue-500" /> Verified Talent
              </Badge>
              <Button size="sm" variant="outline" className="gap-2 rounded-full text-xs font-bold uppercase tracking-wider" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Portfolio link copied to clipboard!");
              }}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!hasPortfolioContent ? (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 bg-blue-50 rounded-2xl mb-6">
                <Globe className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Portfolio in Development</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {profile.first_name} is currently crafting their professional showcase. Check back soon for the full experience.
            </p>
          </div>
        ) : (
          <PortfolioRenderer content={profile.ai_portfolio} />
        )}
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm text-slate-600">{profile.location || 'Global'}</p>
              </div>
           </div>
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} {profile.first_name} {profile.last_name}. Portfolio crafted with Career Canvas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioShowcase;
