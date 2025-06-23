import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'; // fixed import
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // your Firestore setup



interface SignInProps {
  email: string;
  password: string;
}



function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  



  const signUnHandler =  async({ email, password }: SignInProps) => {
    const auth =  getAuth();
    try{
       const response=await createUserWithEmailAndPassword(auth, email, password)
  .then(async(userCredential) => {
    const user = userCredential.user;
    console.log(user)
    const docRef = await setDoc(doc(db, "users", user.uid), {
  email,
  name,
  role: "student",
  joinedAt: new Date().toISOString(),
});
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
      
    }
    catch(error){
      console.log(error,"err at creating user at signup")
    }
    if(Response){
      alert("Sign up successful! Please log in.");
      // setIsLoggedin(true);
      navigate('/')

      
    }


  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="flex flex-col gap-4 w-full max-w-md justify-center items-center bg-white/20 p-6 rounded-lg shadow-md">
        <div className="w-full flex flex-col items-start">
          <h1 className="text-2xl sm:text-3xl text-white font-bold text-center w-full mb-2">Sign Up</h1>
          <label htmlFor="name" className="text-white mb-1">Name</label>
          <Input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your Name"
            className="w-full bg-gray-600 border-2 text-white font-normal border-black"
          />
        </div>

        <div className="w-full flex flex-col items-start">
          <label htmlFor="email" className="text-white mb-1">Email</label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter your email"
            className="w-full bg-gray-600 border-2 text-white font-normal border-black"
          />
        </div>

        <div className="w-full flex flex-col items-start">
          <label htmlFor="password" className="text-white mb-1">Password</label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="w-full border-2 border-black text-white font-normal bg-gray-600"
          />
        </div>

        <Button
          onClick={() => signUnHandler({ email, password })}
          type="submit"
          variant="destructive"
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {/* {isLoggedin?user:"Sign Up"} */}
        </Button>

        <div className="w-full text-center text-white">
          <p className="inline">Already have an account? </p>
          <Link to="/login" className="text-black font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
