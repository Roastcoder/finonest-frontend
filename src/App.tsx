import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";
import Services from "./pages/Services";
import HomeLoan from "./pages/services/HomeLoan";
import CarLoan from "./pages/services/CarLoan";
import UsedCarLoan from "./pages/services/UsedCarLoan";
import PersonalLoan from "./pages/services/PersonalLoan";
import BusinessLoan from "./pages/services/BusinessLoan";
import CreditCards from "./pages/services/CreditCards";
import CreditCardsStandalone from "./pages/CreditCardsUpdated";
import CreditCardApply from "./pages/CreditCardApply";
import LoanAgainstProperty from "./pages/services/LoanAgainstProperty";
import FinobizzLearning from "./pages/services/FinobizzLearning";
import CourseDetails from "./pages/services/CourseDetails";
import CourseEnrollment from "./pages/services/CourseEnrollment";
import LoanAgainstProperty from "./pages/services/LoanAgainstProperty";
import FinobizzLearning from "./pages/services/FinobizzLearning";
import CibilCheck from "./pages/CibilCheck";
import ServiceApply from "./pages/ServiceApply";
import FormSuccess from "./pages/FormSuccess";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboardNew";
import IndexDynamic from "./pages/IndexDynamic";
import Apply from "./pages/Apply";
import ErrorBoundary from "./components/ErrorBoundary";
import BankingPartnersPage from "./pages/BankingPartnersPage";
import OurBranches from "./pages/OurBranches";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import BankerForm from "./pages/BankerForm";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import BranchDetail from "./pages/BranchDetail";
import Sitemap from "./pages/Sitemap";
import LoanOnboarding from "./pages/LoanOnboarding";
import DSAPartner from "./pages/DSAPartner";
import DSAPartnerRegistration from "./pages/DSAPartnerRegistration";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if this is a first visit in this session
    const hasLoaded = sessionStorage.getItem('finonest_loaded');
    if (hasLoaded) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('finonest_loaded', 'true');
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
          {showContent && (
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                <Route path="/" element={<IndexDynamic />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/home-loan" element={<HomeLoan />} />
                <Route path="/services/car-loan" element={<CarLoan />} />
                <Route path="/services/used-car-loan" element={<UsedCarLoan />} />
                <Route path="/services/personal-loan" element={<PersonalLoan />} />
                <Route path="/services/business-loan" element={<BusinessLoan />} />
                <Route path="/services/credit-cards" element={<Navigate to="/credit-cards" replace />} />
                <Route path="/credit-cards" element={<CreditCardsStandalone />} />
                <Route path="/credit-card-apply" element={<CreditCardApply />} />
                <Route path="/services/loan-against-property" element={<LoanAgainstProperty />} />
                <Route path="/services/lap" element={<LoanAgainstProperty />} />
                <Route path="/services/finobizz-learning" element={<FinobizzLearning />} />
                <Route path="/services/finobizz-learning/course/:id" element={<CourseDetails />} />
                <Route path="/services/finobizz-learning/course/:id/enroll" element={<CourseEnrollment />} />
                <Route path="/services/credit-cards" element={<CreditCards />} />
                <Route path="/services/loan-against-property" element={<LoanAgainstProperty />} />
                <Route path="/services/lap" element={<LoanAgainstProperty />} />
                <Route path="/services/finobizz-learning" element={<FinobizzLearning />} />
                <Route path="/services/:service/apply" element={<ServiceApply />} />
                <Route path="/form-success" element={<FormSuccess />} />
                <Route path="/credit-score" element={<CibilCheck />} />
                <Route path="/cibil-check" element={<CibilCheck />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
                <Route path="/admin/applications" element={<AdminDashboard />} />
                <Route path="/admin/loan-onboarding" element={<AdminDashboard />} />
                <Route path="/admin/loan-products" element={<AdminDashboard />} />
                <Route path="/admin/dsa-applications" element={<AdminDashboard />} />
                <Route path="/admin/leads" element={<AdminDashboard />} />
                <Route path="/admin/contact-forms" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminDashboard />} />
                <Route path="/admin/blogs" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<AdminDashboard />} />
                <Route path="/admin/enrollments" element={<AdminDashboard />} />
                <Route path="/admin/branches" element={<AdminDashboard />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/:slug" element={<JobDetail />} />
                <Route path="/admin/careers" element={<AdminDashboard />} />
                <Route path="/admin/bankers" element={<AdminDashboard />} />
                <Route path="/admin/slides" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
                <Route path="/branches" element={<OurBranches />} />
                <Route path="/our-branches" element={<OurBranches />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/emi-calculator" element={<EMICalculatorPage />} />
                <Route path="/banking-partners" element={<BankingPartnersPage />} />
                <Route path="/partners" element={<BankingPartnersPage />} />
                <Route path="/banker-form" element={<BankerForm />} />
                <Route path="/loan-onboarding" element={<LoanOnboarding />} />
                <Route path="/dsa-partner" element={<DSAPartner />} />
                <Route path="/become-partner" element={<DSAPartner />} />
                <Route path="/dsa-registration" element={<DSAPartnerRegistration />} />
                <Route path="/:branchName" element={<BranchDetail />} />
                <Route path="/banking-partners" element={<BankingPartnersPage />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/emi-calculator" element={<EMICalculatorPage />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
