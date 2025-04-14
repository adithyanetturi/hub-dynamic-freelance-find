
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const aiProjectImages = {
  "Web Development": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
  "Mobile Development": "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80", 
  "AI Development": "https://images.unsplash.com/photo-1677442135196-8003c00c5722?auto=format&fit=crop&w=800&q=80",
  "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "Machine Learning": "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80",
  "Blockchain Development": "https://images.unsplash.com/photo-1644143379190-08a5f055de1d?auto=format&fit=crop&w=800&q=80",
  "Graphic Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "Content Writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
  "Digital Marketing": "https://images.unsplash.com/photo-1533750516509-a7ce7d8bbb5a?auto=format&fit=crop&w=800&q=80",
  "SEO": "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?auto=format&fit=crop&w=800&q=80",
  "Video Editing": "https://images.unsplash.com/photo-1574717024453-e599f7994a00?auto=format&fit=crop&w=800&q=80",
  "default": "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80"
};

// Generate fake price history data
const generatePriceHistory = (basePrice: number) => {
  const now = new Date();
  const priceHistory = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Add some random variation to the price
    const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
    const price = Math.round(basePrice * (1 + variation));
    
    priceHistory.push({
      date: date.toISOString(),
      price
    });
  }
  
  return priceHistory;
};

// Mock bids for the project
const mockBids = [
  {
    id: "1",
    freelancer: {
      id: "f1",
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    price: 750,
    description: "I have extensive experience with similar projects and can deliver high-quality work within your timeframe.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    freelancer: {
      id: "f2",
      name: "Sarah Miller",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    price: 850,
    description: "My expertise in this area will ensure your project is completed to the highest standard. I've worked on 15+ similar projects.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;

      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) throw projectError;
        
        // Add appropriate image based on category
        const projectWithImage = {
          ...projectData,
          image: aiProjectImages[projectData.category as keyof typeof aiProjectImages] || aiProjectImages.default
        };

        setProject(projectWithImage);
        setPriceHistory(generatePriceHistory(projectWithImage.price));
        setBids(mockBids);

        // Fetch client profile
        if (projectData.client_id) {
          const { data: clientData, error: clientError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", projectData.client_id)
            .single();

          if (!clientError) {
            setClientProfile(clientData);
          }
        }

        // Fetch user's profile if logged in
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!userError) {
            setUserProfile(userData);
          }
        }

      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, user]);

  const handleSubmitProposal = async () => {
    if (!user) {
      toast.error("Please sign in to submit a proposal");
      navigate("/auth");
      return;
    }

    if (userProfile?.user_type !== "freelancer") {
      toast.error("Only freelancers can submit proposals");
      return;
    }

    setSubmitting(true);
    
    // In a real application, you would submit the proposal to the database
    setTimeout(() => {
      toast.success("Your proposal has been submitted");
      setSubmitting(false);
    }, 1000);
  };

  const handleAcceptProject = async () => {
    if (!user || !project || user.id !== userProfile?.id) {
      toast.error("You're not authorized to accept this project");
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from("projects")
        .update({ 
          freelancer_id: user.id,
          status: "assigned" 
        })
        .eq("id", project.id);

      if (error) throw error;

      setProject(prev => ({
        ...prev,
        freelancer_id: user.id,
        status: "assigned"
      }));

      toast.success("You have accepted this project");
    } catch (error: any) {
      console.error("Error accepting project:", error);
      toast.error("Failed to accept project");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium">Loading project details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Project not found</h1>
            <p className="text-gray-600">The project you're looking for doesn't exist.</p>
            <Button className="mt-4" asChild>
              <Link to="/browse">Back to Projects</Link>
            </Button>
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
          <div className="mb-6">
            <Link to="/browse" className="text-brand-600 hover:text-brand-700 flex items-center gap-1">
              ← Back to Projects
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{project.title}</h1>
                      <div className="text-gray-500 mt-1">
                        Posted {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <Badge className="text-lg bg-brand-500 hover:bg-brand-600">
                      ${project.price}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{project.category}</Badge>
                    <Badge variant="outline">{project.location}</Badge>
                    <Badge 
                      variant={
                        project.status === "open" ? "default" : 
                        project.status === "assigned" ? "secondary" : 
                        "outline"
                      }
                    >
                      {project.status === "open" ? "Open" : 
                       project.status === "assigned" ? "In Progress" : 
                       "Completed"}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Project Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                  </div>
                  
                  {userProfile?.user_type === "freelancer" && project.status === "open" && (
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleAcceptProject}
                      disabled={submitting}
                    >
                      {submitting ? "Processing..." : "Accept Project"}
                    </Button>
                  )}

                  {userProfile?.user_type === "client" && project.client_id === user?.id && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                      <p className="font-medium">This is your project</p>
                      <p className="text-sm">You'll be notified when freelancers submit proposals</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dynamic pricing chart */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">Dynamic Price History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString()} 
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8B5CF6" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Client info and bids sidebar */}
            <div className="lg:col-span-1">
              {/* Client info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">About the Client</h2>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {clientProfile?.name ? clientProfile.name.charAt(0).toUpperCase() : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{clientProfile?.name || "Client"}</h3>
                    <p className="text-sm text-gray-500">Project Owner</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {clientProfile?.bio || "Client is looking for skilled freelancers for this project."}
                </p>
              </div>
              
              {/* Proposals section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Proposals ({bids.length})</h2>
                
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map(bid => (
                      <div key={bid.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar>
                            <AvatarImage src={bid.freelancer.avatar} />
                            <AvatarFallback>{bid.freelancer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{bid.freelancer.name}</h3>
                            <div className="text-sm text-gray-500">
                              {formatDistanceToNow(bid.createdAt, { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Badge variant="outline" className="text-brand-600 border-brand-200 bg-brand-50">
                            ${bid.price}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{bid.description}</p>
                        
                        {userProfile?.user_type === "client" && project.client_id === user?.id && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">Accept</Button>
                            <Button size="sm" variant="outline">Message</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No proposals yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
