import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, User, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  priority?: number;
}

const OurBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedState && selectedState !== "all") {
      setFilteredBranches(branches.filter(branch => branch.state === selectedState));
    } else {
      setFilteredBranches(branches);
    }
  }, [branches, selectedState]);

  useEffect(() => {
    if (filteredBranches.length > 0 && mapRef.current && window.L && !leafletMapRef.current) {
      // India geographic bounds
      const indiaBounds = [[6.4627, 68.1097], [35.5137, 97.3953]];
      
      // Initialize map with India bounds
      leafletMapRef.current = window.L.map(mapRef.current, {
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0
      }).fitBounds(indiaBounds);
      
      // CartoDB Light tiles (clean, professional)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 12,
        minZoom: 3
      }).addTo(leafletMapRef.current);
      
      // Add markers for filtered branches
      filteredBranches.forEach(branch => {
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
  }, [filteredBranches]);

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

  const getUniqueStates = () => {
    const states = [...new Set(branches.map(branch => branch.state))];
    return states.sort();
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
        <div className="relative px-4 md:px-4 pb-16">
          <div className="container mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-none md:rounded-3xl shadow-2xl border-0 md:border border-gray-200/50 p-0 md:p-8">
              <div className="text-center mb-4 md:mb-8 px-4 md:px-0">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Locate Our Branches</h2>
                <p className="text-gray-600 text-sm md:text-base">Click on any marker to get directions</p>
              </div>
              
              <div className="relative overflow-hidden rounded-none md:rounded-2xl shadow-xl">
                <div ref={mapRef} className="w-full h-[300px] md:h-[500px]" style={{ zIndex: 1 }}></div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-900/5 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Cards Section */}
        <div className="px-4 pb-20">
          <div className="container mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">All Branch Locations</h2>
              <p className="text-gray-600 text-sm md:text-base mb-6">Complete details of our branch network</p>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {getUniqueStates().map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedState && selectedState !== "all" && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedState("")}>
                    <X className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
              {filteredBranches.map((branch) => (
                <div key={branch.id} className="group cursor-pointer" onClick={() => setSelectedBranch(branch)}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-gray-200/30 p-4 md:p-8 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3 md:mb-6">
                      <div className="bg-gray-100 p-2 md:p-4 rounded-lg md:rounded-xl">
                        <MapPin className="w-5 h-5 md:w-8 md:h-8 text-gray-700" />
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                        Active
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4 line-clamp-2">{branch.name}</h3>
                    
                    <div className="space-y-2 md:space-y-4 text-xs md:text-base text-gray-600 mb-4 md:mb-8">
                      <div className="flex items-start gap-2 md:gap-3">
                        <MapPin className="w-3 h-3 md:w-5 md:h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-2">{branch.city}, {branch.state}</span>
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-2 md:gap-3">
                          <Phone className="w-3 h-3 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{branch.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 md:gap-3">
                        <Clock className="w-3 h-3 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{branch.working_hours}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Branch Details Modal */}
      <Dialog open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {selectedBranch?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      {selectedBranch.address}, {selectedBranch.city}, {selectedBranch.state} - {selectedBranch.pincode}
                    </p>
                  </div>
                  
                  {selectedBranch.phone && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedBranch.phone}
                      </p>
                    </div>
                  )}
                  
                  {selectedBranch.email && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {selectedBranch.email}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Working Hours</h4>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {selectedBranch.working_hours}
                    </p>
                  </div>
                  
                  {selectedBranch.manager_name && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Branch Manager</h4>
                      <p className="text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {selectedBranch.manager_name}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      Active
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => openInMaps(selectedBranch)}
                  className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                {selectedBranch.phone && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`tel:${selectedBranch.phone}`)}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Branch
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
};

export default OurBranches;