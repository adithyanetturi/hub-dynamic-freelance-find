
import { useState, useEffect } from "react";
import { getFeaturedProjects } from "@/data/dummyData";
import ProjectCard from "./ProjectCard";

const FeaturedProjects = () => {
  const [featuredProjects, setFeaturedProjects] = useState(getFeaturedProjects());
  
  // Enhance projects with better images
  useEffect(() => {
    const enhancedProjects = featuredProjects.map(project => {
      let enhancedImage;
      
      // Assign relevant high-quality images based on category
      switch(project.category) {
        case "Web Development":
          enhancedImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";
          break;
        case "Graphic Design":
          enhancedImage = "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80";
          break;
        case "Mobile Development":
          enhancedImage = "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80";
          break;
        case "Content Writing":
          enhancedImage = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80";
          break;
        case "Digital Marketing":
        case "SEO":
          enhancedImage = "https://images.unsplash.com/photo-1533750516509-a7ce7d8bbb5a?auto=format&fit=crop&w=800&q=80";
          break;
        case "Video Editing":
          enhancedImage = "https://images.unsplash.com/photo-1574717024453-e599f7994a00?auto=format&fit=crop&w=800&q=80";
          break;
        default:
          enhancedImage = project.image;
      }
      
      return {
        ...project,
        image: enhancedImage
      };
    });
    
    setFeaturedProjects(enhancedProjects);
  }, []);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Featured Projects</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover some of the most exciting projects currently available on FreelanceHub
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {featuredProjects.map(project => (
            <div key={project.id} className="hover-scale">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
