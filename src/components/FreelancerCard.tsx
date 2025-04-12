
import { Link } from "react-router-dom";
import { Freelancer } from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FreelancerCardProps {
  freelancer: Freelancer;
}

const FreelancerCard = ({ freelancer }: FreelancerCardProps) => {
  // Get initials for avatar fallback
  const initials = freelancer.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{freelancer.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">{freelancer.bio}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link to={`/freelancer/${freelancer.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreelancerCard;
