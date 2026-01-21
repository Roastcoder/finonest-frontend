import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Declare Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

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
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length > 0 && mapRef.current && window.L && !leafletMapRef.current) {
      // Initialize Leaflet map
      leafletMapRef.current = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      
      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 4,
        maxBounds: [[6.4627, 68.1097], [35.5137, 97.3953]],
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);
      
      // Add markers for branches
      branches.forEach(branch => {
        if (branch.latitude && branch.longitude) {
          const marker = window.L.marker([branch.latitude, branch.longitude])
            .addTo(leafletMapRef.current)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold">${branch.name}</h3>
                <p class="text-sm text-gray-600">${branch.city}, ${branch.state}</p>
                <p class="text-sm">${branch.address}</p>
                <p class="text-sm">📞 ${branch.phone || 'N/A'}</p>
                <p class="text-sm">🕒 ${branch.working_hours}</p>
              </div>
            `);
        }
      });
    }
  }, [branches]);

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
                {/* Leaflet Map */}
                <div ref={mapRef} className="w-full h-96" style={{ zIndex: 1 }}></div>
              </CardContent>
            </Card>
          </div>

          {/* Branch List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
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