
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, locations } from "@/data/dummyData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PostProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    price: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data.user_type !== "client") {
          toast.error("Only clients can post projects");
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        toast.error("Failed to verify account type");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) throw new Error("You must be signed in to post a project");

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        price: parseFloat(formData.price),
        client_id: user.id,
        status: "open",
      };

      const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Project posted successfully!");
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error posting project:", error);
      toast.error(error.message || "Failed to post project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium">Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Post a New Project</h1>
            
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Tell us about your project to find the perfect freelancer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Title */}
                  <div>
                    <Label htmlFor="title" className="mb-2 block">Project Title</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a clear title for your project" 
                      required 
                    />
                  </div>
                  
                  {/* Project Description */}
                  <div>
                    <Label htmlFor="description" className="mb-2 block">Project Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project requirements in detail" 
                      className="min-h-32"
                      required
                    />
                  </div>
                  
                  {/* Category and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="mb-2 block">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="mb-2 block">Location Preference</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => handleSelectChange("location", value)}
                        required
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.slice(1).map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget" className="mb-2 block">Budget (USD)</Label>
                    <Input 
                      id="budget" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number" 
                      placeholder="Enter your budget"
                      min={5}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Our dynamic pricing system will help you find the best rate
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Project"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostProject;
