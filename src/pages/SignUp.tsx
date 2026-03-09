import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async () => {
    const cleanEmail = email.trim();
    if (!name.trim() || !cleanEmail || !password.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    console.log("Starting Supabase Auth Creation for: ", cleanEmail);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;
      const user = data.user;
      console.log("Supabase Auth Creation SUCCESS. User ID:", user?.id);
      
      if (user) {
        // Save user to PostgreSQL profiles table via Supabase
        try {
          console.log("Attempting to save to Supabase profiles table...");
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: cleanEmail,
              first_name: name.split(' ')[0] || name,
              last_name: name.split(' ').slice(1).join(' ') || "",
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;
          console.log("Supabase Profile Save SUCCESS.");
        } catch (dbError) {
          console.error("Warning: Could not save profile to PostgreSQL, but Auth succeeded.", dbError);
        }
      }
      
      // Navigate to profile after successful signup
      toast({
        title: "Account Created!",
        description: "Now you can proceed to fill your profile.",
      });
      navigate('/profile');
    } catch (error: any) {
      console.error("SignUp Error Object:", error);
      const errorMsg = error.message || String(error);
      
      if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
        toast({
          title: "Email already registered",
          description: "This email is already in use. Please go to the Sign In page.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message || "Unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      console.log("Sign Up Flow Finished.");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4">
      <div className="flex flex-col gap-6 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">Create Account</h1>
          <p className="text-blue-100 mt-2 text-sm">Join CareerCanvas and shape your future</p>
        </div>

        <div className="space-y-4 w-full mt-2">
          <div className="space-y-1.5 w-full">
            <label htmlFor="name" className="text-white/90 text-sm font-medium block">Full Name</label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="John Doe"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <label htmlFor="email" className="text-white/90 text-sm font-medium block">Email</label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <label htmlFor="password" className="text-white/90 text-sm font-medium block">Password</label>
            <Input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
            />
          </div>
        </div>

        <Button
          onClick={handleSignUp}
          type="button"
          disabled={loading}
          className="w-full bg-white text-indigo-600 hover:bg-gray-100 hover:text-indigo-700 font-semibold shadow-lg h-11 mt-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <div className="text-center mt-2">
          <p className="text-blue-100 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:text-yellow-300 hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
