
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { freelancers } from "@/data/dummyData";
import FreelancerCard from "@/components/FreelancerCard";

const Index = () => {
  // Get 3 random freelancers
  const featuredFreelancers = [...freelancers]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedProjects />

        {/* How it works section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                FreelanceHub makes finding and working with freelancers simple and efficient
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-600 text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Post a Project</h3>
                <p className="text-gray-600">
                  Describe your project and the skills you're looking for
                </p>
              </div>

              <div className="text-center">
                <div className="bg-brand-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-600 text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Bids</h3>
                <p className="text-gray-600">
                  Receive competitive bids from skilled freelancers
                </p>
              </div>

              <div className="text-center">
                <div className="bg-brand-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-600 text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Hire & Work</h3>
                <p className="text-gray-600">
                  Choose the best freelancer and start your project
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Freelancers section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Freelancers</h2>
              <Button variant="outline" asChild>
                <Link to="/freelancers" className="flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredFreelancers.map(freelancer => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          </div>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
