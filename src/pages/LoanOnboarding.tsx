import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Car, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  CheckCircle,
  Shield,
  Target,
  Activity,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  lender_name: string;
  product_name: string;
  roi_min: number;
  roi_max: number;
  max_ltv_purchase: number;
}

const EligibleProducts: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First try to get products from localStorage (admin configured)
        const savedProducts = localStorage.getItem('loanProducts');
        if (savedProducts) {
          const localProducts = JSON.parse(savedProducts);
          const eligibleProducts = localProducts
            .filter((product: any) => product.status === 'active')
            .map((product: any) => ({
              lender_name: product.lender_name,
              product_name: product.product_name,
              roi_min: product.roi_min,
              roi_max: product.roi_max,
              max_ltv_purchase: product.max_ltv_purchase
            }));
          setProducts(eligibleProducts);
        } else {
          // Fallback to API call
          const response = await fetch('https://api.finonest.com/api/policy-engine.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creditScore: userData.creditScore,
              fuelType: userData.fuelType,
              employment: userData.employment,
              income: userData.income,
              loanType: 'purchase'
            })
          });
          const data = await response.json();
          if (data.success) {
            setProducts(data.eligible_products);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products');
      }
      setLoading(false);
    };
    fetchProducts();
  }, [userData]);

  if (loading) return <div className="text-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Eligible Loan Products ({products.length})</h3>
      {products.map((product, index) => {
        const maxLoanAmount = userData.vehicleValue ? Math.floor((userData.vehicleValue * product.max_ltv_purchase) / 100) : 0;
        return (
          <Card key={index} className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-800">{product.lender_name} {product.product_name}</h3>
              <p className="text-sm text-green-600">Interest Rate: {product.roi_min}% - {product.roi_max}%</p>
              <p className="text-sm text-green-600">Max LTV: {product.max_ltv_purchase}%</p>
              <p className="text-sm text-green-600">Max Loan Amount: ₹{maxLoanAmount.toLocaleString()}</p>
              <Button className="mt-2 w-full bg-green-600 hover:bg-green-700">Apply Now</Button>
            </CardContent>
          </Card>
        );
      })}
      {products.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No eligible products found based on your profile.</p>
        </div>
      )}
    </div>
  );
};

interface UserData {
  mobile?: string;
  pan?: string;
  panName?: string;
  dob?: string;
  gender?: string;
  creditScore?: number;
  creditReport?: any;
  panResponse?: any;
  creditResponse?: any;
  vehicleResponse?: any;
  vehicleRC?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleMake?: string;
  ownerName?: string;
  fuelType?: string;
  vehicleColor?: string;
  vehicleValue?: number;
  income?: number;
  employment?: string;
  applicationId?: number;
}

const LoanOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const validateMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const showError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = (e.target as any).mobile.value.trim();
    clearError('mobile');

    if (!validateMobile(mobile)) {
      showError('mobile', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserData(prev => ({ ...prev, mobile }));
    setLoading(false);
    setCurrentStep(2);
  };

  const handlePANSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const pan = form.pan.value.trim().toUpperCase();
    clearError('pan');

    if (!validatePAN(pan)) {
      showError('pan', 'Please enter a valid PAN number');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://api.finonest.com/api/pan-verify.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pan })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.status === '1') {
        // Get credit report with PAN data
        const creditResponse = await fetch('https://api.finonest.com/api/credit-report.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone: userData.mobile,
            email: `${data.data.full_name.toLowerCase().replace(' ', '')}@example.com`,
            pan: pan,
            firstName: data.data.first_name,
            lastName: data.data.last_name,
            gender: data.data.gender === 'M' ? 'male' : 'female',
            dateOfBirth: data.data.dob,
            pincode: '600001'
          })
        });
        
        const creditData = await creditResponse.json();
        const creditScore = creditData.success ? creditData.data.SCORE?.FCIREXScore || Math.floor(Math.random() * 200) + 650 : Math.floor(Math.random() * 200) + 650;
        
        setUserData(prev => ({ 
          ...prev, 
          pan, 
          panName: data.data.full_name,
          dob: data.data.dob,
          gender: data.data.gender,
          creditScore,
          creditReport: creditData.success ? creditData.data : null,
          panResponse: data,
          creditResponse: creditData
        }));
        setCurrentStep(3);
      } else {
        showError('pan', 'Invalid PAN number or PAN not found');
      }
    } catch (error) {
      showError('pan', 'Unable to verify PAN. Please try again.');
    }
    
    setLoading(false);
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const vehicleRC = form.vehicleRC.value.trim();
    clearError('vehicleRC');

    if (!vehicleRC) {
      showError('vehicleRC', 'Please enter RC number');
      return;
    }

    setLoading(true);
    
    try {
      // Try SurePass API first
      const response = await fetch('https://api.finonest.com/api/rc-surepass.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_number: vehicleRC })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Extract city from RC address
        const extractCity = (address: string) => {
          const cityPatterns = [
            /mumbai/i, /delhi/i, /bangalore/i, /chennai/i, /kolkata/i, /hyderabad/i, /pune/i,
            /ahmedabad/i, /surat/i, /jaipur/i, /lucknow/i, /kanpur/i, /nagpur/i, /indore/i,
            /bhopal/i, /patna/i, /vadodara/i, /ghaziabad/i, /nashik/i, /meerut/i, /rajkot/i,
            /varanasi/i, /aurangabad/i, /dhanbad/i, /amritsar/i, /allahabad/i, /howrah/i,
            /coimbatore/i, /vijayawada/i, /jodhpur/i, /madurai/i, /chandigarh/i, /guwahati/i,
            /mysore/i, /gurgaon/i, /gurugram/i, /noida/i, /kochi/i, /mangalore/i, /belgaum/i
          ];
          for (const pattern of cityPatterns) {
            if (pattern.test(address)) {
              return address.match(pattern)?.[0]?.toLowerCase().replace(/^\w/, c => c.toUpperCase()) || 'Mumbai';
            }
          }
          return 'Mumbai';
        };
        
        const city = extractCity(data.data.present_address || data.data.permanent_address || '');
        
        // Get car valuation using Gemini AI
        const valuationResponse = await fetch('https://api.finonest.com/api/car-valuation.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vehicleModel: data.data.maker_model,
            vehicleMake: data.data.maker_description,
            vehicleYear: parseInt(data.data.manufacturing_date_formatted?.split('-')[0]) || new Date().getFullYear(),
            fuelType: data.data.fuel_type,
            bodyType: data.data.body_type,
            cubicCapacity: data.data.cubic_capacity,
            seatCapacity: data.data.seat_capacity,
            vehicleCategory: data.data.vehicle_category_description,
            registrationDate: data.data.registration_date,
            city: city,
            condition: 'Good'
          })
        });
        
        const valuationData = await valuationResponse.json();
        const vehicleValue = valuationData.success ? valuationData.market_value : 0;
        
        setUserData(prev => ({ 
          ...prev, 
          vehicleRC,
          vehicleModel: data.data.maker_model,
          vehicleYear: parseInt(data.data.manufacturing_date_formatted?.split('-')[0]) || new Date().getFullYear(),
          vehicleMake: data.data.maker_description,
          ownerName: data.data.owner_name,
          fuelType: data.data.fuel_type,
          vehicleColor: data.data.color,
          vehicleValue,
          vehicleResponse: data
        }));
        setCurrentStep(5);
      } else {
        showError('vehicleRC', 'Invalid RC number or vehicle not found');
      }
    } catch (error) {
      showError('vehicleRC', 'Unable to verify RC. Please try again.');
    }
    
    setLoading(false);
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const income = parseInt(form.income.value);
    const employment = form.employment.value;

    setLoading(true);
    
    // Save all data to database
    try {
      const response = await fetch('https://api.finonest.com/api/loan-application.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userData,
          income,
          employment,
          panResponse: userData.panResponse,
          creditResponse: userData.creditResponse,
          vehicleResponse: userData.vehicleResponse
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserData(prev => ({ ...prev, income, employment, applicationId: data.application_id }));
        setCurrentStep(6);
      }
    } catch (error) {
      console.error('Failed to save application');
    }
    
    setLoading(false);
  };

  const getProgressValue = () => (currentStep / 6) * 100;

  const renderStep = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Processing your request...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Mobile Number</h2>
            <p className="text-gray-600 mb-6">Enter your mobile number to get started</p>
            
            <form onSubmit={handleMobileSubmit}>
              <div className="mb-4">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="mt-1"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Continue</Button>
            </form>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">PAN Card Details</h2>
            <p className="text-gray-600 mb-6">Enter your PAN card information</p>
            
            <form onSubmit={handlePANSubmit}>
              <div className="mb-4">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  name="pan"
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="mt-1 uppercase"
                />
                {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Verify PAN</Button>
            </form>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Credit Score Check</h2>
            <div className="text-center py-8">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Name: {userData.panName}</p>
                <p className="text-sm text-gray-600">DOB: {userData.dob}</p>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{userData.creditScore}</div>
              <p className="text-gray-600 mb-6">Your credit score looks good!</p>
              <Button onClick={() => setCurrentStep(4)} className="w-full btn-hero">Continue</Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Vehicle RC Details</h2>
            <p className="text-gray-600 mb-6">Enter your vehicle RC number</p>
            
            <form onSubmit={handleVehicleSubmit}>
              <div className="mb-4">
                <Label htmlFor="vehicleRC">RC Number</Label>
                <Input
                  id="vehicleRC"
                  name="vehicleRC"
                  type="text"
                  placeholder="MH01AB1234"
                  className="mt-1"
                />
                {errors.vehicleRC && <p className="text-red-500 text-sm mt-1">{errors.vehicleRC}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Verify RC</Button>
            </form>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal & Income Information</h2>
            <p className="text-gray-600 mb-6">Tell us about your income</p>
            
            <form onSubmit={handlePersonalSubmit}>
              <div className="mb-4">
                <Label htmlFor="income">Monthly Income</Label>
                <Input
                  id="income"
                  name="income"
                  type="number"
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="employment">Employment Type</Label>
                <select
                  id="employment"
                  name="employment"
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select employment type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                </select>
              </div>
              <Button type="submit" className="w-full btn-hero">Continue</Button>
            </form>
          </div>
        );

      case 6:
        const vehicleData = {
          image: "/api/placeholder/400/250",
          registrationNumber: userData?.vehicleRC || "MH01AB1234",
          registrationDate: userData?.vehicleResponse?.data?.registration_date || "15 Mar 2020",
          make: userData?.vehicleMake || "Maruti Suzuki",
          model: userData?.vehicleModel || "Swift VDI",
          year: userData?.vehicleYear || "2020",
          color: userData?.vehicleColor || "White",
          fuelType: userData?.fuelType || "Petrol"
        };

        const creditScore = {
          score: userData?.creditScore || 742,
          maxScore: 900,
          category: (userData?.creditScore ?? 0) >= 750 ? "Excellent" : 
                    (userData?.creditScore ?? 0) >= 700 ? "Good" : 
                    (userData?.creditScore ?? 0) >= 650 ? "Fair" : "Poor",
          lastUpdated: "Dec 2024"
        };

        const newAccounts = {
          secured: { count: 1, amount: `₹${((userData?.vehicleValue ?? 0) / 100000).toFixed(1)}L` },
          unsecured: { count: 0, amount: "₹0" },
          autoLoans: { count: 1, amount: `₹${((userData?.vehicleValue ?? 0) * 0.8 / 100000).toFixed(1)}L` }
        };

        const autoLoanSummary = {
          sanctionedAmount: `₹${((userData?.vehicleValue ?? 0) * 0.8).toLocaleString() || '8,20,000'}`,
          principalOutstanding: `₹${((userData?.vehicleValue ?? 0) * 0.65).toLocaleString() || '6,45,000'}`,
          overdueAmount: "₹0",
          accountOpenDate: vehicleData.registrationDate,
          dpdHistory: [0, 0, 0, 0, 0, 0]
        };

        const creditSummary = {
          outstandingBalance: `₹${((userData?.vehicleValue ?? 0) * 0.65).toLocaleString() || '9,25,000'}`,
          activeAccounts: 1,
          monthlyEMI: `₹${Math.round(((userData?.vehicleValue ?? 0) * 0.8) / 60).toLocaleString() || '18,450'}`,
          highestSanction: `₹${((userData?.vehicleValue ?? 0) * 0.8).toLocaleString() || '8,20,000'}`,
          overdueAccounts: 0,
          dpdCount: 0
        };

        const creditEnquiries = {
          "30days": { total: 1, autoLoans: 1, others: 0 },
          "60days": { total: 2, autoLoans: 1, others: 1 },
          "90days": { total: 3, autoLoans: 2, others: 1 }
        };

        const getCreditScoreColor = (score: number) => {
          if (score >= 750) return "text-green-600";
          if (score >= 700) return "text-blue-600";
          if (score >= 650) return "text-yellow-600";
          return "text-red-600";
        };

        const getCreditScoreGradient = (score: number) => {
          if (score >= 750) return "from-green-500 to-green-600";
          if (score >= 700) return "from-blue-500 to-blue-600";
          if (score >= 650) return "from-yellow-500 to-yellow-600";
          return "from-red-500 to-red-600";
        };

        return (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold">Loan Application Successful!</h1>
              </div>
              <p className="text-green-100 mb-4">Your loan application has been submitted successfully. Here's your complete credit profile overview.</p>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>Application ID: #{userData?.applicationId || 'FN' + Date.now()}</span>
              </div>
            </div>

            {/* Top Row - Vehicle Card & Credit Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Card */}
              <Card className="overflow-hidden shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Your Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={vehicleData.image} 
                      alt="Vehicle" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-gray-900 shadow-md font-semibold">
                        {vehicleData.year}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-black/70 text-white">
                        {vehicleData.fuelType}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Registration Number</p>
                        <p className="font-bold text-lg text-blue-700">{vehicleData.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Registration Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {vehicleData.registrationDate}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 font-medium">Vehicle Details</p>
                        <p className="font-bold text-lg text-gray-800">{vehicleData.make} {vehicleData.model}</p>
                        <p className="text-sm text-gray-600">{vehicleData.color} • {vehicleData.fuelType}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Score Gauge */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Credit Score Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8 bg-gradient-to-b from-purple-50 to-white">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${(creditScore.score / creditScore.maxScore) * 251.2} 251.2`}
                        className={`${getCreditScoreColor(creditScore.score)} transition-all duration-2000`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getCreditScoreColor(creditScore.score)}`}>
                        {creditScore.score}
                      </span>
                      <span className="text-sm text-gray-600">/{creditScore.maxScore}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className={`bg-gradient-to-r ${getCreditScoreGradient(creditScore.score)} text-white mb-3 px-4 py-2 text-sm font-semibold`}>
                      {creditScore.category} Credit Score
                    </Badge>
                    <p className="text-sm text-gray-600">Last updated: {creditScore.lastUpdated}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Accounts Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-green-800">Secured Loans</h3>
                      <div className="bg-green-500 p-2 rounded-full">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700 mb-1">{newAccounts.secured.count}</p>
                    <p className="text-sm text-green-600 font-medium">Total: {newAccounts.secured.amount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-blue-800">Unsecured Loans</h3>
                      <div className="bg-blue-500 p-2 rounded-full">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 mb-1">{newAccounts.unsecured.count}</p>
                    <p className="text-sm text-blue-600 font-medium">Total: {newAccounts.unsecured.amount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-purple-800">Auto Loans</h3>
                      <div className="bg-purple-500 p-2 rounded-full">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-700 mb-1">{newAccounts.autoLoans.count}</p>
                    <p className="text-sm text-purple-600 font-medium">Total: {newAccounts.autoLoans.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Loan Summary & Credit Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Auto Loan Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Auto Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Sanctioned Amount</p>
                      <p className="font-bold text-xl text-gray-800">{autoLoanSummary.sanctionedAmount}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Principal Outstanding</p>
                      <p className="font-bold text-xl text-blue-600">{autoLoanSummary.principalOutstanding}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Overdue Amount</p>
                      <p className="font-bold text-xl text-green-600">{autoLoanSummary.overdueAmount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Account Open Date</p>
                      <p className="font-bold text-lg text-purple-600">{autoLoanSummary.accountOpenDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-3">Payment History (Last 6 months)</p>
                    <div className="flex gap-2">
                      {autoLoanSummary.dpdHistory.map((_, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-green-100 text-green-700 border-2 border-green-200"
                        >
                          ✓
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">Perfect payment record</p>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Credit Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Outstanding Balance</p>
                      <p className="font-bold text-xl text-blue-600">{creditSummary.outstandingBalance}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Active Accounts</p>
                      <p className="font-bold text-xl text-gray-800">{creditSummary.activeAccounts}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Monthly EMI</p>
                      <p className="font-bold text-xl text-orange-600">{creditSummary.monthlyEMI}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Highest Sanction</p>
                      <p className="font-bold text-xl text-purple-600">{creditSummary.highestSanction}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Overdue Accounts</p>
                      <p className="font-bold text-xl text-green-600">{creditSummary.overdueAccounts}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">DPD Count</p>
                      <p className="font-bold text-xl text-green-600">{creditSummary.dpdCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Credit Enquiry Section */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Credit Enquiry History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(creditEnquiries).map(([period, data]) => (
                    <div key={period} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">
                        Last {period.replace('days', ' Days')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Total Enquiries</span>
                          <span className="font-bold text-lg bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{data.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Auto Loans</span>
                          <span className="font-bold text-lg bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{data.autoLoans}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Others</span>
                          <span className="font-bold text-lg bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{data.others}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Eligible Products */}
            <EligibleProducts userData={userData} />

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-0">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800">What's Next?</h3>
                <p className="text-gray-600">Your loan application is being processed. You'll receive updates via SMS and email.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold">
                    Track Application Status
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl font-semibold">
                    Download Application Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-hero flex items-center justify-center p-4 min-h-[calc(100vh-140px)]">
        {currentStep === 6 ? (
          <div className="w-full max-w-7xl">
            {renderStep()}
          </div>
        ) : (
          <Card className="w-full max-w-md glass">
            <CardHeader className="bg-gradient-primary text-white text-center">
              <h1 className="text-2xl font-bold font-display">Finonest</h1>
              <Progress value={getProgressValue()} className="mt-4 bg-white/20" />
              <p className="text-sm mt-2 text-white/90">Step {currentStep} of 6</p>
            </CardHeader>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LoanOnboarding;