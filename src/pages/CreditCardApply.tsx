import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { CreditCard, Phone, Mail, User, CheckCircle, Star, Shield, Gift, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  category: string;
  variant: string;
  commission_rate: string;
  card_image: string;
  variant_image: string;
  product_highlights: string;
  bank_redirect_url: string;
}

const CreditCardApply = () => {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: ""
  });

  useEffect(() => {
    const productParam = searchParams.get('product');
    console.log('Product param:', productParam);
    console.log('All search params:', Object.fromEntries(searchParams.entries()));
    
    if (productParam) {
      try {
        const productData = JSON.parse(decodeURIComponent(productParam));
        console.log('Parsed product data:', productData);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to parse product data:', error);
        console.error('Raw param was:', productParam);
      }
    } else {
      // Try to get from URL hash or window.location
      const urlParams = new URLSearchParams(window.location.search);
      const hashProductParam = urlParams.get('product');
      console.log('Fallback product param from window.location:', hashProductParam);
      
      if (hashProductParam) {
        try {
          const productData = JSON.parse(decodeURIComponent(hashProductParam));
          console.log('Parsed fallback product data:', productData);
          setProduct(productData);
        } catch (error) {
          console.error('Failed to parse fallback product data:', error);
        }
      }
    }
  }, [searchParams]);

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    const leadData = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      product_id: product.id,
      product_name: product.name,
      product_variant: product.variant,
      product_highlights: product.product_highlights,
      bank_redirect_url: product.bank_redirect_url,
      channel_code: 'PARTNER_001',
      status: 'new'
    };

    let leadId = null;

    try {
      // Save to external cards API
      const response = await fetch('https://cards.finonest.com/api/leads.php', {
        method: 'POST',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });
      
      if (response.ok) {
        const responseText = await response.text();
        // Check if response is valid JSON
        if (responseText.includes('Parse error') || responseText.includes('<b>')) {
          // console.error('API returned PHP error:', responseText);
          throw new Error('Server error');
        }
        const data = JSON.parse(responseText);
        leadId = data.data?.lead_id || data.lead_id || data.id;
        // Handle duplicate case - extract lead_id from message
        if (data.status === 409 && data.message && data.message.includes('Lead ID:')) {
          const match = data.message.match(/Lead ID: ([A-Z0-9]+)/);
          if (match) leadId = match[1];
        }
      } else {
        // Handle non-200 responses that might still contain lead_id
        const responseText = await response.text();
        if (!responseText.includes('Parse error') && !responseText.includes('<b>')) {
          try {
            const data = JSON.parse(responseText);
            if (data.message && data.message.includes('Lead ID:')) {
              const match = data.message.match(/Lead ID: ([A-Z0-9]+)/);
              if (match) leadId = match[1];
            }
          } catch (e) {
            // console.error('Failed to parse error response:', e);
          }
        }
      }
    } catch (error) {
      // console.error('External cards API failed:', error);
    }
    
    setLeadId(leadId || Date.now().toString());
    setFormData({ name: "", mobile: "", email: "" });
    setShowThankYou(true);
    
    toast({
      title: "Application Submitted",
      description: "Your application has been received. We'll contact you within 24 hours.",
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Product</h1>
          <p className="text-muted-foreground">Product information not found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/credit-cards')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Credit Cards
          </Button>
        </div>
      </div>
    );
  }

  // Thank You Page
  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your application for <strong>{product.name}</strong> has been submitted successfully.
              We'll contact you within 24 hours.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  let redirectUrl = product.bank_redirect_url;
                  if (redirectUrl.includes('{lead_id}')) {
                    redirectUrl = redirectUrl.replace('{lead_id}', leadId || '');
                  } else {
                    redirectUrl = `${redirectUrl}?lead_id=${leadId}`;
                  }
                  window.open(redirectUrl, '_blank');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Visit {product.variant} Website
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.close()}
                className="w-full"
              >
                Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/credit-cards')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Credit Cards
          </Button>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Credit Card</h1>
            <p className="text-muted-foreground">Complete your application in just a few steps</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Card Details */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  {product.name}
                </CardTitle>
                <p className="text-blue-600 font-medium">{product.variant}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Card Image */}
                <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-50">
                  <img 
                    src={product.variant_image || product.card_image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = product.card_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3ECredit Card%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Key Features
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{product.product_highlights}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Secure</p>
                    <p className="text-xs text-muted-foreground">Bank-grade security</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Rewards</p>
                    <p className="text-xs text-muted-foreground">Earn on every spend</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
                <p className="text-sm text-muted-foreground">Fill in your details to apply</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitLead} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Mobile Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> By submitting this form, you agree to be contacted by our team 
                      and {product.variant} representatives regarding your credit card application.
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardApply;