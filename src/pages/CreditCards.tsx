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
      const response = await fetch('https://cards.finonest.com/api/products', {
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681'
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setProducts(data.data.filter((p: Product) => p.category === 'Credit Card'));
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
      const response = await fetch('https://cards.finonest.com/api/leads.php', {
        method: 'POST',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          product_variant: selectedProduct.variant,
          product_highlights: selectedProduct.product_highlights,
          bank_redirect_url: selectedProduct.bank_redirect_url,
          channel_code: 'FINONEST'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 201) {
        toast({
          title: "Application Submitted!",
          description: "We'll contact you within 24 hours.",
        });
        setFormData({ name: "", mobile: "", email: "" });
        setShowForm(false);
        setSelectedProduct(null);
        
        if (data.data?.redirect_url) {
          window.open(data.data.redirect_url, '_blank');
        }
      } else {
        toast({
          title: "Application Submitted!",
          description: data.message || "We'll contact you within 24 hours.",
        });
        setFormData({ name: "", mobile: "", email: "" });
        setShowForm(false);
        setSelectedProduct(null);
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Credit Cards</h1>
            <p className="text-lg md:text-xl text-blue-100">Choose the perfect credit card for your lifestyle</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-50 mb-4">
                    <img 
                      src={product.card_image && product.card_image !== 'null' 
                        ? (product.card_image.startsWith('http') 
                          ? product.card_image 
                          : `https://cards.finonest.com/${product.card_image}`)
                        : "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Credit+Card"
                      }
                      alt={product.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onLoad={() => console.log('✅ Image loaded:', product.card_image)}
                      onError={(e) => {
                        console.log('❌ Image failed:', product.card_image);
                        console.log('Attempted URL:', e.currentTarget.src);
                        e.currentTarget.src = "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Credit+Card";
                      }}
                    />
                  </div>
                  <CardTitle className="text-lg">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-blue-600 font-medium">{product.variant}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed">{product.product_highlights}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleApply(product)} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form Modal */}
        {showForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  Apply for {selectedProduct.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitLead} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-1" />
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
                      <Phone className="w-4 h-4 inline mr-1" />
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
                      <Mail className="w-4 h-4 inline mr-1" />
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
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Submit Application
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
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