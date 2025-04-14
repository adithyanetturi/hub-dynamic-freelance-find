
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Loader2, PlusCircle, MessageCircle, CheckCircle2 } from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
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
        
        if (profileData.user_type !== "client") {
          toast({
            title: "Access denied",
            description: "This page is only for clients",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setProfile(profileData);
        
        // Get client's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("client_id", user.id);
        
        if (projectsError) throw projectsError;
        setProjects(projectsData);

        // Get top freelancers
        const { data: freelancersData, error: freelancersError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_type", "freelancer")
          .limit(5);
        
        if (freelancersError) throw freelancersError;
        setFreelancers(freelancersData);

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Client Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {profile?.name || "Client"}!</p>
            </div>
            <Button asChild>
              <Link to="/post">
                <PlusCircle className="mr-2 h-4 w-4" /> Post New Project
              </Link>
            </Button>
          </div>

          {/* Progress stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-600">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {projects.filter(p => p.status === "assigned").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {projects.filter(p => p.status === "completed").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <Tabs defaultValue="projects">
            <TabsList className="mb-6">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="freelancers">Top Freelancers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
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
                          {project.status === "open" && (
                            <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              Open
                            </div>
                          )}
                          {project.status === "assigned" && (
                            <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                              In Progress
                            </div>
                          )}
                          {project.status === "completed" && (
                            <CheckCircle2 className="text-green-500 h-5 w-5" />
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
                        <Button 
                          variant={project.status === "open" ? "default" : "outline"}
                          className="w-full"
                          asChild
                        >
                          <Link to={`/project/${project.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">You haven't posted any projects yet</h3>
                    <p className="text-gray-600 mb-6">Create your first project to get started</p>
                    <Button asChild>
                      <Link to="/post">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="freelancers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="overflow-hidden h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={freelancer.avatar} />
                          <AvatarFallback>
                            {freelancer.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                          <CardDescription>
                            {freelancer.skills?.slice(0, 2).join(", ") || "Freelancer"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {freelancer.bio || "Experienced freelancer ready to help with your projects."}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/freelancer/${freelancer.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="secondary">
                        <MessageCircle className="mr-2 h-4 w-4" /> Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
