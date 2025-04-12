
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-600">
            FreelanceHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-brand-600 font-medium">
              Home
            </Link>
            <Link to="/browse" className="text-gray-700 hover:text-brand-600 font-medium">
              Browse Projects
            </Link>
            <Link to="/freelancer" className="text-gray-700 hover:text-brand-600 font-medium">
              Become a Freelancer
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-brand-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="block text-gray-700 hover:text-brand-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Projects
            </Link>
            <Link 
              to="/freelancer" 
              className="block text-gray-700 hover:text-brand-600 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Freelancer
            </Link>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
