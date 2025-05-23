
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Chatbot from "@/components/Chatbot";

import Index from "./pages/Index";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import UserProfile from "./pages/UserProfile";
import FreelancerSignup from "./pages/FreelancerSignup";
import PostProject from "./pages/PostProject";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<BrowseProjects />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/freelancer/:id" element={<UserProfile />} />
              <Route path="/freelancer" element={<FreelancerSignup />} />
              <Route path="/post" element={<PostProject />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
