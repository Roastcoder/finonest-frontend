import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  x_position?: number;
  y_position?: number;
  manager_name?: string;
  working_hours: string;
  status: string;
}

const OurBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [hoveredBranch, setHoveredBranch] = useState<Branch | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`https://api.finonest.com/api/branches?t=${Date.now()}`);
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched branches:', data.branches);
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
                {/* Map Container - Same as Admin */}
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
                  {/* India SVG Map - Exact same as admin */}
                  <img 
                    src="/india.svg" 
                    alt="India Map" 
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  
                  {/* Branch Pins - Exact same positioning as admin */}
                  {branches.filter(branch => branch.x_position != null && branch.y_position != null).map((branch) => {
                    // Ensure position values are within valid range (0-100)
                    const xPos = Math.max(0, Math.min(100, Number(branch.x_position)));
                    const yPos = Math.max(0, Math.min(100, Number(branch.y_position)));
                    console.log('Public map pin:', branch.name, 'at', xPos, yPos);
                    return (
                      <div
                        key={branch.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform z-10"
                        style={{ left: `${xPos}%`, top: `${yPos}%` }}
                        onMouseEnter={() => setHoveredBranch(branch)}
                        onMouseLeave={() => setHoveredBranch(null)}
                        onClick={() => openInMaps(branch)}
                      >
                        <MapPin className="w-6 h-6 text-red-600 drop-shadow-lg" fill="currentColor" />
                        
                        {hoveredBranch?.id === branch.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-xl border min-w-48 z-30">
                            <p className="font-semibold text-sm text-gray-900">{branch.name}</p>
                            <p className="text-xs text-gray-600 mb-1">{branch.city}, {branch.state}</p>
                            <p className="text-xs text-blue-600 font-medium">Click for directions</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branch List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.filter(branch => !branch.x_position || !branch.y_position).map((branch) => (
              <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-600">{branch.address}</p>
                    <p className="text-gray-600">{branch.city}, {branch.state} - {branch.pincode}</p>
                    {branch.phone && <p className="text-gray-600">📞 {branch.phone}</p>}
                    {branch.manager_name && <p className="text-gray-600">👤 {branch.manager_name}</p>}
                    <p className="text-gray-600">🕒 {branch.working_hours}</p>
                  </div>
                  <button
                    onClick={() => openInMaps(branch)}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Get Directions →
                  </button>
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

export default OurBranches;