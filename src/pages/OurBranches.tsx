import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Branch {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  x_position: number;
  y_position: number;
}

const OurBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [hoveredBranch, setHoveredBranch] = useState<Branch | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/branches');
      const data = await response.json();
      if (response.ok) {
        setBranches(data.branches || []);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const openInMaps = (branch: Branch) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
    window.open(url, '_blank');
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Branches</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find our nearest branch and visit us for personalized financial solutions.
            </p>
          </div>

          {/* Interactive Map Section */}
          <div className="mb-12">
            <Card className="overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-6 h-6" />
                  Branch Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-200">
                  {/* India SVG Map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/india.svg" 
                      alt="India Map" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Admin Pin Drops */}
                  <div className="absolute inset-0">
                    {branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform group"
                        style={{ left: `${branch.x_position}%`, top: `${branch.y_position}%` }}
                        onMouseEnter={() => setHoveredBranch(branch)}
                        onMouseLeave={() => setHoveredBranch(null)}
                        onClick={() => openInMaps(branch)}
                      >
                        <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                        
                        {hoveredBranch?.id === branch.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-xl border min-w-48 z-30">
                            <p className="font-semibold text-sm text-gray-900">{branch.name}</p>
                            <p className="text-xs text-gray-600 mb-1">{branch.city}, {branch.state}</p>
                            <p className="text-xs text-blue-600 font-medium">Click for directions</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurBranches;