
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import ProjectCard from "@/components/ProjectCard";
import { Project, projects } from "@/data/dummyData";
import { Loader2 } from "lucide-react";

const BrowseProjects = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [loading, setLoading] = useState(false);

  const handleSearch = (filters: {
    query: string;
    category: string;
    location: string;
    budget: number[];
  }) => {
    setLoading(true);
    
    // Simulate API call with a delay
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
