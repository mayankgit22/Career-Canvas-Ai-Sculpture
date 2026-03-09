import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfileBuilder from "./pages/ProfileBuilder";
import ContentCreator from "./pages/ContentCreator";
import BadgesSharing from "./pages/BadgesSharing";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PortfolioShowcase from "./pages/PortfolioShowcase";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/career-canvas-ai-sculptor-97">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileBuilder />} />
          <Route path="/creator" element={<ContentCreator />} />
          <Route path="/badges" element={<BadgesSharing />} />
          <Route path="/portfolio/:userId" element={<PortfolioShowcase />} />
          <Route path="/demo" element={<Demo />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
