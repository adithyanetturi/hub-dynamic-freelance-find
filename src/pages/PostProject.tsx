
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
import { useState } from "react";
import { toast } from "sonner";

const PostProject = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Project posted successfully!");
    }, 1500);
  };
  
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
                    <Input id="title" placeholder="Enter a clear title for your project" required />
                  </div>
                  
                  {/* Project Description */}
                  <div>
                    <Label htmlFor="description" className="mb-2 block">Project Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your project requirements in detail" 
                      className="min-h-32"
                      required
                    />
                  </div>
                  
                  {/* Category and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="mb-2 block">Category</Label>
                      <Select>
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
                      <Select>
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
