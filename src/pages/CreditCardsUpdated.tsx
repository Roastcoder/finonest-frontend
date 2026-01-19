import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Phone, Mail, User, CheckCircle } from "lucide-react";

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

const CreditCards = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://cards.finonest.com/api/products', {
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681'
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        // Filter only credit cards
        const creditCards = data.data.filter(product => product.category === 'Credit Card');
        setProducts(creditCards);
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback data if API fails
      setProducts([
        {
          id: 1,
          name: 'Classic Credit Card',
          category: 'Credit Card',
          variant: 'IDFC First Bank',
          commission_rate: '1400.00',
          card_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
          variant_image: 'assets/cards/variant_idfc.jpg',
          product_highlights: 'Lifetime Free: No joining or annual fees. Cashback on all purchases. Fuel surcharge waiver. Welcome bonus points.',
          bank_redirect_url: 'https://www.idfcfirstbank.com/credit-card/classic'
        },
        {
          id: 2,
          name: 'Premium Credit Card',
          category: 'Credit Card',
          variant: 'HDFC Bank',
          commission_rate: '2500.00',
          card_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
          variant_image: 'assets/cards/variant_hdfc.jpg',
          product_highlights: 'Premium benefits with airport lounge access. High reward points on dining and shopping. Complimentary insurance coverage.',
          bank_redirect_url: 'https://www.hdfcbank.com/credit-card/premium'
        },
        {
          id: 3,
          name: 'Business Credit Card',
          category: 'Credit Card',
          variant: 'Axis Bank',
          commission_rate: '1800.00',
          card_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop',
          variant_image: 'assets/cards/variant_axis.jpg',
          product_highlights: 'Designed for business expenses. Higher credit limits. Business reward points. Expense management tools.',
          bank_redirect_url: 'https://www.axisbank.com/credit-card/business'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    try {
      // Try external API first
      const response = await fetch('https://cards.finonest.com/api/leads', {
        method: 'POST',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          product_id: selectedProduct.id,
          channel_code: 'PARTNER_001'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && (data.success || data.status === 201)) {
        setFormData({ name: "", mobile: "", email: "" });
        setShowForm(false);
        setShowThankYou(true);
        return;
      }
    } catch (error) {
      console.error('External API failed:', error);
    }
    
    // Fallback to local API if external fails
    try {
      const response = await fetch('https://api.finonest.com/api/leads', {
        method: 'POST',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          product_id: selectedProduct.id,
          channel_code: 'FINONEST_WEBSITE'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setFormData({ name: "", mobile: "", email: "" });
        setShowForm(false);
        setShowThankYou(true);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  // Thank You Page
  if (showThankYou && selectedProduct) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h1>
              <p className="text-muted-foreground mb-6">
                Your application for <strong>{selectedProduct.name}</strong> has been submitted successfully.
                We'll contact you within 24 hours.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.open(selectedProduct.bank_redirect_url, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Visit {selectedProduct.variant} Website
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowThankYou(false);
                    setSelectedProduct(null);
                  }}
                  className="w-full"
                >
                  Apply for Another Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading credit cards...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Credit Cards</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Choose the perfect credit card for your lifestyle</p>
          </div>
          
          {/* Mobile List View */}
          <div className="block sm:hidden space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleApply(product)}>
                <CardContent className="p-0">
                  <div className="w-full h-32 rounded-t-lg overflow-hidden">
                    <img 
                      src={product.card_image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3ECredit Card%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-blue-600 font-medium mb-2">{product.variant}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.product_highlights}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Desktop Grid View */}
          <div className="hidden sm:grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleApply(product)}>
                <CardContent className="p-0">
                  <div className="w-full h-32 rounded-t-lg overflow-hidden">
                    <img 
                      src={product.card_image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3ECredit Card%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mb-3">{product.variant}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {product.product_highlights}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form Modal */}
        {showForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <Card className="w-full max-w-sm sm:max-w-md mx-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-base sm:text-lg">
                  Apply for {selectedProduct.name}
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">{selectedProduct.variant}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitLead} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Mobile Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      placeholder="9876543210"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                    <Button type="submit" className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-sm" size="sm">
                      Submit Application
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full sm:flex-1 text-sm"
                      size="sm"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedProduct(null);
                        setFormData({ name: "", mobile: "", email: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CreditCards;