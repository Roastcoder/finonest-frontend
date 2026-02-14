import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminContactForms from "./admin/AdminContactForms";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  LogOut, 
  Loader2,
  FileText,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Image,
  MapPin
} from "lucide-react";
import logo from "@/assets/logo.png";
import AdminApplications from "./admin/AdminApplications";
import AdminUsers from "./admin/AdminUsers";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminSettings from "./admin/AdminSettings";
import AdminBlogs from "./admin/AdminBlogs";
import AdminCourses from "./admin/AdminCourses";
import AdminBranches from "./admin/AdminBranches";
import AdminEnrollments from "./admin/AdminEnrollments";
import AdminCareers from "./admin/AdminCareers";
import AdminLoanOnboarding from "./admin/AdminLoanOnboarding";
import AdminLoanProducts from "./admin/AdminLoanProducts";
import AdminDSAApplications from "@/components/AdminDSAApplications";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, token, logout, isLoading: authLoading } = useAuth();

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/applications')) return 'applications';
    if (path.includes('/dsa-applications')) return 'dsa-applications';
    if (path.includes('/contact-forms')) return 'contacts';
    if (path.includes('/users')) return 'users';
    if (path.includes('/analytics')) return 'dashboard';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/blogs')) return 'blogs';
    if (path.includes('/courses')) return 'courses';
    if (path.includes('/enrollments')) return 'enrollments';
    if (path.includes('/branches')) return 'branches';
    if (path.includes('/careers')) return 'careers';
    if (path.includes('/loan-onboarding')) return 'loan-onboarding';
    if (path.includes('/loan-products')) return 'loan-products';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (!authLoading) {
      if (!token || !user) {
        navigate('/auth');
        return;
      }
      
      if (user.role !== 'ADMIN') {
        navigate('/dashboard');
        return;
      }
      
      setLoading(false);
    }
  }, [authLoading, token, user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <AdminAnalytics />;
      case 'applications':
        return <AdminApplications />;
      case 'dsa-applications':
        return <AdminDSAApplications />;
      case 'contacts':
        return <AdminContactForms />;
      case 'users':
        return <AdminUsers />;
      case 'blogs':
        return <AdminBlogs />;
      case 'courses':
        return <AdminCourses />;
      case 'enrollments':
        return <AdminEnrollments />;
      case 'careers':
        return <AdminCareers />;
      case 'branches':
        return <AdminBranches />;
      case 'loan-onboarding':
        return <AdminLoanOnboarding />;
      case 'loan-products':
        return <AdminLoanProducts />;
      case 'slides':
        return <AdminSlides />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminAnalytics />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Finonest</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Finonest" className="h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
        
        {/* Sidebar */}
        <div className="hidden md:flex w-64 bg-card border-r border-border flex-col fixed h-screen overflow-y-auto">
          <div className="p-6">
            <Link to="/">
              <img src={logo} alt="Finonest" className="h-8 object-contain" />
            </Link>
          </div>
          <nav className="px-4 space-y-2 flex-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Management</div>
            <Link 
              to="/admin/analytics"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/admin/applications"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'applications' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
              Applications
            </Link>
            <Link 
              to="/admin/dsa-applications"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'dsa-applications' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              DSA Applications
            </Link>
            <Link 
              to="/admin/loan-onboarding"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'loan-onboarding' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
              Loan Onboarding
            </Link>
            <Link 
              to="/admin/loan-products"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'loan-products' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
              Loan Products
            </Link>
            <Link 
              to="/admin/contact-forms"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'contacts' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Contact Forms
            </Link>
            <Link 
              to="/admin/users"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </Link>
            <Link 
              to="/admin/blogs"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'blogs' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog Management
            </Link>
            <Link 
              to="/admin/courses"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'courses' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Finobizz Learning
            </Link>
            <Link 
              to="/admin/enrollments"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'enrollments' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              Course Enrollments
            </Link>
            <Link 
              to="/admin/careers"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'careers' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              Career Management
            </Link>
            <Link 
              to="/admin/slides"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'slides' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Image className="w-4 h-4" />
              Home Slides
            </Link>
            <Link 
              to="/admin/branches"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'branches' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Branch Management
            </Link>
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6">Settings</div>
            <Link 
              to="/admin/settings"
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Settings className="w-4 h-4" />
              System
            </Link>
          </nav>
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-16 md:pb-0 md:ml-64">
          <header className="hidden md:block bg-card border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === 'dashboard' && 'Admin Dashboard'}
                  {activeTab === 'applications' && 'Applications Management'}
                  {activeTab === 'dsa-applications' && 'DSA Applications Management'}
                  {activeTab === 'contacts' && 'Contact Forms'}
                  {activeTab === 'users' && 'Users Management'}
                  {activeTab === 'blogs' && 'Blog Management'}
                  {activeTab === 'courses' && 'Finobizz Learning Management'}
                  {activeTab === 'enrollments' && 'Course Enrollments'}
                  {activeTab === 'careers' && 'Career Management'}
                  {activeTab === 'branches' && 'Branch Management'}
                  {activeTab === 'loan-onboarding' && 'Loan Onboarding Management'}
                  {activeTab === 'loan-products' && 'Loan Products Management'}
                  {activeTab === 'settings' && 'System Settings'}
                </h1>
                <p className="text-muted-foreground">
                  {activeTab === 'dashboard' && 'Overview of system performance and statistics'}
                  {activeTab === 'applications' && 'Manage and review loan applications'}
                  {activeTab === 'dsa-applications' && 'Manage and review DSA partner applications'}
                  {activeTab === 'contacts' && 'Manage contact form submissions'}
                  {activeTab === 'users' && 'Manage user accounts and permissions'}
                  {activeTab === 'blogs' && 'Create and manage blog posts with media support'}
                  {activeTab === 'courses' && 'Manage Finobizz Learning courses and content'}
                  {activeTab === 'enrollments' && 'View and manage course enrollments and payments'}
                  {activeTab === 'careers' && 'Manage job postings and applications'}
                  {activeTab === 'branches' && 'Manage branch locations and information'}
                  {activeTab === 'loan-onboarding' && 'Manage loan onboarding applications and data'}
                  {activeTab === 'loan-products' && 'Manage loan products, interest rates, and LTV ratios'}
                  {activeTab === 'slides' && 'Manage home page carousel slides and images'}
                  {activeTab === 'settings' && 'Configure system settings'}
                </p>
              </div>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>
          </header>

          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default AdminDashboard;