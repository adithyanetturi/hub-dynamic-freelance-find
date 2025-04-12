
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FreelancerSignup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Become a Freelancer</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Why Join FreelanceHub?</CardTitle>
                <CardDescription>
                  Connect with clients and grow your freelance business
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Find Great Projects</h3>
                  <p className="text-gray-600">
                    Browse thousands of projects and find opportunities that match your skills and interests.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Dynamic Pricing</h3>
                  <p className="text-gray-600">
                    Our innovative pricing system helps you set competitive rates and win more clients.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Secure Payments</h3>
                  <p className="text-gray-600">
                    Get paid on time, every time, with our secure payment protection system.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Build Your Reputation</h3>
                  <p className="text-gray-600">
                    Showcase your portfolio and collect reviews to stand out from the competition.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <p className="text-xl mb-6">Ready to start your freelance journey?</p>
              <Button size="lg" asChild>
                <Link to="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerSignup;
