import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import { Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  const handleSignIn = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("Attempting Supabase SignIn for:", cleanEmail);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) throw error;
      
      console.log("SignIn SUCCESS.", data.user?.id);
      toast({
        title: "Welcome Back!",
        description: "Sign in successful.",
      });
      navigate('/');
    } catch (error: any) {
      console.error("SignIn Error:", error);
      
      const errorMsg = error.message || String(error);
      if (errorMsg.includes('Invalid login credentials')) {
        toast({
          title: "Invalid Credentials",
          description: "Account not found or incorrect password. If you don't have an account, please Sign Up.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign In Failed",
          description: errorMsg || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      console.log("SignIn Flow Finished.");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4">
      <div className="flex flex-col gap-6 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">Welcome Back</h1>
          <p className="text-blue-100 mt-2 text-sm">Sign in to your CareerCanvas account</p>
        </div>

        <div className="space-y-4 w-full mt-2">
          <div className="space-y-1.5 w-full">
            <label htmlFor="email" className="text-white/90 text-sm font-medium block">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <label htmlFor="password" className="text-white/90 text-sm font-medium block">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
            />
          </div>
        </div>

        <Button
          onClick={handleSignIn}
          type="button"
          disabled={loading}
          className="w-full bg-white text-indigo-600 hover:bg-gray-100 hover:text-indigo-700 font-semibold shadow-lg h-11 mt-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center mt-2">
          <p className="text-blue-100 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white font-bold hover:text-yellow-300 hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
