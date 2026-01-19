import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard } from "lucide-react";

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
  const { toast } = useToast();

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
    // Create URL with product data
    const productData = encodeURIComponent(JSON.stringify(product));
    const url = `/credit-card-apply?product=${productData}`;
    window.open(url, '_blank');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
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
                  <div className="w-full h-48 rounded-t-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <CreditCard className="w-16 h-16 text-gray-400" />
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
                  <div className="w-full h-48 rounded-t-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <CreditCard className="w-16 h-16 text-gray-400" />
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
      </div>
      <Footer />
    </>
  );
};

export default CreditCards;