
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDashboardLink = () => {
    if (!userProfile) return "/dashboard";
    return userProfile.user_type === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
  };

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
            {!user && (
              <Link to="/freelancer" className="text-gray-700 hover:text-brand-600 font-medium">
                Become a Freelancer
              </Link>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {userProfile?.name
                          ? userProfile.name.charAt(0).toUpperCase()
                          : user.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userProfile?.user_type === "client" && (
                    <DropdownMenuItem asChild>
                      <Link to="/post" className="flex items-center w-full">
                        Post Project
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?tab=register">Sign up</Link>
                </Button>
              </div>
            )}
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
            {!user && (
              <Link 
                to="/freelancer" 
                className="block text-gray-700 hover:text-brand-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Freelancer
              </Link>
            )}
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="block text-gray-700 hover:text-brand-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userProfile?.user_type === "client" && (
                  <Link 
                    to="/post" 
                    className="block text-gray-700 hover:text-brand-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Project
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
