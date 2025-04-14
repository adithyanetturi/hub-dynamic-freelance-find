
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectCard from "@/components/ProjectCard";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profileData.user_type !== "freelancer") {
          toast({
            title: "Access denied",
            description: "This page is only for freelancers",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setProfile(profileData);
        
        // Get available projects (status = open)
        const { data: availableData, error: availableError } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "open")
          .is("freelancer_id", null);
        
        if (availableError) throw availableError;
        setAvailableProjects(availableData);

        // Get my projects (assigned to me)
        const { data: myData, error: myError } = await supabase
          .from("projects")
          .select("*")
          .eq("freelancer_id", user.id);
        
        if (myError) throw myError;
        setMyProjects(myData);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading dashboard",
          description: error.message || "Failed to load your data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [user, navigate, toast]);

  const handleAcceptProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ 
          freelancer_id: user?.id,
          status: "assigned" 
        })
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Project accepted",
        description: "You have successfully accepted this project",
      });

      // Update local state
      setAvailableProjects(prev => prev.filter(p => p.id !== projectId));
      const acceptedProject = availableProjects.find(p => p.id === projectId);
      if (acceptedProject) {
        acceptedProject.freelancer_id = user?.id;
        acceptedProject.status = "assigned";
        setMyProjects(prev => [...prev, acceptedProject]);
      }
      
    } catch (error: any) {
      console.error("Error accepting project:", error);
      toast({
        title: "Failed to accept project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleCompleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "completed" })
        .eq("id", projectId)
        .eq("freelancer_id", user?.id);

      if (error) throw error;

      toast({
        title: "Project marked as complete",
        description: "The client will be notified",
      });

      // Update local state
      setMyProjects(prev => 
        prev.map(p => p.id === projectId ? { ...p, status: "completed" } : p)
      );
      
    } catch (error: any) {
      console.error("Error completing project:", error);
      toast({
        title: "Failed to complete project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium">Loading your dashboard...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile?.name || "Freelancer"}!</p>
          </div>

          {/* Progress stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-600">{availableProjects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {myProjects.filter(p => p.status === "assigned").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {myProjects.filter(p => p.status === "completed").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <Tabs defaultValue="available">
            <TabsList className="mb-6">
              <TabsTrigger value="available">Available Projects</TabsTrigger>
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProjects.length > 0 ? (
                  availableProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden h-full flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={project.image || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80"} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.category} • {project.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
                        <div className="mt-4">
                          <p className="font-medium text-brand-600">${project.price}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => handleAcceptProject(project.id)} 
                          className="w-full"
                        >
                          Accept Project
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No available projects found</h3>
                    <p className="text-gray-600">Check back later for new opportunities</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="my-projects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.length > 0 ? (
                  myProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden h-full flex flex-col">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={project.image || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80"} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>{project.category} • {project.location}</CardDescription>
                          </div>
                          {project.status === "completed" ? (
                            <CheckCircle2 className="text-green-500 h-5 w-5" />
                          ) : (
                            <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                              In Progress
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
                        <div className="mt-4">
                          <p className="font-medium text-brand-600">${project.price}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {project.status === "assigned" && (
                          <Button 
                            onClick={() => handleCompleteProject(project.id)} 
                            className="w-full"
                          >
                            Mark as Complete
                          </Button>
                        )}
                        {project.status === "completed" && (
                          <Button variant="outline" className="w-full" disabled>
                            Completed
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">You haven't accepted any projects yet</h3>
                    <p className="text-gray-600">Browse available projects and start working</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
