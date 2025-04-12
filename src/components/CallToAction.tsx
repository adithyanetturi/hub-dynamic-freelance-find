
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="bg-brand-500 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to get started?</h2>
        <p className="text-xl mb-8 text-white/90 max-w-xl mx-auto">
          Post a project and get bids from top freelancers
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link to="/post">Post a Project</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
