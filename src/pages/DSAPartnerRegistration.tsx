import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Briefcase, 
  CheckCircle,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";
import { Helmet } from "react-helmet";

const DSAPartnerRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    mobile_number: "",
    email: "",
    pan_number: "",
    aadhar_number: "",
    date_of_birth: "",
    
    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Professional Information
    current_profession: "",
    experience_years: "",
    monthly_income: "",
    
    // Business Information
    business_type: "individual", // individual or firm
    gst_number: "",
    firm_name: "",
    
    // Banking Information
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    
    // Additional Information
    preferred_products: [],
    target_monthly_cases: "",
    coverage_area: "",
    remarks: "",
    
    // Agreements
    terms_accepted: false,
    data_consent: false
  });

  const professions = [
    "Loan Agent",
    "Ex-Banker",
    "Financial Advisor", 
    "Mutual Fund Agent",
    "Chartered Accountant",
    "Real Estate Professional",
    "Business Owner",
    "Entrepreneur",
    "Insurance Agent",
    "Other"
  ];

  const loanProducts = [
    "Home Loans",
    "Personal Loans", 
    "Business Loans",
    "Car Loans",
    "Loan Against Property",
    "Education Loans",
    "Credit Cards",
    "Insurance Products"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductToggle = (product: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_products: prev.preferred_products.includes(product)
        ? prev.preferred_products.filter(p => p !== product)
        : [...prev.preferred_products, product]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms_accepted || !formData.data_consent) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions and data consent",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.finonest.com/api/dsa-registration.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registration_date: new Date().toISOString(),
          status: 'pending'
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Registration Successful!",
          description: "Your DSA Partner application has been submitted. Our team will contact you within 24 hours.",
        });
        
        // Reset form
        setFormData({
          full_name: "",
          mobile_number: "",
          email: "",
          pan_number: "",
          aadhar_number: "",
          date_of_birth: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          current_profession: "",
          experience_years: "",
          monthly_income: "",
          business_type: "individual",
          gst_number: "",
          firm_name: "",
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          preferred_products: [],
          target_monthly_cases: "",
          coverage_area: "",
          remarks: "",
          terms_accepted: false,
          data_consent: false
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Error submitting registration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>DSA Partner Registration - Finonest | Join Our Network</title>
        <meta name="description" content="Register as DSA Partner with Finonest. Start your loan business with zero investment. Fill the registration form and start earning today!" />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen bg-background pt-20 pb-20 lg:pb-0">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                DSA Partner Registration
              </h1>
              <p className="text-lg text-primary-foreground/90">
                Join Finonest's trusted network and start your loan business today
              </p>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Zero Investment</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">High Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Trusted Network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                      <Input
                        type="tel"
                        value={formData.mobile_number}
                        onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">PAN Number</label>
                      <Input
                        value={formData.pan_number}
                        onChange={(e) => handleInputChange('pan_number', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                      <Input
                        value={formData.aadhar_number}
                        onChange={(e) => handleInputChange('aadhar_number', e.target.value)}
                        placeholder="1234 5678 9012"
                        maxLength={12}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Address *</label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">PIN Code *</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Profession *</label>
                      <Select value={formData.current_profession} onValueChange={(value) => handleInputChange('current_profession', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map(profession => (
                            <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience (Years) *</label>
                      <Input
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', e.target.value)}
                        placeholder="Enter years of experience"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Income Range</label>
                      <Select value={formData.monthly_income} onValueChange={(value) => handleInputChange('monthly_income', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Income Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="below-25000">Below ₹25,000</SelectItem>
                          <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                          <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                          <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                          <SelectItem value="above-200000">Above ₹2,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type *</label>
                      <Select value={formData.business_type} onValueChange={(value) => handleInputChange('business_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Business Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="firm">Firm/Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.business_type === 'firm' && (
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">Firm/Company Name *</label>
                        <Input
                          value={formData.firm_name}
                          onChange={(e) => handleInputChange('firm_name', e.target.value)}
                          placeholder="Enter firm name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GST Number</label>
                        <Input
                          value={formData.gst_number}
                          onChange={(e) => handleInputChange('gst_number', e.target.value.toUpperCase())}
                          placeholder="22AAAAA0000A1Z5"
                          maxLength={15}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Banking Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Banking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Name</label>
                      <Input
                        value={formData.bank_name}
                        onChange={(e) => handleInputChange('bank_name', e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Number</label>
                      <Input
                        value={formData.account_number}
                        onChange={(e) => handleInputChange('account_number', e.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">IFSC Code</label>
                      <Input
                        value={formData.ifsc_code}
                        onChange={(e) => handleInputChange('ifsc_code', e.target.value.toUpperCase())}
                        placeholder="SBIN0001234"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Business Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-4">Preferred Loan Products *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {loanProducts.map(product => (
                        <div key={product} className="flex items-center space-x-2">
                          <Checkbox
                            id={product}
                            checked={formData.preferred_products.includes(product)}
                            onCheckedChange={() => handleProductToggle(product)}
                          />
                          <label htmlFor={product} className="text-sm font-medium cursor-pointer">
                            {product}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Monthly Cases</label>
                      <Select value={formData.target_monthly_cases} onValueChange={(value) => handleInputChange('target_monthly_cases', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 cases</SelectItem>
                          <SelectItem value="6-10">6-10 cases</SelectItem>
                          <SelectItem value="11-20">11-20 cases</SelectItem>
                          <SelectItem value="21-50">21-50 cases</SelectItem>
                          <SelectItem value="50+">50+ cases</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Coverage Area</label>
                      <Input
                        value={formData.coverage_area}
                        onChange={(e) => handleInputChange('coverage_area', e.target.value)}
                        placeholder="Areas you can cover"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Remarks</label>
                    <Textarea
                      value={formData.remarks}
                      onChange={(e) => handleInputChange('remarks', e.target.value)}
                      placeholder="Any additional information you'd like to share"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) => handleInputChange('terms_accepted', checked)}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the <a href="/terms-and-conditions" target="_blank" className="text-primary hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.data_consent}
                      onCheckedChange={(checked) => handleInputChange('data_consent', checked)}
                    />
                    <label htmlFor="consent" className="text-sm cursor-pointer">
                      I consent to the collection and processing of my personal data for DSA partner registration and business purposes
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit DSA Partner Registration"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Our team will contact you within 24 hours after submission
                  </p>
                </CardContent>
              </Card>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default DSAPartnerRegistration;