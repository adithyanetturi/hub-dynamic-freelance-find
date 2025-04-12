
import { Link } from "react-router-dom";
import { Project } from "@/data/dummyData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="project-card overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {project.location} • {project.category}
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-brand-500 hover:bg-brand-600">
            ${project.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/project/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
