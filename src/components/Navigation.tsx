import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Menu,
  X,
  Home,
  BarChart3,
  User,
  FileText,
  Award,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "../utils/supabase";
import { get } from "http";
// import SignIn from "@/pages/SignIn";
export const Navigation = () => {
  const signInHandler = () => {
    navigate("/login");
  };
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLogin(true);
        setUserDisplayName(session.user.user_metadata?.full_name || session.user.email);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLogin(true);
        setUserDisplayName(session.user.user_metadata?.full_name || session.user.email);
      } else {
        setIsLogin(false);
        setUserDisplayName(null);
      }
    });

    return () => subscription.unsubscribe(); // Cleanup
  }, []);

  const logOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLogin(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
    },
    {
      path: "/creator",
      label: "Creator",
      icon: FileText,
    },
    {
      path: "/badges",
      label: "Badges",
      icon: Award,
    },
  ];
  return (
    <header className="border-b border-border/40 backdrop-blur-lg sticky top-0 z-50 w-full py-4 bg-background/70">
      <div className="flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CareerCanvas</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center text-foreground py-0 hover:text-muted-foreground gap-1 flex mx-[10px] px-[10px] "
              >
                <Icon className="w-4 h-4 px-0 rounded-none mx-0" />
                <span className="text-foreground font-semibold text-base hover:text-muted-foreground px-0">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
 <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>
<Link to={'/profile'}>
          <Button size="sm" className="gradient-bg">
            Get Started
          </Button>
</Link>
       
          {/* <SignedOut>
          <div className=" text-black rounded-full p-2 hover:bg-gray-200">
          <SignUpButton mode="modal"  />

          </div>
          <div className="bg-gray-800 rounded-full text-white p-2 hover:bg-gray-900">
        <SignInButton mode="modal" />
          </div> 
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn> */}
          {isLogin ? (
            <>
              <div className="gap-1 flex items-center">
                <Button size="sm" className=" border-2 border-black text-white bg-black hover:bg-gray-800">
                  {userDisplayName || "User"}
                </Button>
                <Button className=" border-black text-white bg-black  hover:bg-gray-700 "  onClick={logOut}>Log out</Button>
              </div>
            </>
          ) : (
            <Button
              onClick={signInHandler}
              variant="default"
              size="sm"
              className="border-2 border-black text-white bg-black hover:bg-gray-800 "
            >
              Sign In
            </Button>
          )}
          {/* <Button onClick={signInHandler} variant="outline" size="sm" className="border-2 border-black bg-gray-50">Sign In</Button> */}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-b-2 border-black/10">
          <nav className="flex flex-col space-y-2 mt-4 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/80 text-green-700"
                      : "text-foreground hover:text-muted-foreground "
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                {mounted && theme === 'dark' ? (
                  <><Sun className="w-4 h-4 text-yellow-400" /><span>Light Mode</span></>
                ) : (
                  <><Moon className="w-4 h-4" /><span>Dark Mode</span></>
                )}
              </button>
              <Button onClick={signInHandler} variant="outline" size="sm" className="text-black">
                Sign In
              </Button>
              <Link to="/profile">
                <Button size="sm" className="gradient-bg w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
