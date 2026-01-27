import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

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
        const response = await fetch('/api/policy-engine.php', {
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
      const response = await fetch('/api/pan-verify.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pan })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.status === '1') {
        // Get credit report with PAN data
        const creditResponse = await fetch('/api/credit-report.php', {
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
      const response = await fetch('/api/rc-surepass.php', {
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
        const valuationResponse = await fetch('/api/car-valuation.php', {
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
      const response = await fetch('/api/loan-application.php', {
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
              <Button type="submit" className="w-full">Continue</Button>
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
              <Button type="submit" className="w-full">Verify PAN</Button>
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
              <Button onClick={() => setCurrentStep(4)} className="w-full">Continue</Button>
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
              <Button type="submit" className="w-full">Verify RC</Button>
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
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Application Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Personal Details</h3>
                <p>Name: {userData.panName}</p>
                <p>Mobile: {userData.mobile}</p>
                <p>PAN: {userData.pan}</p>
                <p>DOB: {userData.dob}</p>
                <p>Credit Score: {userData.creditScore}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Vehicle Details</h3>
                <p>RC: {userData.vehicleRC}</p>
                <p>Model: {userData.vehicleModel}</p>
                <p>Make: {userData.vehicleMake}</p>
                <p>Year: {userData.vehicleYear}</p>
                <p>Fuel: {userData.fuelType}</p>
                <p>Color: {userData.vehicleColor}</p>
                <p>Market Value: ₹{userData.vehicleValue?.toLocaleString()}</p>
                <p>Owner: {userData.ownerName}</p>
                {userData.vehicleResponse?.data && (
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Engine: {userData.vehicleResponse.data.cubic_capacity} CC</p>
                    <p>Category: {userData.vehicleResponse.data.vehicle_category_description}</p>
                    <p>Body Type: {userData.vehicleResponse.data.body_type}</p>
                    <p>Seats: {userData.vehicleResponse.data.seat_capacity}</p>
                    <p>Registration: {userData.vehicleResponse.data.registration_date}</p>
                    <p>Insurance: {userData.vehicleResponse.data.insurance_company}</p>
                    <p>Insurance Valid: {userData.vehicleResponse.data.insurance_upto}</p>
                    <p>Financed: {userData.vehicleResponse.data.financed ? 'Yes' : 'No'}</p>
                    {userData.vehicleResponse.data.financer && (
                      <p>Financer: {userData.vehicleResponse.data.financer}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Income Details</h3>
                <p>Monthly Income: ₹{userData.income?.toLocaleString()}</p>
                <p>Employment: {userData.employment}</p>
              </div>
            </div>
            
            <EligibleProducts userData={userData} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-blue-600 text-white text-center">
          <h1 className="text-2xl font-bold">Finonest</h1>
          <Progress value={getProgressValue()} className="mt-4 bg-blue-500" />
          <p className="text-sm mt-2 text-blue-100">Step {currentStep} of 6</p>
        </CardHeader>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanOnboarding;