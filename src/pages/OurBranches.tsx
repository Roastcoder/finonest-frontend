import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, User, Navigation } from "lucide-react";
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
  manager_name?: string;
  working_hours: string;
  status: 'active' | 'inactive';
}

const OurBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      name: "Finonest Mumbai Central",
      address: "123 Business District, Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91-22-12345678",
      email: "mumbai@finonest.com",
      latitude: 18.9220,
      longitude: 72.8347,
      manager_name: "Rajesh Kumar",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    },
    {
      id: 2,
      name: "Finonest Delhi Branch",
      address: "456 Connaught Place, Central Delhi",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "+91-11-87654321",
      email: "delhi@finonest.com",
      latitude: 28.6315,
      longitude: 77.2167,
      manager_name: "Priya Sharma",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    },
    {
      id: 3,
      name: "Finonest Bangalore Tech Hub",
      address: "789 MG Road, Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      phone: "+91-80-11223344",
      email: "bangalore@finonest.com",
      latitude: 12.9716,
      longitude: 77.5946,
      manager_name: "Suresh Reddy",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    },
    {
      id: 4,
      name: "Finonest Chennai Branch",
      address: "101 Anna Salai, T. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      phone: "+91-44-55667788",
      email: "chennai@finonest.com",
      latitude: 13.0827,
      longitude: 80.2707,
      manager_name: "Lakshmi Iyer",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    },
    {
      id: 5,
      name: "Finonest Pune Office",
      address: "202 FC Road, Shivajinagar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
      phone: "+91-20-99887766",
      email: "pune@finonest.com",
      latitude: 18.5204,
      longitude: 73.8567,
      manager_name: "Amit Patil",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    },
    {
      id: 6,
      name: "Finonest Hyderabad Center",
      address: "303 Banjara Hills, Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      phone: "+91-40-44332211",
      email: "hyderabad@finonest.com",
      latitude: 17.3850,
      longitude: 78.4867,
      manager_name: "Venkat Rao",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<Branch | null>(null);

  const openInMaps = (branch: Branch) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
    window.open(url, '_blank');
  };

  const getDirections = (branch: Branch) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
    window.open(url, '_blank');
  };

  const groupedBranches = branches.reduce((acc, branch) => {
    if (!acc[branch.state]) {
      acc[branch.state] = [];
    }
    acc[branch.state].push(branch);
    return acc;
  }, {} as Record<string, Branch[]>);

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
              Click on any branch to get directions or view on map.
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
                  {/* India Map Background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-80 opacity-20">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        <path d="M100 50 L300 50 L350 100 L350 300 L300 350 L100 350 L50 300 L50 100 Z" 
                              fill="currentColor" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Branch markers overlay */}
                  <div className="absolute inset-0">
                    {branches.map((branch, index) => {
                      const positions = [
                        { left: '25%', top: '40%' }, // Mumbai
                        { left: '45%', top: '25%' }, // Delhi
                        { left: '55%', top: '65%' }, // Bangalore
                        { left: '65%', top: '75%' }, // Chennai
                        { left: '35%', top: '50%' }, // Pune
                        { left: '60%', top: '45%' }  // Hyderabad
                      ];
                      const position = positions[index] || { left: '50%', top: '50%' };
                      
                      return (
                        <div
                          key={branch.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${hoveredBranch?.id === branch.id ? 'scale-125 z-20' : 'z-10'}`}
                          style={position}
                          onMouseEnter={() => setHoveredBranch(branch)}
                          onMouseLeave={() => setHoveredBranch(null)}
                          onClick={() => openInMaps(branch)}
                        >
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300 ${
                              hoveredBranch?.id === branch.id ? 'bg-red-600 shadow-xl' : 'bg-red-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                            
                            {hoveredBranch?.id === branch.id && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white p-3 rounded-lg shadow-xl border min-w-64 z-30">
                                <p className="font-semibold text-sm text-gray-900">{branch.name}</p>
                                <p className="text-xs text-gray-600 mb-1">{branch.city}, {branch.state}</p>
                                <p className="text-xs text-blue-600 font-medium">Click to view on Google Maps</p>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Map Instructions */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-800 mb-1">Interactive Map View</p>
                    <p className="text-xs text-gray-600">Hover over markers for details • Click to open in Google Maps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branches List */}
          <div className="space-y-8">
            {Object.entries(groupedBranches).map(([state, stateBranches]) => (
              <div key={state}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  {state}
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                    {stateBranches.length} {stateBranches.length === 1 ? 'Branch' : 'Branches'}
                  </Badge>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stateBranches.map((branch) => (
                    <Card 
                      key={branch.id} 
                      className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg ${selectedBranch?.id === branch.id ? 'ring-2 ring-blue-500 shadow-blue-200' : 'hover:shadow-blue-100'}`}
                      onClick={() => setSelectedBranch(branch)}
                      onMouseEnter={() => setHoveredBranch(branch)}
                      onMouseLeave={() => setHoveredBranch(null)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900">{branch.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {branch.address}<br />
                            {branch.city}, {branch.state} - {branch.pincode}
                          </p>
                        </div>
                        
                        {branch.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <a 
                              href={`tel:${branch.phone}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {branch.phone}
                            </a>
                          </div>
                        )}
                        
                        {branch.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-500" />
                            <a 
                              href={`mailto:${branch.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {branch.email}
                            </a>
                          </div>
                        )}
                        
                        {branch.manager_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-500" />
                            <p className="text-sm text-gray-600">
                              Manager: {branch.manager_name}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          <p className="text-sm text-gray-600">{branch.working_hours}</p>
                        </div>
                        
                        <div className="flex gap-2 pt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInMaps(branch);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-md text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                          >
                            <MapPin className="w-3 h-3" />
                            View on Map
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(branch);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-md text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                          >
                            <Navigation className="w-3 h-3" />
                            Directions
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {branches.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Branches Found</h3>
              <p className="text-gray-500">We're expanding our network. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurBranches;