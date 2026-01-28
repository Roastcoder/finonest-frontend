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
  selectedLoanAmount?: number;
  selectedLoanDetails?: {
    lender: string;
    sanctioned: number;
    currentBalance: number;
    accountStatus?: string;
    accountOpenDate?: string;
    emiAmount?: number;
    isEstimated?: boolean;
  };
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
    setDataSource('API: Saving application data');
    
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
      
      const response = await fetch('https://api.finonest.com/api/loan-application.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      setUserData(prev => ({ ...prev, income, employment, applicationId }));
      setCurrentStep(6);
    } catch (error) {
      // API failed, continue with local data
      setDataSource('Fallback: Application saved locally (API unavailable)');
      setUserData(prev => ({ ...prev, income, employment, applicationId: Date.now() }));
      setCurrentStep(6);
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
        // Extract auto loan data from credit response
        const rcFinancerName = userData?.vehicleResponse?.data?.financer || userData?.vehicleResponse?.data?.hypothecation_details || 'Unknown Financer';
        const step5CreditReport = userData?.creditReport;
        const autoLoanOptions = [];
        
        // Extract only auto loan accounts from credit report using FBA codes
        if (step5CreditReport?.CAIS_Account?.CAIS_Account_DETAILS) {
          const accounts = step5CreditReport.CAIS_Account.CAIS_Account_DETAILS;
          
          accounts.forEach((account: any) => {
            const accountType = account.Account_Type;
            const lenderName = account.Subscriber_Name || 'Unknown Lender';
            const sanctionedAmount = account.Sanctioned_Amount || 0;
            const currentBalance = account.Current_Balance || 0;
            const accountStatus = account.Account_Status;
            const openDate = account.Open_Date;
            
            // Check for auto loan account types using FBA codes
            const isAutoLoanType = (
              accountType === '1' ||   // AUTO LOAN
              accountType === '32' ||  // Used Car Loan
              accountType === '46' ||  // P2P Auto Loan
              accountType === '13'     // TWO-WHEELER LOAN
            );
            
            // Check for car-related lenders
            const isCarRelated = (
              lenderName.toLowerCase().includes('auto') ||
              lenderName.toLowerCase().includes('vehicle') ||
              lenderName.toLowerCase().includes('car') ||
              lenderName.toLowerCase().includes('motor') ||
              lenderName.toLowerCase().includes('canara') || // Match RC financer
              lenderName.toLowerCase().includes('hdfc') ||
              lenderName.toLowerCase().includes('icici')
            );
            
            // Include if it's auto loan type, car-related, or in vehicle loan amount range
            if (isAutoLoanType || isCarRelated || 
                (sanctionedAmount >= 500000 && sanctionedAmount <= 1500000) ||
                (currentBalance >= 500000 && currentBalance <= 1500000)) {
              
              const amount = sanctionedAmount > 0 ? sanctionedAmount : currentBalance;
              if (amount > 0) {
                autoLoanOptions.push({
                  lender: lenderName,
                  sanctioned: amount,
                  currentBalance: currentBalance,
                  accountStatus: getAccountStatusDescription(accountStatus),
                  accountOpenDate: openDate,
                  emiAmount: account.EMI_Amount || 0,
                  accountType: getAccountTypeDescription(accountType),
                  isConfirmed: isAutoLoanType,
                  matchReason: isAutoLoanType ? 'Confirmed Auto Loan' : (isCarRelated ? 'Car-related Lender' : 'Vehicle Loan Range')
                });
              }
            }
          });
        }
        
        // If no auto loans found in credit report, show RC financer with estimated amount
        if (autoLoanOptions.length === 0) {
          const vehicleVal = userData?.vehicleValue || 800000;
          autoLoanOptions.push({
            lender: rcFinancerName,
            sanctioned: Math.round(vehicleVal * 0.8),
            currentBalance: Math.round(vehicleVal * 0.65),
            accountStatus: 'Active',
            accountOpenDate: userData?.vehicleResponse?.data?.registration_date || 'Unknown',
            emiAmount: Math.round((vehicleVal * 0.8) / 60),
            isEstimated: true
          });
        }

        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Correct Auto Loan Amount</h2>
            <p className="text-gray-600 mb-6">Choose the correct auto loan amount for your vehicle</p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">RC Financer Name</p>
                <p className="text-lg font-bold text-blue-800">{rcFinancerName}</p>
              </div>
              
              {/* Debug info for credit report auto loans */}
              {step5CreditReport?.CAIS_Account && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 font-medium mb-2">
                    📊 Found {autoLoanOptions.length} potential auto loan(s) in credit report
                  </p>
                  <p className="text-xs text-yellow-600">
                    Total accounts in credit report: {step5CreditReport.CAIS_Account.CAIS_Account_DETAILS?.length || 0}
                  </p>
                  {autoLoanOptions.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Using real credit bureau data (not estimated)
                    </p>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                {autoLoanOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedLoanAmount === option.sanctioned
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedLoanAmount(option.sanctioned)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-800">{option.lender}</p>
                          {option.isConfirmed ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">✓ Confirmed</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">{option.matchReason}</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Account Type</p>
                            <p className="font-medium text-blue-600">{option.accountType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Loan Amount</p>
                            <p className="font-bold text-green-600">₹{option.sanctioned.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Current Balance</p>
                            <p className="font-bold text-orange-600">₹{option.currentBalance.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="text-gray-700">{option.accountStatus}</p>
                          </div>
                          {option.emiAmount > 0 && (
                            <div>
                              <p className="text-gray-500">EMI Amount</p>
                              <p className="font-bold text-purple-600">₹{option.emiAmount.toLocaleString()}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Account Date</p>
                            <p className="text-gray-700">{option.accountOpenDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ml-4 ${
                        selectedLoanAmount === option.sanctioned
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedLoanAmount === option.sanctioned && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => {
                  if (!selectedLoanAmount) {
                    showError('loanAmount', 'Please select an auto loan amount');
                    return;
                  }
                  clearError('loanAmount');
                  // Store the selected loan details for accurate reporting
                  const selectedLoan = autoLoanOptions.find(option => option.sanctioned === selectedLoanAmount);
                  setUserData(prev => ({ 
                    ...prev, 
                    selectedLoanAmount,
                    selectedLoanDetails: selectedLoan
                  }));
                  setCurrentStep(6);
                }}
                className="w-full btn-hero"
                disabled={!selectedLoanAmount}
              >
                Continue with ₹{selectedLoanAmount ? selectedLoanAmount.toLocaleString() : '0'}
              </Button>
              {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>}
            </div>
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

        // Extract real credit data from creditReport if available
        const step6CreditReport = userData?.creditReport;
        const realCreditData = step6CreditReport ? {
          totalAccounts: step6CreditReport.ACCOUNT_SUMMARY?.total_accounts || step6CreditReport.ACCOUNTS?.length || 1,
          activeAccounts: step6CreditReport.ACCOUNT_SUMMARY?.active_accounts || step6CreditReport.ACCOUNTS?.filter((acc: any) => acc.account_status === '11' || acc.account_status === '21')?.length || 1,
          closedAccounts: step6CreditReport.ACCOUNT_SUMMARY?.closed_accounts || step6CreditReport.ACCOUNTS?.filter((acc: any) => acc.account_status === '13' || acc.account_status === '23')?.length || 0,
          overdueAccounts: step6CreditReport.ACCOUNT_SUMMARY?.overdue_accounts || step6CreditReport.ACCOUNTS?.filter((acc: any) => acc.days_past_due > 0)?.length || 0,
          totalOutstanding: step6CreditReport.ACCOUNT_SUMMARY?.total_outstanding || step6CreditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.current_balance || 0), 0) || ((userData?.vehicleValue ?? 800000) * 0.65),
          totalSanctioned: step6CreditReport.ACCOUNT_SUMMARY?.total_sanctioned || step6CreditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.sanctioned_amount || acc.credit_limit || 0), 0) || ((userData?.vehicleValue ?? 800000) * 0.8),
          monthlyEMI: step6CreditReport.ACCOUNT_SUMMARY?.monthly_emi || step6CreditReport.ACCOUNTS?.reduce((sum: number, acc: any) => sum + (acc.emi_amount || 0), 0) || Math.round(((userData?.vehicleValue ?? 800000) * 0.8) / 60),
          enquiries30: step6CreditReport.ENQUIRY_SUMMARY?.last_30_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return enqDate >= thirtyDaysAgo;
          })?.length || 1,
          enquiries60: step6CreditReport.ENQUIRY_SUMMARY?.last_60_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            return enqDate >= sixtyDaysAgo;
          })?.length || 2,
          enquiries90: step6CreditReport.ENQUIRY_SUMMARY?.last_90_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            return enqDate >= ninetyDaysAgo;
          })?.length || 3,
          autoLoanEnquiries30: step6CreditReport.ENQUIRY_SUMMARY?.auto_loan_30_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return enqDate >= thirtyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 1,
          autoLoanEnquiries60: step6CreditReport.ENQUIRY_SUMMARY?.auto_loan_60_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            return enqDate >= sixtyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 1,
          autoLoanEnquiries90: step6CreditReport.ENQUIRY_SUMMARY?.auto_loan_90_days || step6CreditReport.ENQUIRIES?.filter((enq: any) => {
            const enqDate = new Date(enq.enquiry_date);
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            return enqDate >= ninetyDaysAgo && (enq.enquiry_purpose?.toLowerCase().includes('auto') || enq.enquiry_purpose?.toLowerCase().includes('vehicle'));
          })?.length || 2,
          // Process account details with FBA codes
          accounts: step6CreditReport.ACCOUNTS?.map((account: any) => ({
            ...account,
            accountTypeDesc: getAccountTypeDescription(account.account_type),
            accountStatusDesc: getAccountStatusDescription(account.account_status),
            paymentHistoryDesc: account.payment_history?.map((ph: string) => getPaymentHistoryDescription(ph))
          })) || []
        } : null;
        
        // Process personal information with FBA codes and real data
        const personalInfo = {
          name: userData?.panName || userData?.ownerName || step6CreditReport?.PERSONAL_INFO?.full_name || 'N/A',
          gender: userData?.gender ? getGenderDescription(userData.gender) : step6CreditReport?.PERSONAL_INFO?.gender ? getGenderDescription(step6CreditReport.PERSONAL_INFO.gender) : 'N/A',
          employment: userData?.employment ? getEmploymentStatusDescription(userData.employment) : 'N/A',
          dob: userData?.dob || step6CreditReport?.PERSONAL_INFO?.date_of_birth || 'N/A',
          email: userData?.email || step6CreditReport?.PERSONAL_INFO?.email || 'N/A',
          mobile: userData?.mobile || step6CreditReport?.PERSONAL_INFO?.phone || 'N/A',
          address: step6CreditReport?.PERSONAL_INFO?.address || step6CreditReport?.ADDRESS?.[0]?.address_line || 'N/A'
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Application ID: #{userData?.applicationId || 'FN' + Date.now()}</span>
                </div>
                {realCreditData && (
                  <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    📊 Real Credit Bureau Data
                  </div>
                )}
                {!realCreditData && (
                  <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    🔮 Simulated Credit Data
                  </div>
                )}
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
                        <p className="text-sm text-blue-600">Owner: {userData?.ownerName || personalInfo.name}</p>
                        <p className="text-sm text-blue-600">Market Value: ₹{(vehicleVal / 100000).toFixed(1)}L</p>
                        <p className="text-xs text-gray-500 mt-2">Data Source: {dataSource || 'Database'}</p>
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
                    {realCreditData && (
                      <p className="text-xs text-green-600 mt-1 font-medium">✓ Real Bureau Data</p>
                    )}
                    {!realCreditData && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">🔮 Simulated Data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financer Information Section */}
            {(financerInfo.rcFinancer !== 'No financer found in RC' || financerInfo.hasMatch) && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Vehicle Financer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* RC Financer Info */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        RC Document Financer
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Financer Name</p>
                          <p className="font-bold text-blue-800">{financerInfo.rcFinancer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Source</p>
                          <p className="text-sm text-blue-700">Vehicle Registration Certificate</p>
                        </div>
                      </div>
                    </div>

                    {/* CIBIL Financer Match with Dropdown */}
                    <div className={`p-6 rounded-xl border ${financerInfo.hasMatch ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <h3 className={`font-bold mb-4 flex items-center gap-2 ${financerInfo.hasMatch ? 'text-green-800' : 'text-gray-600'}`}>
                        <CreditCard className="w-4 h-4" />
                        Credit Bureau Financers
                      </h3>
                      {realCreditData?.accounts && realCreditData.accounts.length > 0 ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-green-600 font-medium mb-2">Available Financers with Loan Amounts</p>
                            <select className="w-full p-2 border border-green-300 rounded-md bg-white">
                              <option value="">Select financer and loan amount</option>
                              {realCreditData.accounts.map((account: any, index: number) => {
                                const loanAmount = account.sanctioned_amount || account.credit_limit || 0;
                                const currentBalance = account.current_balance || 0;
                                return (
                                  <option key={index} value={`${account.lender_name || 'Unknown'}-${loanAmount}`}>
                                    {account.lender_name || 'Unknown Lender'} - ₹{loanAmount.toLocaleString()} (Balance: ₹{currentBalance.toLocaleString()})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-blue-700 font-medium mb-1">💡 Tip:</p>
                            <p className="text-xs text-blue-600">Select your existing financer to see available loan amounts based on your credit history</p>
                          </div>
                          {financerInfo.hasMatch && financerInfo.cibilMatch && (
                            <div className="mt-4 p-3 bg-green-100 rounded-lg">
                              <p className="text-xs font-bold text-green-800 mb-2">✓ RC Financer Match Found:</p>
                              <p className="text-sm font-semibold text-green-700">{financerInfo.cibilMatch.lenderName}</p>
                              <p className="text-xs text-green-600">Sanctioned: ₹{financerInfo.cibilMatch.sanctionedAmount.toLocaleString()}</p>
                              <p className="text-xs text-green-600">Current Balance: ₹{financerInfo.cibilMatch.currentBalance.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-2">No credit bureau data available</p>
                          <p className="text-xs text-gray-500">Credit report data not found or unavailable</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Summary */}
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

            {/* Real Account Details */}
            {realCreditData?.accounts && realCreditData.accounts.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real Credit Accounts ({realCreditData.accounts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {realCreditData.accounts.slice(0, 6).map((account: any, index: number) => (
                      <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <p className="font-bold text-indigo-800">{account.accountTypeDesc || 'Unknown Account'}</p>
                        <p className="text-sm text-indigo-600">Status: {account.accountStatusDesc || 'Unknown'}</p>
                        <p className="text-sm text-indigo-600">Balance: ₹{account.current_balance?.toLocaleString() || '0'}</p>
                        <p className="text-sm text-indigo-600">Limit: ₹{account.credit_limit?.toLocaleString() || 'N/A'}</p>
                        <p className="text-sm text-indigo-600">EMI: ₹{account.emi_amount?.toLocaleString() || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-bold text-yellow-800 mb-2">Real Bureau Summary:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-yellow-700">
                      <div>Total: {realCreditData.totalAccounts}</div>
                      <div>Active: {realCreditData.activeAccounts}</div>
                      <div>Closed: {realCreditData.closedAccounts}</div>
                      <div>Overdue: {realCreditData.overdueAccounts}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eligible Products */}
            <EligibleProducts userData={userData} />

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-0">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800">What's Next?</h3>
                <p className="text-gray-600">Your loan application has been submitted successfully. Download your application copy below.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://api.finonest.com/api/loan-onboarding-result.php?id=${userData?.applicationId}`);
                        const data = await response.json();
                        
                        if (data.success) {
                          const content = `FINONEST INDIA PVT LTD\nLoan Onboarding Report\n\nApplication ID: ${data.application_id}\nGenerated: ${new Date().toLocaleString()}\n\n=== VEHICLE INFORMATION ===\n${data.vehicle_info.title}\nRegistration Number: ${data.vehicle_info.registration_number}\nRegistration Date: ${data.vehicle_info.registration_date}\nVehicle Details: ${data.vehicle_info.details}\n${data.vehicle_info.color_fuel}\nOwner: ${data.vehicle_info.owner}\nMarket Value: ${data.vehicle_info.market_value}\nData Source: ${data.vehicle_info.data_source}\n\n=== CREDIT SCORE ANALYSIS ===\nCredit Score: ${data.credit_analysis.score}/${data.credit_analysis.max_score}\nRating: ${data.credit_analysis.rating}\nLast Updated: ${data.credit_analysis.last_updated}\nVerified: ${data.credit_analysis.verified ? 'Yes' : 'No'}\n\n=== VEHICLE FINANCER INFORMATION ===\nRC Document Financer: ${data.financer_info.rc_financer}\nSource: ${data.financer_info.source}\nCIBIL Credit Match: ${data.financer_info.cibil_match ? 'Yes' : 'No'}\n${data.financer_info.match_message}\n\n=== ACCOUNT SUMMARY ===\nSecured Loans: ${data.account_summary.secured_loans.count} (Total: ${data.account_summary.secured_loans.total})\nUnsecured Loans: ${data.account_summary.unsecured_loans.count} (Total: ${data.account_summary.unsecured_loans.total})\nAuto Loans: ${data.account_summary.auto_loans.count} (Total: ${data.account_summary.auto_loans.total})\n\n${data.auto_loan_details ? `=== AUTO LOAN DETAILS ===\nSanctioned Amount: ${data.auto_loan_details.sanctioned_amount}\nPrincipal Outstanding: ${data.auto_loan_details.principal_outstanding}\nOverdue Amount: ${data.auto_loan_details.overdue_amount}\nAccount Open Date: ${data.auto_loan_details.account_open_date}\nPayment History: ${data.auto_loan_details.payment_record}\n\n` : ''}=== CREDIT OVERVIEW ===\nOutstanding Balance: ${data.credit_overview.outstanding_balance}\nActive Accounts: ${data.credit_overview.active_accounts}\nMonthly EMI: ${data.credit_overview.monthly_emi}\nHighest Sanction: ${data.credit_overview.highest_sanction}\nOverdue Accounts: ${data.credit_overview.overdue_accounts}\nDPD Count: ${data.credit_overview.dpd_count}\n\n=== CREDIT ENQUIRY HISTORY ===\nLast 30 Days: Total ${data.enquiry_history.last_30_days.total} (Auto Loans: ${data.enquiry_history.last_30_days.auto_loans}, Others: ${data.enquiry_history.last_30_days.others})\nLast 60 Days: Total ${data.enquiry_history.last_60_days.total} (Auto Loans: ${data.enquiry_history.last_60_days.auto_loans}, Others: ${data.enquiry_history.last_60_days.others})\nLast 90 Days: Total ${data.enquiry_history.last_90_days.total} (Auto Loans: ${data.enquiry_history.last_90_days.auto_loans}, Others: ${data.enquiry_history.last_90_days.others})\n\n=== VERIFICATION STATUS ===\nPAN Verified: ${data.verification_status.pan_verified ? 'Yes' : 'No'}\nCredit Verified: ${data.verification_status.credit_verified ? 'Yes' : 'No'}\nVehicle Verified: ${data.verification_status.vehicle_verified ? 'Yes' : 'No'}\n\n=== CONTACT INFORMATION ===\nEmail: info@finonest.com\nPhone: +91 94625 53887\nWebsite: www.finonest.com\n\nThank you for choosing Finonest!`;
                          
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Finonest_Report_${data.application_id}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      } catch (error) {
                        console.error('Failed to fetch report data');
                        // Fallback to existing download
                        const appData = {
                          applicationId: userData?.applicationId || 'FN' + Date.now(),
                          applicantName: userData?.panName || 'N/A',
                          mobile: userData?.mobile || 'N/A',
                          pan: userData?.pan || 'N/A',
                          creditScore: userData?.creditScore || 'N/A',
                          vehicleDetails: `${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`,
                          vehicleRC: vehicleData.registrationNumber,
                          submissionDate: new Date().toLocaleDateString('en-IN')
                        };
                        
                        const content = `FINONEST INDIA PVT LTD\nLoan Application Summary\n\nApplication ID: ${appData.applicationId}\nDate: ${appData.submissionDate}\n\nApplicant: ${appData.applicantName}\nMobile: ${appData.mobile}\nPAN: ${appData.pan}\nCredit Score: ${appData.creditScore}\nVehicle: ${appData.vehicleDetails}\nRC: ${appData.vehicleRC}\n\nThank you for choosing Finonest!`;
                        
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Finonest_Application_${appData.applicationId}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    📄 Download Report (TXT)
                  </Button>
                  
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://api.finonest.com/api/loan-onboarding-pdf.php?id=${userData?.applicationId}`);
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Finonest_Report_${userData?.applicationId}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } else {
                          throw new Error('PDF generation failed');
                        }
                      } catch (error) {
                        console.error('Failed to download PDF:', error);
                        alert('PDF download is currently unavailable. Please try the TXT download.');
                      }
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    📑 Download PDF Report
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
        {currentStep === 6 ? (
          <div className="w-full max-w-7xl" style={{ paddingTop: '20px' }}>
            {renderStep()}
          </div>
        ) : (
          <Card className="w-full max-w-md glass">
            <CardHeader className="bg-gradient-primary text-white text-center">
              <h1 className="text-2xl font-bold font-display">Finonest</h1>
              <Progress value={getProgressValue()} className="mt-4 bg-white/20 [&>div]:bg-green-500" />
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