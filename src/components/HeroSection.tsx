
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero-image relative min-h-[500px] md:min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Find the best freelancers for your project
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Get started with our dynamic pricing system
          </p>
          <Button size="lg" asChild className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/post">Post a Project</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
