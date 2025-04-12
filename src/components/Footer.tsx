
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold text-brand-600">
              FreelanceHub
            </Link>
            <p className="text-gray-600 text-sm">
              Connect with top freelancers and find projects with our dynamic pricing system.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="text-gray-600 hover:text-brand-600">Find Freelancers</Link></li>
              <li><Link to="/post" className="text-gray-600 hover:text-brand-600">Post a Project</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand-600">Dynamic Pricing</Link></li>
              <li><Link to="/enterprise" className="text-gray-600 hover:text-brand-600">Enterprise Solutions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/freelancer" className="text-gray-600 hover:text-brand-600">Become a Freelancer</Link></li>
              <li><Link to="/find-work" className="text-gray-600 hover:text-brand-600">Find Work</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-brand-600">Resources</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-brand-600">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-600">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-600">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
