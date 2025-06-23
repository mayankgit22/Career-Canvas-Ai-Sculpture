
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfileBuilder from "./pages/ProfileBuilder";
import ContentCreator from "./pages/ContentCreator";
import BadgesSharing from "./pages/BadgesSharing";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import GetStartedPage from "./components/getStartedPage";
// import {ClerkProvider}from '@clerk/clerk-react'

const queryClient = new QueryClient();
const publishableKey= import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <ClerkProvider publishableKey={publishableKey}> */}
      
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileBuilder />} />
          <Route path="/creator" element={<ContentCreator />} />
          <Route path="/badges" element={<BadgesSharing />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/getstarted" element={<GetStartedPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    {/* </ClerkProvider> */}
  </QueryClientProvider>
);

export default App;
