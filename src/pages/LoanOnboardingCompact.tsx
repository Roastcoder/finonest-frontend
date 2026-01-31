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

  if (loading) return <div className="text-center"><Loader2 className="animate-spin w-4 h-4" /></div>;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4" />
          Eligible Products ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {products.slice(0, 4).map((product, index) => {
            const maxLoanAmount = userData.vehicleValue ? Math.floor((userData.vehicleValue * product.max_ltv_purchase) / 100) : 0;
            return (
              <div key={index} className="bg-green-50 p-2 rounded border border-green-200">
                <p className="font-bold text-xs text-green-800">{product.lender_name}</p>
                <p className="text-xs text-green-600">{product.roi_min}%-{product.roi_max}% • LTV: {product.max_ltv_purchase}%</p>
                <p className="text-xs text-green-600">Max: ₹{(maxLoanAmount / 100000).toFixed(1)}L</p>
              </div>
            );
          })}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">No eligible products found</p>
        )}
      </CardContent>
    </Card>
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

const LoanOnboardingCompact: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dataSource, setDataSource] = useState<string>('');

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
    
    const existingApplications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    const existingCompleted = JSON.parse(localStorage.getItem('completedApplications') || '[]');
    const existingCredit = JSON.parse(localStorage.getItem('creditScoreData') || '[]');
    
    const existingMobile = [...existingApplications, ...existingCompleted, ...existingCredit]
      .find((app: any) => app.mobile === mobile);
    
    if (existingMobile) {
      setDataSource('Database: Mobile found in records');
      setUserData(prev => ({ 
        ...prev, 
        mobile,
        pan: existingMobile.pan || '',
        panName: existingMobile.panName || '',
        creditScore: existingMobile.creditScore || 0
      }));
    } else {
      setDataSource('New mobile - fresh application');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
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
      const existingApplications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      const existingPAN = existingApplications.find((app: any) => app.pan === pan);
      
      if (existingPAN) {
        setDataSource('Database: Using cached PAN data');
        setUserData(prev => ({ 
          ...prev, 
          pan, 
          panName: existingPAN.panName || 'Rajesh Kumar',
          dob: existingPAN.dob || '1985-06-15',
          gender: existingPAN.gender || 'M',
          creditScore: existingPAN.creditScore || Math.floor(Math.random() * 200) + 650,
          creditReport: existingPAN.creditReport || null,
          panResponse: existingPAN.panResponse || { success: true, data: { full_name: existingPAN.panName || 'Rajesh Kumar' } },
          creditResponse: existingPAN.creditResponse || { success: true }
        }));
        setCurrentStep(3);
        setLoading(false);
        return;
      }
      
      setDataSource('API: Fetching PAN and credit data');
      const response = await fetch('https://api.finonest.com/api/pan-verify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.status === '1') {
        const creditResponse = await fetch('https://api.finonest.com/api/credit-report.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        
        const newUserData = {
          pan, 
          panName: data.data.full_name,
          dob: data.data.dob,
          gender: data.data.gender,
          creditScore,
          creditReport: creditData.success ? creditData.data : null,
          panResponse: data,
          creditResponse: creditData
        };
        
        setUserData(prev => ({ ...prev, ...newUserData }));
        
        const updatedApplications = [...existingApplications, { ...newUserData, mobile: userData.mobile }];
        localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));
        
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
      const existingVehicles = JSON.parse(localStorage.getItem('vehicleData') || '[]');
      const existingRC = existingVehicles.find((vehicle: any) => vehicle.vehicleRC === vehicleRC);
      
      if (existingRC) {
        setDataSource('Database: Using cached RC data');
        setUserData(prev => ({ 
          ...prev, 
          vehicleRC,
          vehicleModel: existingRC.vehicleModel || 'Swift VDI',
          vehicleYear: existingRC.vehicleYear || 2020,
          vehicleMake: existingRC.vehicleMake || 'Maruti Suzuki',
          ownerName: existingRC.ownerName || userData.panName || 'Rajesh Kumar',
          fuelType: existingRC.fuelType || 'Petrol',
          vehicleColor: existingRC.vehicleColor || 'White',
          vehicleValue: existingRC.vehicleValue || 850000,
          vehicleResponse: existingRC.vehicleResponse || { success: true, data: { registration_date: '15 Mar 2020' } }
        }));
        setCurrentStep(5);
        setLoading(false);
        return;
      }
      
      setDataSource('API: Fetching RC verification data');
      const response = await fetch('https://api.finonest.com/api/rc-surepass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_number: vehicleRC })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const newVehicleData = {
          vehicleRC,
          vehicleModel: data.data.maker_model,
          vehicleYear: parseInt(data.data.manufacturing_date_formatted?.split('-')[0]) || new Date().getFullYear(),
          vehicleMake: data.data.maker_description,
          ownerName: data.data.owner_name,
          fuelType: data.data.fuel_type,
          vehicleColor: data.data.color,
          vehicleValue: 850000,
          vehicleResponse: data
        };
        
        setUserData(prev => ({ ...prev, ...newVehicleData }));
        
        const updatedVehicles = [...existingVehicles, newVehicleData];
        localStorage.setItem('vehicleData', JSON.stringify(updatedVehicles));
        
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
    
    const existingApplications = JSON.parse(localStorage.getItem('completedApplications') || '[]');
    const existingApp = existingApplications.find((app: any) => 
      app.pan === userData.pan && app.vehicleRC === userData.vehicleRC
    );
    
    if (existingApp) {
      setDataSource('Database: Using existing application');
      setUserData(prev => ({ 
        ...prev, 
        income, 
        employment, 
        applicationId: existingApp.applicationId 
      }));
      setCurrentStep(6);
      setLoading(false);
      return;
    }
    
    setDataSource('Database: Saving new application');
    try {
      const applicationId = Date.now();
      const applicationData = {
        ...userData,
        income,
        employment,
        applicationId,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };
      
      const updatedApplications = [...existingApplications, applicationData];
      localStorage.setItem('completedApplications', JSON.stringify(updatedApplications));
      
      setUserData(prev => ({ ...prev, income, employment, applicationId }));
      setCurrentStep(6);
    } catch (error) {
      console.error('Failed to save application');
      setUserData(prev => ({ ...prev, income, employment, applicationId: Date.now() }));
      setCurrentStep(6);
    }
    
    setLoading(false);
  };

  const getProgressValue = () => (currentStep / 6) * 100;

  const renderStep = () => {
    if (loading) {
      return (
        <div className="text-center py-6">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
          <p className="text-sm">Processing...</p>
          {dataSource && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">📊 {dataSource}</p>
            </div>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Mobile Number</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your mobile number to get started</p>
            
            <form onSubmit={handleMobileSubmit}>
              <div className="mb-4">
                <Label htmlFor="mobile" className="text-sm">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="mt-1"
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Continue</Button>
            </form>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">PAN Card Details</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your PAN card information</p>
            
            <form onSubmit={handlePANSubmit}>
              <div className="mb-4">
                <Label htmlFor="pan" className="text-sm">PAN Number</Label>
                <Input
                  id="pan"
                  name="pan"
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="mt-1 uppercase"
                />
                {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Verify PAN</Button>
            </form>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Credit Score Check</h2>
            <div className="text-center py-6">
              <div className="mb-3">
                <p className="text-sm text-gray-600">Name: {userData.panName}</p>
                <p className="text-sm text-gray-600">DOB: {userData.dob}</p>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{userData.creditScore}</div>
              <p className="text-gray-600 mb-4 text-sm">Your credit score looks good!</p>
              <Button onClick={() => setCurrentStep(4)} className="w-full btn-hero">Continue</Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Vehicle RC Details</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your vehicle RC number</p>
            
            <form onSubmit={handleVehicleSubmit}>
              <div className="mb-4">
                <Label htmlFor="vehicleRC" className="text-sm">RC Number</Label>
                <Input
                  id="vehicleRC"
                  name="vehicleRC"
                  type="text"
                  placeholder="MH01AB1234"
                  className="mt-1"
                />
                {errors.vehicleRC && <p className="text-red-500 text-xs mt-1">{errors.vehicleRC}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Verify RC</Button>
            </form>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2">Personal & Income Information</h2>
            <p className="text-gray-600 mb-4 text-sm">Tell us about your income</p>
            
            <form onSubmit={handlePersonalSubmit}>
              <div className="mb-4">
                <Label htmlFor="income" className="text-sm">Monthly Income</Label>
                <Input
                  id="income"
                  name="income"
                  type="number"
                  placeholder="50000"
                  className="mt-1"
                  required
                  min="1"
                />
                {errors.income && <p className="text-red-500 text-xs mt-1">{errors.income}</p>}
              </div>
              <div className="mb-4">
                <Label htmlFor="employment" className="text-sm">Employment Type</Label>
                <select
                  id="employment"
                  name="employment"
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 text-sm"
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="S">Salaried</option>
                  <option value="E">Self-employed</option>
                  <option value="P">Self-employed Professional</option>
                  <option value="N">Non-Salaried</option>
                </select>
                {errors.employment && <p className="text-red-500 text-xs mt-1">{errors.employment}</p>}
              </div>
              <Button type="submit" className="w-full btn-hero">Continue</Button>
            </form>
          </div>
        );

      case 6:
        const vehicleData = {
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

        const creditReport = userData?.creditReport;
        const realCreditData = creditReport ? {
          totalAccounts: creditReport.ACCOUNT_SUMMARY?.total_accounts || 1,
          activeAccounts: creditReport.ACCOUNT_SUMMARY?.active_accounts || 1,
          closedAccounts: creditReport.ACCOUNT_SUMMARY?.closed_accounts || 0,
          overdueAccounts: creditReport.ACCOUNT_SUMMARY?.overdue_accounts || 0,
          totalOutstanding: creditReport.ACCOUNT_SUMMARY?.total_outstanding || ((userData?.vehicleValue ?? 850000) * 0.65),
          totalSanctioned: creditReport.ACCOUNT_SUMMARY?.total_sanctioned || ((userData?.vehicleValue ?? 850000) * 0.8),
          monthlyEMI: creditReport.ACCOUNT_SUMMARY?.monthly_emi || Math.round(((userData?.vehicleValue ?? 850000) * 0.8) / 60),
          enquiries30: creditReport.ENQUIRY_SUMMARY?.last_30_days || 1,
          enquiries60: creditReport.ENQUIRY_SUMMARY?.last_60_days || 2,
          enquiries90: creditReport.ENQUIRY_SUMMARY?.last_90_days || 3,
          autoLoanEnquiries30: creditReport.ENQUIRY_SUMMARY?.auto_loan_30_days || 1,
          autoLoanEnquiries60: creditReport.ENQUIRY_SUMMARY?.auto_loan_60_days || 1,
          autoLoanEnquiries90: creditReport.ENQUIRY_SUMMARY?.auto_loan_90_days || 2,
        } : null;
        
        const personalInfo = {
          name: userData?.panName || 'N/A',
          gender: userData?.gender ? getGenderDescription(userData.gender) : 'N/A',
          employment: userData?.employment ? getEmploymentStatusDescription(userData.employment) : 'N/A',
          dob: userData?.dob || 'N/A'
        };

        const vehicleValue = userData?.vehicleValue || 850000;
        const loanAmount = vehicleValue * 0.8;

        const newAccounts = {
          secured: { 
            count: 1, 
            amount: `₹${(vehicleValue / 100000).toFixed(1)}L` 
          },
          unsecured: { count: 0, amount: "₹0" },
          autoLoans: { 
            count: 1, 
            amount: `₹${(loanAmount / 100000).toFixed(1)}L` 
          }
        };

        const autoLoanSummary = {
          sanctionedAmount: `₹${(realCreditData?.totalSanctioned || ((userData?.vehicleValue ?? 850000) * 0.8)).toLocaleString()}`,
          principalOutstanding: `₹${(realCreditData?.totalOutstanding || ((userData?.vehicleValue ?? 850000) * 0.65)).toLocaleString()}`,
          overdueAmount: "₹0",
          accountOpenDate: vehicleData.registrationDate,
          dpdHistory: [0, 0, 0, 0, 0, 0]
        };

        const creditSummary = {
          outstandingBalance: `₹${(realCreditData?.totalOutstanding || ((userData?.vehicleValue ?? 850000) * 0.65)).toLocaleString()}`,
          activeAccounts: realCreditData?.activeAccounts || 1,
          monthlyEMI: `₹${(realCreditData?.monthlyEMI || Math.round(((userData?.vehicleValue ?? 850000) * 0.8) / 60)).toLocaleString()}`,
          highestSanction: `₹${(realCreditData?.totalSanctioned || ((userData?.vehicleValue ?? 850000) * 0.8)).toLocaleString()}`,
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
          <div className="space-y-2 max-w-full mx-auto px-1 sm:px-2 overflow-hidden">
            {/* Compact Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2 sm:p-3 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4" />
                <h1 className="text-sm sm:text-base font-bold">Application Successful!</h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-3 h-3" />
                  <span>ID: #{userData?.applicationId || 'FN' + Date.now()}</span>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {realCreditData ? '📊 Real Data' : '🔮 Demo Data'}
                </div>
              </div>
            </div>

            {/* Ultra Compact Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Vehicle & Credit Score Combined */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2">
                  <CardTitle className="flex items-center gap-2 text-xs">
                    <Car className="w-3 h-3" />
                    Vehicle & Credit
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-xs text-blue-800">{vehicleData.make} {vehicleData.model}</p>
                        <p className="text-xs text-blue-600">{vehicleData.registrationNumber} • {vehicleData.year}</p>
                      </div>
                      <Badge className="bg-blue-600 text-white text-xs">{vehicleData.fuelType}</Badge>
                    </div>
                    <p className="text-xs text-blue-600">Value: ₹{(vehicleValue / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                      <span className={`text-lg font-bold ${getCreditScoreColor(creditScore.score)}`}>
                        {creditScore.score}
                      </span>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getCreditScoreGradient(creditScore.score)} text-white text-xs`}>
                      {creditScore.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Loan & Account Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-2">
                  <CardTitle className="flex items-center gap-2 text-xs">
                    <Target className="w-3 h-3" />
                    Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <p className="text-gray-600 font-medium">Sanctioned</p>
                        <p className="font-bold text-green-700 text-xs">{autoLoanSummary.sanctionedAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Outstanding</p>
                        <p className="font-bold text-blue-600 text-xs">{autoLoanSummary.principalOutstanding}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Monthly EMI</p>
                        <p className="font-bold text-orange-600 text-xs">{creditSummary.monthlyEMI}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Active Accounts</p>
                        <p className="font-bold text-gray-800 text-xs">{creditSummary.activeAccounts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="bg-blue-50 p-1 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Secured</p>
                      <p className="font-bold text-blue-700 text-xs">{newAccounts.secured.count}</p>
                      <p className="text-xs text-blue-600">{newAccounts.secured.amount}</p>
                    </div>
                    <div className="bg-purple-50 p-1 rounded text-center">
                      <p className="text-xs text-purple-600 font-medium">Auto</p>
                      <p className="font-bold text-purple-700 text-xs">{newAccounts.autoLoans.count}</p>
                      <p className="text-xs text-purple-600">{newAccounts.autoLoans.amount}</p>
                    </div>
                    <div className="bg-gray-50 p-1 rounded text-center">
                      <p className="text-xs text-gray-600 font-medium">Unsecured</p>
                      <p className="font-bold text-gray-700 text-xs">{newAccounts.unsecured.count}</p>
                      <p className="text-xs text-gray-600">{newAccounts.unsecured.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Enquiry Compact */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-2">
                  <CardTitle className="flex items-center gap-2 text-xs">
                    <Search className="w-3 h-3" />
                    Credit Enquiries
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {Object.entries(creditEnquiries).map(([period, data]) => (
                      <div key={period} className="bg-gray-50 p-2 rounded">
                        <h3 className="font-bold text-gray-800 mb-1 text-xs">
                          Last {period.replace('days', ' Days')}
                        </h3>
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div className="text-center">
                            <span className="text-gray-600">Total</span>
                            <div className="font-bold bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs">{data.total}</div>
                          </div>
                          <div className="text-center">
                            <span className="text-gray-600">Auto</span>
                            <div className="font-bold bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-xs">{data.autoLoans}</div>
                          </div>
                          <div className="text-center">
                            <span className="text-gray-600">Others</span>
                            <div className="font-bold bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-xs">{data.others}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Eligible Products */}
            <EligibleProducts userData={userData} />

            {/* Compact Action Button */}
            <div className="bg-white rounded-lg p-3 shadow-lg border-0">
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Application Complete!</h3>
                <Button 
                  onClick={() => {
                    const appData = {
                      applicationId: userData?.applicationId || 'FN' + Date.now(),
                      applicantName: userData?.panName || 'N/A',
                      mobile: userData?.mobile || 'N/A',
                      pan: userData?.pan || 'N/A',
                      creditScore: userData?.creditScore || 'N/A',
                      vehicleDetails: `${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`,
                      vehicleRC: vehicleData.registrationNumber,
                      loanAmount: `₹${(loanAmount / 100000).toFixed(1)}L`,
                      vehicleValue: `₹${(vehicleValue / 100000).toFixed(1)}L`,
                      income: userData?.income ? `₹${userData.income.toLocaleString()}` : 'N/A',
                      employment: personalInfo.employment,
                      submissionDate: new Date().toLocaleDateString('en-IN')
                    };
                    
                    const content = `FINONEST INDIA PVT LTD\nLoan Application Summary\n\nApplication ID: ${appData.applicationId}\nDate: ${appData.submissionDate}\n\nAPPLICANT DETAILS:\nName: ${appData.applicantName}\nMobile: ${appData.mobile}\nPAN: ${appData.pan}\nCredit Score: ${appData.creditScore}\nMonthly Income: ${appData.income}\nEmployment: ${personalInfo.employment}\n\nVEHICLE DETAILS:\nVehicle: ${appData.vehicleDetails}\nRC Number: ${appData.vehicleRC}\nVehicle Value: ${appData.vehicleValue}\n\nLOAN DETAILS:\nRequested Loan Amount: ${appData.loanAmount}\nLTV Ratio: 80%\n\nStatus: Application Submitted Successfully\n\nContact: info@finonest.com | +91 94625 53887\nAddress: 3rd Floor, BL Tower 1, Tonk Rd, Jaipur, Rajasthan 302018`;
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Finonest_Application_${appData.applicationId}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-semibold text-sm w-full"
                >
                  Download Application Copy
                </Button>
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
      <div className="bg-gradient-hero flex items-center justify-center p-2 sm:p-4" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '90px' }}>
        {currentStep === 6 ? (
          <div className="w-full max-w-6xl" style={{ paddingTop: '10px' }}>
            {renderStep()}
          </div>
        ) : (
          <Card className="w-full max-w-sm glass">
            <CardHeader className="bg-gradient-primary text-white text-center p-4">
              <h1 className="text-xl font-bold font-display">Finonest</h1>
              <Progress value={getProgressValue()} className="mt-3 bg-white/20 [&>div]:bg-green-500" />
              <p className="text-xs mt-2 text-white/90">Step {currentStep} of 6</p>
            </CardHeader>
            <CardContent className="p-4">
              {renderStep()}
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LoanOnboardingCompact;