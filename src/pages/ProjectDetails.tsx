
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  getProjectById, 
  getBidsByProject, 
  getFreelancerByBid,
  getProjectPriceHistory
} from "@/data/dummyData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;
  const bids = id ? getBidsByProject(id) : [];
  const priceHistory = id ? getProjectPriceHistory(id) : [];
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Project not found</h1>
            <p className="text-gray-600">The project you're looking for doesn't exist.</p>
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
                        Posted {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                    <Badge className="text-lg bg-brand-500 hover:bg-brand-600">
                      ${project.price}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{project.category}</Badge>
                    <Badge variant="outline">{project.location}</Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Project Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                  </div>
                  
                  <Button size="lg" className="w-full">Submit a Proposal</Button>
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
            
            {/* Bids sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Proposals ({bids.length})</h2>
                
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map(bid => {
                      const freelancer = getFreelancerByBid(bid.id);
                      const initials = freelancer?.name
                        ? freelancer.name
                            .split(" ")
                            .map(name => name[0])
                            .join("")
                            .toUpperCase()
                        : "?";
                      
                      return (
                        <div key={bid.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar>
                              <AvatarImage src={freelancer?.avatar} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">
                                {freelancer?.name || "Unknown Freelancer"}
                              </h3>
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
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">Accept</Button>
                            <Button size="sm" variant="outline">Message</Button>
                          </div>
                        </div>
                      );
                    })}
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
