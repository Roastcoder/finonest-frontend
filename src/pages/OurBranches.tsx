import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, User, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      
      // Fix cursor styles
      const mapContainer = leafletMapRef.current.getContainer();
      mapContainer.style.cursor = 'grab';
      
      leafletMapRef.current.on('mousedown', () => {
        mapContainer.style.cursor = 'grabbing';
      });
      
      leafletMapRef.current.on('mouseup', () => {
        mapContainer.style.cursor = 'grab';
      });
      
      // Add a test marker first
      const testMarker = window.L.marker([28.6139, 77.2090]) // Delhi coordinates
        .addTo(leafletMapRef.current)
        .bindPopup('Test Marker - Delhi');
      
      console.log('Test marker added at Delhi');
      
      // Add markers for filtered branches with different colors for same locations
      const locationGroups = new Map();
      
      // Group branches by location
      filteredBranches.forEach(branch => {
        console.log('Branch coordinates:', branch.name, branch.latitude, branch.longitude);
        const lat = parseFloat(branch.latitude);
        const lng = parseFloat(branch.longitude);
        
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
          if (!locationGroups.has(key)) {
            locationGroups.set(key, []);
          }
          locationGroups.get(key).push({...branch, latitude: lat, longitude: lng});
        }
      });
      
      console.log('Location groups:', locationGroups.size);
      
      // Create markers with different colors based on count
      locationGroups.forEach((branchesAtLocation, locationKey) => {
        const [lat, lng] = locationKey.split(',').map(Number);
        const count = branchesAtLocation.length;
        
        // Define marker colors based on count
        let markerColor = '#10b981'; // Green for single branch
        if (count > 1) {
          markerColor = count === 2 ? '#f59e0b' : // Amber for 2 branches
                       count === 3 ? '#ef4444' : // Red for 3 branches  
                       count >= 4 ? '#8b5cf6' : '#10b981'; // Purple for 4+ branches
        }
        
        // Create custom colored marker with better visibility
        const customIcon = window.L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; cursor: pointer;">${count > 1 ? count : '📍'}</div>`,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        // Create popup content
        let popupContent = '';
        if (count === 1) {
          const branch = branchesAtLocation[0];
          popupContent = `
            <div>
              <b>${branch.name}</b><br>
              ${branch.city}, ${branch.state}<br>
              <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}', '_blank')" 
                      style="background: #2563eb; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">
                Get Directions →
              </button>
            </div>
          `;
        } else {
          popupContent = `
            <div>
              <b>${count} Branches at this location:</b><br><br>
              ${branchesAtLocation.map(branch => `
                <div style="margin-bottom: 8px; padding: 4px; border-left: 3px solid ${markerColor}; padding-left: 8px;">
                  <strong>${branch.name}</strong><br>
                  <small>${branch.address}</small><br>
                  <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}', '_blank')" 
                          style="background: ${markerColor}; color: white; padding: 2px 6px; border: none; border-radius: 3px; cursor: pointer; margin-top: 4px; font-size: 11px;">
                    Directions
                  </button>
                </div>
              `).join('')}
            </div>
          `;
        }
        
        // Use standard Leaflet marker instead of custom divIcon
        const marker = window.L.marker([lat, lng])
          .addTo(leafletMapRef.current)
          .bindPopup(popupContent, { maxWidth: 300 });
        
        console.log('Added marker at:', lat, lng);
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
    const states = [...new Set(branches.map(branch => branch.state).filter(Boolean))];
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
                <div ref={mapRef} className="w-full h-[300px] md:h-[500px] cursor-crosshair" style={{ zIndex: 1 }}></div>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredBranches.map((branch) => {
                const branchSlug = branch.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return (
                <Link 
                  key={branch.id} 
                  to={`/${branchSlug}`}
                  className="group cursor-pointer block"
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                      {branch.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-2 leading-tight">
                          {branch.address && branch.address.length > 30 
                            ? `${branch.address.substring(0, 30)}...` 
                            : branch.address || `${branch.city}, ${branch.state}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-700">{branch.city}, {branch.state}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm">
                          {branch.working_hours.length > 20 
                            ? `${branch.working_hours.substring(0, 20)}...` 
                            : branch.working_hours
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                          View Details
                        </span>
                        <div className="text-blue-600">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OurBranches;