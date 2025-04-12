
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const backgroundImages = [
  "/hero-bg.jpg", 
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80"
];

const HeroSection = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background images with transition */}
      {backgroundImages.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
            index === bgIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Connect with Expert Freelancers
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Find the perfect match for your project with our AI-powered marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" asChild className="bg-brand-500 hover:bg-brand-600">
              <Link to="/post">Post a Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
              <Link to="/browse">Browse Projects</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="text-brand-300 font-medium">Trusted by top companies worldwide</span>
            <div className="h-px bg-gray-500 flex-grow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
