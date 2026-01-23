import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Phone, Mail, User } from "lucide-react";

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
      const response = await fetch('https://api.finonest.com/api/products', {
        headers: {
          'X-API-Key': 'FINONEST_API_KEY_2024'
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
      const response = await fetch('https://api.finonest.com/api/leads', {
        method: 'POST',
        headers: {
          'X-API-Key': 'FINONEST_API_KEY_2024',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          product_id: selectedProduct.id,
          channel_code: 'WEBSITE_CREDIT_CARD'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Application Submitted!",
          description: "We'll contact you within 24 hours.",
        });
        setFormData({ name: "", mobile: "", email: "" });
        setShowForm(false);
        setSelectedProduct(null);
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 sm:py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Credit Cards</h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">Choose the perfect credit card for your lifestyle</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="truncate">{product.name}</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium truncate">{product.variant}</p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="w-full h-24 sm:h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={product.card_image} 
                      alt={product.name}
                      className="h-16 sm:h-20 object-contain z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-30 absolute" />
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {product.product_highlights}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      onClick={() => handleApply(product)} 
                      className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                      size="sm"
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(product.bank_redirect_url, '_blank')}
                      className="w-full sm:flex-1 text-sm"
                      size="sm"
                    >
                      Bank Site
                    </Button>
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