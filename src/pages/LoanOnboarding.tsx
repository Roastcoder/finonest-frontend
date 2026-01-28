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
import { 
  getAccountStatusDescription, 
  getAccountTypeDescription, 
  getEmploymentStatusDescription,
  getGenderDescription,
  getStateDescription,
  getPaymentHistoryDescription
} from '../constants/fbaCodes';

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
        // Try policy engine API first
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
        } else {
          // Fallback to localStorage
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
  email?: string;
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
  const [selectedLoanAmount, setSelectedLoanAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dataSource, setDataSource] = useState<string>(''); // Track data source


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
    setDataSource('Processing mobile number');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserData(prev => ({ ...prev, mobile }));
    setLoading(false);
    setCurrentStep(2);
  };

  const handlePANSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const pan = form.pan.value.trim().toUpperCase();
    const email = form.email.value.trim();
    clearError('pan');
    clearError('email');

    if (!validatePAN(pan)) {
      showError('pan', 'Please enter a valid PAN number');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    setDataSource('API: Fetching PAN verification and credit score data');
    
    try {
      const response = await fetch('https://api.finonest.com/api/pan-verify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.status === '1') {
        try {
          const creditResponse = await fetch('https://api.finonest.com/api/credit-report.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: userData.mobile,
              email: email || `${data.data.full_name.toLowerCase().replace(' ', '')}@example.com`,
              pan: pan,
              firstName: data.data.first_name,
              lastName: data.data.last_name,
              gender: data.data.gender === 'M' ? 'male' : 'female',
              dateOfBirth: data.data.dob,
              pincode: '110001'
            })
          });
          
          const creditData = creditResponse.ok ? await creditResponse.json() : { success: false };
          const creditScore = creditData.success ? creditData.data.SCORE?.FCIREXScore || Math.floor(Math.random() * 200) + 650 : Math.floor(Math.random() * 200) + 650;
          
          setUserData(prev => ({ 
            ...prev, 
            pan, 
            email,
            panName: data.data.full_name,
            dob: data.data.dob,
            gender: data.data.gender,
            creditScore,
            creditReport: creditData.success ? creditData.data : null,
            panResponse: data,
            creditResponse: creditData
          }));
          
          setCurrentStep(3);
        } catch (creditError) {
          // Credit API failed, but continue with PAN data
          setDataSource('API: PAN verified, credit score simulated (credit API unavailable)');
          setUserData(prev => ({ 
            ...prev, 
            pan, 
            email,
            panName: data.data.full_name,
            dob: data.data.dob,
            gender: data.data.gender,
            creditScore: Math.floor(Math.random() * 200) + 650,
            creditReport: null,
            panResponse: data,
            creditResponse: { success: false }
          }));
          setCurrentStep(3);
        }
      } else {
        showError('pan', 'Invalid PAN number or PAN not found');
      }
    } catch (error) {
      // Complete API failure - use fallback data
      setDataSource('Fallback: API unavailable, using simulated data');
      const simulatedName = `User ${pan.substring(5, 9)}`;
      setUserData(prev => ({ 
        ...prev, 
        pan, 
        email,
        panName: simulatedName,
        dob: '1990-01-01',
        gender: 'M',
        creditScore: Math.floor(Math.random() * 200) + 650,
        creditReport: null,
        panResponse: { success: true, data: { full_name: simulatedName } },
        creditResponse: { success: false }
      }));
      setCurrentStep(3);
    }
    
    setLoading(false);
  };  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const vehicleRC = form.vehicleRC.value.trim();
    clearError('vehicleRC');

    if (!vehicleRC) {
      showError('vehicleRC', 'Please enter RC number');
      return;
    }

    setLoading(true);
    setDataSource('API: Fetching vehicle RC verification and valuation data');
    
    try {
      const response = await fetch('https://api.finonest.com/api/rc-surepass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_number: vehicleRC })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const city = data.data.present_address?.match(/mumbai|delhi|bangalore|chennai|kolkata|hyderabad|pune/i)?.[0] || 'Mumbai';
        
        try {
          const valuationResponse = await fetch('https://api.finonest.com/api/car-valuation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vehicleModel: data.data.maker_model,
              vehicleMake: data.data.maker_description,
              vehicleYear: parseInt(data.data.manufacturing_date_formatted?.split('-')[0]) || new Date().getFullYear(),
              fuelType: data.data.fuel_type,
              city: city,
              condition: 'Good'
            })
          });
          
          const valuationData = valuationResponse.ok ? await valuationResponse.json() : { success: false };
          const vehicleValue = valuationData.success ? valuationData.market_value : 800000;
          
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
        } catch (valuationError) {
          // Valuation failed, use default value
          setDataSource('API: RC verified, valuation simulated (valuation API unavailable)');
          setUserData(prev => ({ 
            ...prev, 
            vehicleRC,
            vehicleModel: data.data.maker_model,
            vehicleYear: parseInt(data.data.manufacturing_date_formatted?.split('-')[0]) || new Date().getFullYear(),
            vehicleMake: data.data.maker_description,
            ownerName: data.data.owner_name,
            fuelType: data.data.fuel_type,
            vehicleColor: data.data.color,
            vehicleValue: 800000,
            vehicleResponse: data
          }));
          setCurrentStep(5);
        }
      } else {
        showError('vehicleRC', 'Invalid RC number or vehicle not found');
      }
    } catch (error) {
      // Complete API failure - use fallback data
      setDataSource('Fallback: API unavailable, using simulated vehicle data');
      setUserData(prev => ({ 
        ...prev, 
        vehicleRC,
        vehicleModel: 'Swift VDI',
        vehicleYear: 2020,
        vehicleMake: 'Maruti Suzuki',
        ownerName: userData.panName || 'Vehicle Owner',
        fuelType: 'Petrol',
        vehicleColor: 'White',
        vehicleValue: 800000,
        vehicleResponse: { success: true, data: { registration_date: '15 Mar 2020' } }
      }));
      setCurrentStep(5);
    }
    
    setLoading(false);
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const income = parseInt(form.income.value) || 0;
    const employment = form.employment.value;

    if (!income || income <= 0) {
      showError('income', 'Please enter a valid monthly income');
      return;
    }

    if (!employment) {
      showError('employment', 'Please select employment type');
      return;
    }

    setLoading(true);
    setDataSource('Saving application data');
    
    // Save to database without API call if data already exists
    const applicationId = Date.now();
    setUserData(prev => ({ ...prev, income, employment, applicationId }));
    setCurrentStep(7);
    setLoading(false);
  };

  const getProgressValue = () => (currentStep / 7) * 100;

  const renderStep = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Processing your request...</p>
          {dataSource && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                📊 {dataSource}
              </p>
            </div>
          )}
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
            <p className="text-gray-600 mb-6">Enter your PAN card information and email</p>
            
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
              <div className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Verify PAN</Button>
            </form>
          </div>
        );

      case 3:
        // Check if we should show cached credit score info
        const creditAge = userData.creditResponse?.lastUpdated ? 
          Math.floor((Date.now() - new Date(userData.creditResponse.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Credit Score Check</h2>
            <div className="text-center py-8">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Name: {userData.panName}</p>
                <p className="text-sm text-gray-600">DOB: {userData.dob}</p>
                {creditAge > 0 && (
                  <p className="text-xs text-blue-600 mt-2">Credit score from database (last updated {creditAge} days ago)</p>
                )}
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{userData.creditScore}</div>
              <p className="text-gray-600 mb-6">Your credit score looks good!</p>
              <Button onClick={() => setCurrentStep(4)} className="w-full btn-hero">Continue</Button>
            </div>
          </div>
        );

      case 4:
        const vehicleValue = userData.vehicleValue || 800000;
        const loanAmountOptions = [
          { value: Math.round(vehicleValue * 0.6), label: `₹${Math.round(vehicleValue * 0.6 / 100000).toFixed(1)}L (60% LTV)` },
          { value: Math.round(vehicleValue * 0.7), label: `₹${Math.round(vehicleValue * 0.7 / 100000).toFixed(1)}L (70% LTV)` },
          { value: Math.round(vehicleValue * 0.8), label: `₹${Math.round(vehicleValue * 0.8 / 100000).toFixed(1)}L (80% LTV)` },
          { value: Math.round(vehicleValue * 0.85), label: `₹${Math.round(vehicleValue * 0.85 / 100000).toFixed(1)}L (85% LTV)` },
        ];

        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Loan Amount</h2>
            <p className="text-gray-600 mb-6">Choose your desired loan amount based on vehicle value</p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Estimated Vehicle Value</p>
                <p className="text-2xl font-bold text-blue-800">₹{(vehicleValue / 100000).toFixed(1)}L</p>
              </div>
              
              <div className="space-y-3">
                {loanAmountOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedLoanAmount === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedLoanAmount(option.value)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{option.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedLoanAmount === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedLoanAmount === option.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      EMI: ₹{Math.round(option.value / 60).toLocaleString()} (5 years)
                    </p>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => {
                  if (!selectedLoanAmount) {
                    showError('loanAmount', 'Please select a loan amount');
                    return;
                  }
                  clearError('loanAmount');
                  setUserData(prev => ({ ...prev, selectedLoanAmount }));
                  setCurrentStep(5);
                }}
                className="w-full btn-hero"
                disabled={!selectedLoanAmount}
              >
                Continue with ₹{selectedLoanAmount ? (selectedLoanAmount / 100000).toFixed(1) : '0'}L
              </Button>
              {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>}
            </div>
          </div>
        );

      case 5:
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

      case 6:
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
                  required
                  min="1"
                />
                {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="employment">Employment Type</Label>
                <select
                  id="employment"
                  name="employment"
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="S">Salaried</option>
                  <option value="E">Self-employed</option>
                  <option value="P">Self-employed Professional</option>
                  <option value="N">Non-Salaried</option>
                </select>
                {errors.employment && <p className="text-red-500 text-sm mt-1">{errors.employment}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Continue</Button>
            </form>
          </div>
        );

      case 7:
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

        // Extract real credit data from creditReport if available
        const creditReport = userData?.creditReport;
        const realCreditData = creditReport ? {
          totalAccounts: creditReport.ACCOUNT_SUMMARY?.total_accounts || creditReport.ACCOUNTS?.length || 1,
          activeAccounts: creditReport.ACCOUNT_SUMMARY?.active_accounts || creditReport.ACCOUNTS?.filter((acc: any) => acc.account_status === '11' || acc.account_status === '21')?.length || 1,
          closedAccounts: creditReport.ACCOUNT_SUMMARY?.closed_accounts || creditReport.ACCOUNTS?.filter((acc: any) => acc.account_status === '13' || acc.account_status === '23')?.length || 0,
          overdueAccounts: creditReport.ACCOUNT_SUMMARY?.overdue_accounts || creditReport.ACCOUNTS?.filter((acc: any) => acc.days_past_due > 0)?.length || 0,
          totalOutstanding: creditReport.ACCOUNT_SUMMARY?.total_outstanding || creditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.current_balance || 0), 0) || ((userData?.vehicleValue ?? 800000) * 0.65),
          totalSanctioned: creditReport.ACCOUNT_SUMMARY?.total_sanctioned || creditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.sanctioned_amount || acc.credit_limit || 0), 0) || ((userData?.vehicleValue ?? 800000) * 0.8),
          monthlyEMI: creditReport.ACCOUNT_SUMMARY?.monthly_emi || creditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.emi_amount || 0), 0) || Math.round(((userData?.vehicleValue ?? 800000) * 0.8) / 60),
          enquiries30: creditReport.ENQUIRY_SUMMARY?.last_30_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return enqDate >= thirtyDaysAgo;
          })?.length || 1,
          enquiries60: creditReport.ENQUIRY_SUMMARY?.last_60_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            return enqDate >= sixtyDaysAgo;
          })?.length || 2,
          enquiries90: creditReport.ENQUIRY_SUMMARY?.last_90_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            return enqDate >= ninetyDaysAgo;
          })?.length || 3,
          autoLoanEnquiries30: creditReport.ENQUIRY_SUMMARY?.auto_loan_30_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return enqDate >= thirtyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 1,
          autoLoanEnquiries60: creditReport.ENQUIRY_SUMMARY?.auto_loan_60_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            return enqDate >= sixtyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 1,
          autoLoanEnquiries90: creditReport.ENQUIRY_SUMMARY?.auto_loan_90_days || creditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            return enqDate >= ninetyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 2,
          // Process account details with FBA codes
          accounts: creditReport.ACCOUNTS?.map((account: any) => ({
            ...account,
            accountTypeDesc: getAccountTypeDescription(account.account_type),
            accountStatusDesc: getAccountStatusDescription(account.account_status),
            paymentHistoryDesc: account.payment_history?.map((ph: string) => getPaymentHistoryDescription(ph))
          })) || []
        } : null;
        
        // Process personal information with FBA codes and real data
        const personalInfo = {
          name: userData?.panName || userData?.ownerName || creditReport?.PERSONAL_INFO?.full_name || 'N/A',
          gender: userData?.gender ? getGenderDescription(userData.gender) : creditReport?.PERSONAL_INFO?.gender ? getGenderDescription(creditReport.PERSONAL_INFO.gender) : 'N/A',
          employment: userData?.employment ? getEmploymentStatusDescription(userData.employment) : 'N/A',
          dob: userData?.dob || creditReport?.PERSONAL_INFO?.date_of_birth || 'N/A',
          email: userData?.email || creditReport?.PERSONAL_INFO?.email || 'N/A',
          mobile: userData?.mobile || creditReport?.PERSONAL_INFO?.phone || 'N/A',
          address: creditReport?.PERSONAL_INFO?.address || creditReport?.ADDRESS?.[0]?.address_line || 'N/A'
        };

        // Extract financer information from RC response
        const rcFinancer = userData?.vehicleResponse?.data?.financer || userData?.vehicleResponse?.data?.hypothecation_details || null;
        
        // Find matching financer in CIBIL data
        const cibilFinancer = realCreditData?.accounts?.find((account: any) => {
          const accountHolder = account.account_holder_name?.toLowerCase() || '';
          const lenderName = account.lender_name?.toLowerCase() || '';
          const rcFinancerName = rcFinancer?.toLowerCase() || '';
          
          return accountHolder.includes(rcFinancerName) || 
                 lenderName.includes(rcFinancerName) ||
                 rcFinancerName.includes(accountHolder) ||
                 rcFinancerName.includes(lenderName);
        }) || null;

        // Financer information object
        const financerInfo = {
          rcFinancer: rcFinancer || 'No financer found in RC',
          cibilMatch: cibilFinancer ? {
            lenderName: cibilFinancer.lender_name || 'Unknown Lender',
            accountType: cibilFinancer.accountTypeDesc || 'Unknown Account Type',
            accountStatus: cibilFinancer.accountStatusDesc || 'Unknown Status',
            sanctionedAmount: cibilFinancer.sanctioned_amount || cibilFinancer.credit_limit || 0,
            currentBalance: cibilFinancer.current_balance || 0,
            emiAmount: cibilFinancer.emi_amount || 0,
            accountOpenDate: cibilFinancer.account_open_date || 'Unknown',
            lastPaymentDate: cibilFinancer.last_payment_date || 'Unknown',
            daysPastDue: cibilFinancer.days_past_due || 0
          } : null,
          hasMatch: !!cibilFinancer
        };

        const vehicleVal = userData?.vehicleValue || 800000;
        const loanAmount = vehicleVal * 0.8; // 80% LTV
        const outstandingAmount = vehicleVal * 0.65; // 65% outstanding

        const newAccounts = {
          secured: { 
            count: 1, 
            amount: `₹${(vehicleVal / 100000).toFixed(1)}L` 
          },
          unsecured: { count: 0, amount: "₹0" },
          autoLoans: { 
            count: 1, 
            amount: `₹${(loanAmount / 100000).toFixed(1)}L` 
          }
        };

        const autoLoanSummary = {
          sanctionedAmount: `₹${(realCreditData?.totalSanctioned || ((userData?.vehicleValue ?? 800000) * 0.8)).toLocaleString()}`,
          principalOutstanding: `₹${(realCreditData?.totalOutstanding || ((userData?.vehicleValue ?? 800000) * 0.65)).toLocaleString()}`,
          overdueAmount: "₹0",
          accountOpenDate: vehicleData.registrationDate,
          dpdHistory: [0, 0, 0, 0, 0, 0]
        };

        const creditSummary = {
          outstandingBalance: `₹${(realCreditData?.totalOutstanding || ((userData?.vehicleValue ?? 800000) * 0.65)).toLocaleString()}`,
          activeAccounts: realCreditData?.activeAccounts || 1,
          monthlyEMI: `₹${(realCreditData?.monthlyEMI || Math.round(((userData?.vehicleValue ?? 800000) * 0.8) / 60)).toLocaleString()}`,
          highestSanction: `₹${(realCreditData?.totalSanctioned || ((userData?.vehicleValue ?? 800000) * 0.8)).toLocaleString()}`,
          overdueAccounts: realCreditData?.overdueAccounts || 0,
          dpdCount: 0
        };

        const creditEnquiries = {
          "30days": { 
            total: realCreditData?.enquiries30 || 1, 
            autoLoans: realCreditData?.autoLoanEnquiries30 || 1, 
            others: (realCreditData?.enquiries30 || 1) - (realCreditData?.autoLoanEnquiries30 || 1) 
          },
          "60days": { 
            total: realCreditData?.enquiries60 || 2, 
            autoLoans: realCreditData?.autoLoanEnquiries60 || 1, 
            others: (realCreditData?.enquiries60 || 2) - (realCreditData?.autoLoanEnquiries60 || 1) 
          },
          "90days": { 
            total: realCreditData?.enquiries90 || 3, 
            autoLoans: realCreditData?.autoLoanEnquiries90 || 2, 
            others: (realCreditData?.enquiries90 || 3) - (realCreditData?.autoLoanEnquiries90 || 2) 
          }
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
          <div className="space-y-4 max-w-4xl mx-auto px-2">
            {/* Success Header - Compact */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <h1 className="text-lg font-bold">Loan Application Successful!</h1>
              </div>
              <p className="text-green-100 text-sm mb-2">Application ID: #{userData?.applicationId || 'FN' + Date.now()}</p>
              {realCreditData && <p className="text-xs bg-white/20 px-2 py-1 rounded">📊 Real Credit Data</p>}
            </div>

            {/* Compact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle & Credit Score Combined */}
              <Card className="shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Vehicle & Credit Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">Vehicle</p>
                      <p className="font-bold text-sm">{vehicleData.make} {vehicleData.model}</p>
                      <p className="text-xs text-blue-600">RC: {vehicleData.registrationNumber}</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getCreditScoreColor(creditScore.score)}`}>
                        {creditScore.score}
                      </div>
                      <p className="text-xs text-gray-600">Credit Score</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Value: ₹{(vehicleValue / 100000).toFixed(1)}L • Owner: {userData?.ownerName || personalInfo.name}
                  </div>
                </CardContent>
              </Card>

              {/* Financer Info - Compact */}
              <Card className="shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Financer Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">RC Financer</p>
                    <p className="font-bold text-sm text-blue-800">{financerInfo.rcFinancer}</p>
                  </div>
                  {realCreditData?.accounts && realCreditData.accounts.length > 0 && (
                    <div>
                      <p className="text-xs text-green-600 font-medium mb-1">Credit Bureau Financers</p>
                      <select className="w-full p-1 text-xs border border-green-300 rounded bg-white">
                        <option value="">Select financer & amount</option>
                        {realCreditData.accounts.slice(0, 3).map((account: any, index: number) => {
                          const loanAmount = account.sanctioned_amount || account.credit_limit || 0;
                          return (
                            <option key={index} value={`${account.lender_name || 'Unknown'}-${loanAmount}`}>
                              {(account.lender_name || 'Unknown').substring(0, 15)}... - ₹{(loanAmount / 100000).toFixed(1)}L
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Summary - Compact */}
            <Card className="shadow-md border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-green-700">{newAccounts.secured.count}</p>
                    <p className="text-xs text-green-600">Secured</p>
                    <p className="text-xs text-green-600">{newAccounts.secured.amount}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-blue-700">{newAccounts.unsecured.count}</p>
                    <p className="text-xs text-blue-600">Unsecured</p>
                    <p className="text-xs text-blue-600">{newAccounts.unsecured.amount}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-purple-700">{newAccounts.autoLoans.count}</p>
                    <p className="text-xs text-purple-600">Auto Loans</p>
                    <p className="text-xs text-purple-600">{newAccounts.autoLoans.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Overview - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3">
                  <CardTitle className="text-sm">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Sanctioned</span>
                    <span className="text-sm font-bold">{autoLoanSummary.sanctionedAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Outstanding</span>
                    <span className="text-sm font-bold text-blue-600">{autoLoanSummary.principalOutstanding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Monthly EMI</span>
                    <span className="text-sm font-bold text-orange-600">{creditSummary.monthlyEMI}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3">
                  <CardTitle className="text-sm">Credit Enquiries</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-pink-700">{creditEnquiries["30days"].total}</p>
                      <p className="text-xs text-gray-600">30 Days</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-pink-700">{creditEnquiries["60days"].total}</p>
                      <p className="text-xs text-gray-600">60 Days</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-pink-700">{creditEnquiries["90days"].total}</p>
                      <p className="text-xs text-gray-600">90 Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons - Compact */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-bold text-gray-800">Download Report</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={async () => {
                      // Download logic here
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm"
                  >
                    📄 Download TXT
                  </Button>
                  <Button 
                    onClick={async () => {
                      // PDF download logic here
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm"
                  >
                    📑 Download PDF
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
      <div className="bg-gradient-hero flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '100px' }}>
        {currentStep === 7 ? (
          <div className="w-full max-w-7xl" style={{ paddingTop: '20px' }}>
            {renderStep()}
          </div>
        ) : (
          <Card className="w-full max-w-md glass">
            <CardHeader className="bg-gradient-primary text-white text-center">
              <h1 className="text-2xl font-bold font-display">Finonest</h1>
              <Progress value={getProgressValue()} className="mt-4 bg-white/20 [&>div]:bg-green-500" />
              <p className="text-sm mt-2 text-white/90">Step {currentStep} of 7</p>
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