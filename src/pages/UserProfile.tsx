
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { getFreelancerById, getProjectsByFreelancer } from "@/data/dummyData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const freelancer = id ? getFreelancerById(id) : undefined;
  const projects = id ? getProjectsByFreelancer(id) : [];
  
  // Get initials for avatar fallback
  const initials = freelancer?.name
    ? freelancer.name
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
    : "?";

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">User not found</h1>
            <p className="text-gray-600">The freelancer you're looking for doesn't exist.</p>
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
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{freelancer.name}</h1>
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <BadgeCheck size={14} className="text-green-600" />
                      Verified Freelancer
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{freelancer.bio}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-xl font-semibold text-gray-800">{projects.length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-xl font-semibold text-gray-800">{Math.floor(projects.length * 0.8)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="text-xl font-semibold text-gray-800">4.8/5</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-xl font-semibold text-gray-800">2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects section */}
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No projects available for this freelancer.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
