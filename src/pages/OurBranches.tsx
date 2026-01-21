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
      // India geographic bounds
      const indiaBounds = [[6.4627, 68.1097], [35.5137, 97.3953]];
      
      // Initialize map with India bounds
      leafletMapRef.current = window.L.map(mapRef.current, {
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0
      }).fitBounds(indiaBounds);
      
      // CartoDB Light tiles (clean, professional)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 12,
        minZoom: 5
      }).addTo(leafletMapRef.current);
      
      // Add markers for branches
      branches.forEach(branch => {
        if (branch.latitude && branch.longitude) {
          const marker = window.L.marker([branch.latitude, branch.longitude])
            .addTo(leafletMapRef.current)
            .bindPopup(`
              <div>
                <b>${branch.name}</b><br>
                ${branch.city}, ${branch.state}<br>
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}', '_blank')" 
                        style="background: #2563eb; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                  Get Directions →
                </button>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative pt-20 pb-8">
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Branch Network
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="relative px-4 pb-16">
          <div className="container mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Locate Our Branches</h2>
                <p className="text-gray-600">Click on any marker to get directions</p>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div ref={mapRef} className="w-full h-[500px]" style={{ zIndex: 1 }}></div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-900/5 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Cards Section */}
        <div className="px-4 pb-20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">All Branch Locations</h2>
              <p className="text-gray-600">Complete details of our branch network</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div key={branch.id} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/30 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-gray-100 p-3 rounded-xl">
                        <MapPin className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{branch.name}</h3>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{branch.address}, {branch.city}, {branch.state} - {branch.pincode}</span>
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📞</span>
                          <span>{branch.phone}</span>
                        </div>
                      )}
                      {branch.manager_name && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">👤</span>
                          <span>Manager: {branch.manager_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🕒</span>
                        <span>{branch.working_hours}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => openInMaps(branch)}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-900 hover:to-black transition-all duration-200 group-hover:shadow-lg"
                    >
                      Get Directions →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurBranches;