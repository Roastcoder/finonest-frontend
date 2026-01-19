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
  card_image: string | null;
  variant_image: string | null;
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
      console.log('API Response:', data);
      if (data.status === 200) {
        const creditCards = data.data.filter(product => product.category === 'Credit Card');
        console.log('Credit Cards found:', creditCards.length);
        setProducts(creditCards);
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.error('API Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (product: Product) => {
    const productData = encodeURIComponent(JSON.stringify(product));
    const url = `/credit-card-apply?product=${productData}`;
    window.open(url, '_blank');
  };

  const getImageSrc = (product: Product) => {
    if (product.card_image && product.card_image !== 'null') {
      return product.card_image;
    }
    return "/assets/service-credit-cards.jpg";
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
                  <div className="w-full h-48 rounded-t-lg overflow-hidden">
                    <img 
                      src={getImageSrc(product)} 
                      alt={product.name}
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        console.log('Image failed to load:', product.card_image);
                        e.currentTarget.src = "/assets/service-credit-cards.jpg";
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
                  <div className="w-full h-48 rounded-t-lg overflow-hidden">
                    <img 
                      src={getImageSrc(product)} 
                      alt={product.name}
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        console.log('Image failed to load:', product.card_image);
                        e.currentTarget.src = "/assets/service-credit-cards.jpg";
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
      </div>
      <Footer />
    </>
  );
};

export default CreditCards;