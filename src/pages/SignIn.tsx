import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword }from "firebase/auth"
interface SignInProps {
  email: string;
  password: string;
}

function SignIn() {
  const navigate=useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const auth = getAuth();

  
  const handleSignIn = async() => {
    
    try{
      
       const response=signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
         const user = userCredential.user;
         console.log(user);
        //  setIsLoggedin(true);
       })
       .catch((error) => {
             alert("Sign in failed. Please check your credentials.");
console.log(error

)
       });
    if(response){
      alert("Sign in successful!");
      navigate('/')
    }

    }
    catch(error){
      console.log(error)
    } 
  };
  // const signInHandler = async ({ email, password }: SignInProps) => {
  //   const auth = getAuth();
  //   try {
  //     const response = await signInWithEmailAndPassword(auth, email, password);
  //     const user = response.user;
  //     console.log(user);
  //     setIsLoggedin(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  // });

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="flex flex-col gap-6 w-full max-w-md bg-white/20 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl text-white font-bold text-center">Sign In</h1>

        <div className="w-full">
          <label htmlFor="email" className="text-white mb-1 block">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-gray-600 border-2 border-black text-white font-normal"
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-white mb-1 block">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-gray-600 border-2 border-black text-white font-normal"
          />
        </div>

        <Button
          onClick={handleSignIn}
          type="submit"
          variant="destructive"
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          Sign In
        </Button>

        <div className="text-center text-white">
          <p className="inline">Don't have an account? </p>
          <Link to="/signup" className="text-black font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
