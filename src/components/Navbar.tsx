import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
<<<<<<< HEAD
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
=======
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [{
    name: "Home",
    href: "/"
  }, {
    name: "Services",
    href: "/services",
    dropdown: [{
      name: "Home Loan",
      href: "/services/home-loan"
    }, {
      name: "Used Car Loan",
      href: "/services/used-car-loan"
    }, {
      name: "Personal Loan",
      href: "/services/personal-loan"
    }, {
      name: "Business Loan",
      href: "/services/business-loan"
    }, {
      name: "Loan Against Property",
      href: "/services/lap"
    }, {
      name: "Credit Cards",
<<<<<<< HEAD
      href: "/credit-cards"
    }]
  }, {
    name: "Finobizz Learning",
    href: "/services/finobizz-learning"
  }, {
=======
      href: "/services/credit-cards"
    }, {
      name: "Finobizz Learning",
      href: "/services/finobizz-learning"
    }]
  }, {
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
    name: "Credit Score",
    href: "/credit-score"
  }, {
    name: "EMI Calculator",
    href: "/emi-calculator"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
<<<<<<< HEAD
    name: "Our Branches",
    href: "/branches"
  }, {
    name: "Careers",
    href: "/careers"
  }, {
    name: "DSA Partner",
    href: "/dsa-partner"
  }, {
=======
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
    name: "About",
    href: "/about"
  }, {
    name: "Contact",
    href: "/contact"
  }];

  const isActive = (href: string) => location.pathname === href;

  return (
<<<<<<< HEAD
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md py-2 shadow-lg border-b" : "py-4 bg-white"}`}>
      <div className="w-full px-6 flex items-center justify-between">
=======
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-card/95 backdrop-blur-lg py-3 shadow-lg border-b border-border" : "py-4 bg-white"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Finonest" className="h-10 object-contain" />
        </Link>

<<<<<<< HEAD
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map(link => (
            <div 
              key={link.name} 
              className="relative group"
            >
              <Link 
                to={link.href} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive(link.href) 
                    ? "text-primary bg-primary/10 shadow-sm" 
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.name}
                {link.dropdown && <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180`} />}
              </Link>

              {/* Dropdown */}
              {link.dropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg border shadow-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
=======
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <div 
              key={link.name} 
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={link.href} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${
                  isActive(link.href) 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
                {link.dropdown && <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
              </Link>

              {/* Dropdown */}
              {link.dropdown && activeDropdown === link.name && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl border border-border shadow-xl p-2 animate-fade-in z-50">
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                  {link.dropdown.map(item => (
                    <Link 
                      key={item.name} 
                      to={item.href} 
<<<<<<< HEAD
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
=======
                      className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
<<<<<<< HEAD
              <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg z-50">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
=======
              <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-xl z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                </div>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
          <Button variant="hero" size="default" className="group" asChild>
            <Link to="/apply">
              Apply Now
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
<<<<<<< HEAD
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 overflow-y-auto ${isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="w-full px-6 py-4 flex flex-col gap-2">
=======
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl transition-all duration-300 overflow-y-auto ${isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          {navLinks.map(link => (
            <div key={link.name}>
              {link.dropdown ? (
                <>
                  <button
                    type="button"
<<<<<<< HEAD
                    onClick={() => setMobileDropdown(mobileDropdown === link.name ? null : link.name)}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4 overflow-hidden transition-all duration-300 ${mobileDropdown === link.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
=======
                    onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`ml-4 mt-1 space-y-1 border-l-2 border-border pl-4 overflow-hidden transition-all duration-300 ${activeDropdown === link.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                    {link.dropdown.map(item => (
                      <Link 
                        key={item.name} 
                        to={item.href} 
<<<<<<< HEAD
                        className="block py-2 px-4 text-sm text-gray-600 hover:text-primary rounded-lg" 
=======
                        className="block py-2 px-4 text-sm text-muted-foreground hover:text-foreground rounded-lg" 
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  to={link.href} 
<<<<<<< HEAD
                  className={`block py-3 px-4 rounded-lg transition-colors ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"}`} 
=======
                  className={`block py-3 px-4 rounded-lg transition-colors ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`} 
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
<<<<<<< HEAD
          
          <div className="mt-4 pt-4 border-t space-y-2">
            {user ? (
              <>
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
                  className="flex items-center gap-2 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-3 px-4 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/apply" 
                  className="block py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </>
            )}
=======
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border">
            {user ? (
              <>
                <Button variant="ghost" className="w-full justify-center" asChild>
                  <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-center text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="w-full justify-center" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Button variant="hero" className="w-full justify-center" asChild>
              <Link to="/apply">Apply Now</Link>
            </Button>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;