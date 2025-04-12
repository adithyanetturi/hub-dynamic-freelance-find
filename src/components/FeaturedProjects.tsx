
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
          enhancedImage = "/project-web.jpg";
          break;
        case "Design":
          enhancedImage = "/project-design.jpg";
          break;
        case "Writing":
          enhancedImage = "/project-writing.jpg";
          break;
        case "Video":
          enhancedImage = "/project-video.jpg";
          break;
        case "SEO":
          enhancedImage = "/project-seo.jpg";
          break;
        case "Mobile Development":
          enhancedImage = "/project-mobile.jpg";
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
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover some of the most exciting projects currently available on FreelanceHub
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
