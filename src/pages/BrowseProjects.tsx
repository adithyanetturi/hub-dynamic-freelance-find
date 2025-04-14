
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import ProjectCard from "@/components/ProjectCard";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  client_id: string;
  freelancer_id: string | null;
  status: string;
  created_at: string;
  image: string; // Changed from optional to required
  createdAt: Date; // Added this field to match the dummyData.ts Project interface
}

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

const BrowseProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "open")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Add appropriate images based on category and convert created_at to createdAt
        const projectsWithImages = data.map((project: any) => ({
          ...project,
          image: aiProjectImages[project.category as keyof typeof aiProjectImages] || aiProjectImages.default,
          createdAt: new Date(project.created_at) // Convert created_at string to Date object for createdAt
        }));

        setProjects(projectsWithImages);
        setFilteredProjects(projectsWithImages);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (filters: {
    query: string;
    category: string;
    location: string;
    budget: number[];
  }) => {
    setLoading(true);
    
    // Filter based on search criteria
    setTimeout(() => {
      const filtered = projects.filter(project => {
        const matchesQuery = 
          filters.query === "" ||
          project.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          project.description.toLowerCase().includes(filters.query.toLowerCase());
        
        const matchesCategory =
          filters.category === "All Categories" || project.category === filters.category;
        
        const matchesLocation =
          filters.location === "All Locations" || project.location === filters.location;
        
        const matchesBudget =
          project.price >= filters.budget[0] && project.price <= filters.budget[1];
        
        return matchesQuery && matchesCategory && matchesLocation && matchesBudget;
      });
      
      setFilteredProjects(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>
            <SearchFilters onSearch={handleSearch} />
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <ProjectCard project={project} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">No projects found</h2>
                  <p className="text-gray-600">
                    Try adjusting your search criteria to find more projects
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseProjects;
