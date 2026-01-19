import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, User, Navigation } from "lucide-react";

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Branches</h1>
            <p className="text-xl text-gray-600">Loading branches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
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
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Branch Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-96 bg-gray-100">
                {/* Simple map representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Interactive Map View</p>
                    <p className="text-sm text-gray-500">
                      Click on any branch below to view location on Google Maps
                    </p>
                  </div>
                </div>
                
                {/* Branch markers overlay */}
                <div className="absolute inset-0">
                  {branches.map((branch, index) => (
                    <div
                      key={branch.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                        hoveredBranch?.id === branch.id ? 'scale-125 z-10' : 'z-0'
                      }`}
                      style={{
                        left: `${20 + (index % 3) * 30}%`,
                        top: `${30 + Math.floor(index / 3) * 25}%`
                      }}
                      onMouseEnter={() => setHoveredBranch(branch)}
                      onMouseLeave={() => setHoveredBranch(null)}
                      onClick={() => openInMaps(branch)}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {index + 1}
                        </div>
                        {hoveredBranch?.id === branch.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg border min-w-48">
                            <p className="font-semibold text-sm">{branch.name}</p>
                            <p className="text-xs text-gray-600">{branch.city}, {branch.state}</p>
                            <p className="text-xs text-blue-600 mt-1">Click to view on map</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                <Badge variant="outline" className="ml-2">
                  {stateBranches.length} {stateBranches.length === 1 ? 'Branch' : 'Branches'}
                </Badge>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stateBranches.map((branch) => (
                  <Card 
                    key={branch.id} 
                    className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                      selectedBranch?.id === branch.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedBranch(branch)}
                    onMouseEnter={() => setHoveredBranch(branch)}
                    onMouseLeave={() => setHoveredBranch(null)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {branch.address}<br />
                          {branch.city}, {branch.state} - {branch.pincode}
                        </p>
                      </div>
                      
                      {branch.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a 
                            href={`tel:${branch.phone}`}
                            className="text-sm text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {branch.phone}
                          </a>
                        </div>
                      )}
                      
                      {branch.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a 
                            href={`mailto:${branch.email}`}
                            className="text-sm text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {branch.email}
                          </a>
                        </div>
                      )}
                      
                      {branch.manager_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            Manager: {branch.manager_name}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{branch.working_hours}</p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInMaps(branch);
                          }}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          View on Map
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(branch);
                          }}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
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
  );
};

export default OurBranches;