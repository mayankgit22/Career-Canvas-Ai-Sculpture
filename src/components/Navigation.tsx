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
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged,signOut } from "firebase/auth";
import { get } from "http";
// import SignIn from "@/pages/SignIn";
export const Navigation = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD9g8XByguwKX_2rChfKTbTc7EG5hoyo4k",
    authDomain: "firstproject-10795.firebaseapp.com",
    databaseURL: "https://firstproject-10795-default-rtdb.firebaseio.com",
    projectId: "firstproject-10795",
    storageBucket: "firstproject-10795.firebasestorage.app",
    messagingSenderId: "117017175443",
    appId: "1:117017175443:web:0a7f334c08a02659f0f466",
  };
  const signInHandler = () => {
    console.log("clicked");
    navigate("/login");
    setIsLogin(true);
  };
  const auth = getAuth();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser.email);
    });

    return () => unsubscribe(); // Cleanup
  }, []);
  const logOut= async()=>{
      await signOut(auth);
    setIsLogin(false);
   
alert("log out successful")
      navigate("/signin")
    

  }
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
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
    <header className="border-b border-border/40 backdrop-blur-lg  sticky top-0 z-50 w-full py-4  bg-lightish/70">
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
                className="flex items-center text-black py-0 hover:text-gray-600 gap-1 flex mx-[10px] px-[10px] "
              >
                <Icon className="w-4 h-4 px-0 rounded-none mx-0" />
                <span className="text-zinc-950 font-semibold text-base hover:text-gray-500 px-0">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
 <div className="hidden md:flex items-center space-x-4">
<Link to={'/getstarted'}>
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
          {user ? (
            <>
              <div className="gap-1 flex items-center">
                <Button size="sm" className=" border-2 border-black text-white bg-black hover:bg-gray-800">
                  {user}
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
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border">
          <nav className="flex flex-col space-y-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="gradient-bg">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
