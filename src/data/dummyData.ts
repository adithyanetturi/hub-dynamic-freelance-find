
export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  image: string;
  createdAt: Date;
}

export interface Freelancer {
  id: string;
  name: string;
  bio: string;
  projectIds: string[];
  avatar: string;
}

export interface Bid {
  id: string;
  freelancerId: string;
  projectId: string;
  price: number;
  description: string;
  createdAt: Date;
}

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Web Development Project",
    description: "We need a web developer to build a website for our company. The website should be responsive and have a modern design.",
    price: 1000,
    category: "Web Development",
    location: "USA",
    image: "/project-web.jpg",
    createdAt: new Date(2023, 3, 15)
  },
  {
    id: "proj-2",
    title: "Graphic Design Project",
    description: "We need a graphic designer to create a logo for our company. The logo should be simple, modern, and represent our brand values.",
    price: 500,
    category: "Graphic Design",
    location: "UK",
    image: "/project-design.jpg",
    createdAt: new Date(2023, 4, 10)
  },
  {
    id: "proj-3",
    title: "Mobile App Development",
    description: "Looking for an experienced mobile app developer to create a fitness tracking app. Must have experience with React Native.",
    price: 2500,
    category: "Mobile Development",
    location: "Canada",
    image: "/project-mobile.jpg",
    createdAt: new Date(2023, 5, 5)
  },
  {
    id: "proj-4",
    title: "Content Writing for Blog",
    description: "Need a skilled content writer to create engaging articles for our tech blog. Topics will include AI, machine learning, and tech trends.",
    price: 300,
    category: "Content Writing",
    location: "Australia",
    image: "/project-writing.jpg",
    createdAt: new Date(2023, 6, 20)
  },
  {
    id: "proj-5",
    title: "SEO Optimization",
    description: "Looking for an SEO expert to optimize our e-commerce website for better search engine rankings and increased organic traffic.",
    price: 800,
    category: "Digital Marketing",
    location: "Germany",
    image: "/project-seo.jpg",
    createdAt: new Date(2023, 7, 12)
  },
  {
    id: "proj-6",
    title: "Video Editing Project",
    description: "Need a video editor to create promotional videos for our new product launch. Experience with After Effects and Premier Pro required.",
    price: 1200,
    category: "Video Editing",
    location: "France",
    image: "/project-video.jpg",
    createdAt: new Date(2023, 8, 8)
  }
];

export const freelancers: Freelancer[] = [
  {
    id: "free-1",
    name: "John Doe",
    bio: "I'm a web developer with 5 years of experience specializing in React, Node.js, and responsive design. I create efficient, user-friendly websites.",
    projectIds: ["proj-1", "proj-3"],
    avatar: "/freelancer-1.jpg"
  },
  {
    id: "free-2",
    name: "Jane Smith",
    bio: "I'm a graphic designer with 3 years of experience creating logos, branding materials, and UI designs. I focus on clean, modern aesthetics.",
    projectIds: ["proj-2", "proj-4"],
    avatar: "/freelancer-2.jpg"
  },
  {
    id: "free-3",
    name: "Michael Brown",
    bio: "Experienced mobile developer specializing in iOS and Android apps. 7 years of experience with React Native and Flutter.",
    projectIds: ["proj-3", "proj-5"],
    avatar: "/freelancer-3.jpg"
  },
  {
    id: "free-4",
    name: "Sarah Johnson",
    bio: "Content writer and SEO specialist with a focus on tech and business writing. 4 years experience creating engaging, conversion-focused content.",
    projectIds: ["proj-4", "proj-6"],
    avatar: "/freelancer-4.jpg"
  }
];

export const bids: Bid[] = [
  {
    id: "bid-1",
    freelancerId: "free-1",
    projectId: "proj-1",
    price: 900,
    description: "I can deliver a responsive website using React and Node.js within 3 weeks. Includes 2 rounds of revisions.",
    createdAt: new Date(2023, 3, 16)
  },
  {
    id: "bid-2",
    freelancerId: "free-2",
    projectId: "proj-2",
    price: 400,
    description: "I will create a modern, versatile logo with brand guidelines. Includes 3 initial concepts and unlimited revisions.",
    createdAt: new Date(2023, 4, 12)
  },
  {
    id: "bid-3",
    freelancerId: "free-3",
    projectId: "proj-3",
    price: 2200,
    description: "I can develop the fitness tracking app with all required features in 2 months. Includes testing and bug fixes.",
    createdAt: new Date(2023, 5, 7)
  },
  {
    id: "bid-4",
    freelancerId: "free-4",
    projectId: "proj-4",
    price: 250,
    description: "I'll write 5 well-researched, SEO-optimized articles of 1500+ words each. Includes keyword research and meta descriptions.",
    createdAt: new Date(2023, 6, 22)
  },
  {
    id: "bid-5",
    freelancerId: "free-1",
    projectId: "proj-5",
    price: 750,
    description: "Complete SEO audit and implementation plan. Includes keyword research, on-page optimization, and monthly reporting.",
    createdAt: new Date(2023, 7, 15)
  },
  {
    id: "bid-6",
    freelancerId: "free-2",
    projectId: "proj-6",
    price: 1100,
    description: "Professional video editing with dynamic transitions, color grading, and sound design. 5 videos of 1-2 minutes each.",
    createdAt: new Date(2023, 8, 10)
  }
];

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

export function getFreelancerById(id: string): Freelancer | undefined {
  return freelancers.find(freelancer => freelancer.id === id);
}

export function getProjectsByFreelancer(freelancerId: string): Project[] {
  const freelancer = getFreelancerById(freelancerId);
  if (!freelancer) return [];
  
  return freelancer.projectIds
    .map(id => getProjectById(id))
    .filter((project): project is Project => project !== undefined);
}

export function getBidsByProject(projectId: string): Bid[] {
  return bids.filter(bid => bid.projectId === projectId);
}

export function getFreelancerByBid(bidId: string): Freelancer | undefined {
  const bid = bids.find(b => b.id === bidId);
  if (!bid) return undefined;
  
  return getFreelancerById(bid.freelancerId);
}

// Price history simulation for dynamic pricing graph
export function getProjectPriceHistory(projectId: string): {date: Date, price: number}[] {
  const project = getProjectById(projectId);
  if (!project) return [];
  
  const projectBids = getBidsByProject(projectId);
  let basePrice = project.price;
  
  // Sort bids by date
  const sortedBids = [...projectBids].sort((a, b) => 
    a.createdAt.getTime() - b.createdAt.getTime()
  );
  
  // Generate price points
  const pricePoints = [];
  
  // Start with the initial price
  pricePoints.push({
    date: project.createdAt,
    price: basePrice
  });
  
  // Add price points for each bid
  sortedBids.forEach(bid => {
    pricePoints.push({
      date: bid.createdAt,
      price: bid.price
    });
  });
  
  return pricePoints;
}

export function getFeaturedProjects(): Project[] {
  // Get 3 random projects
  return [...projects]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}

export const categories = [
  "All Categories",
  "Web Development",
  "Graphic Design",
  "Mobile Development",
  "Content Writing",
  "Digital Marketing",
  "Video Editing",
  "UI/UX Design",
  "Data Entry",
  "Translation",
];

export const locations = [
  "All Locations",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Japan",
  "Remote",
];
