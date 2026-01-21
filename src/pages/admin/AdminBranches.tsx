import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, User } from "lucide-react";

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
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const AdminBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{x: number, y: number} | null>(null);
  const adminMapRef = useRef<any>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    x_position: "",
    y_position: "",
    manager_name: "",
    working_hours: "9:00 AM - 6:00 PM",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length > 0 && !adminMapRef.current && window.L) {
      // India geographic bounds
      const indiaBounds = [[6.4627, 68.1097], [35.5137, 97.3953]];
      
      // Initialize admin map
      adminMapRef.current = window.L.map('admin-map', {
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0
      }).fitBounds(indiaBounds);
      
      // OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 15,
        minZoom: 2
      }).addTo(adminMapRef.current);
      
      // Add existing branch markers
      branches.forEach(branch => {
        if (branch.latitude && branch.longitude) {
          window.L.marker([branch.latitude, branch.longitude])
            .addTo(adminMapRef.current)
            .bindPopup(`<b>${branch.name}</b><br>${branch.city}, ${branch.state}`);
        }
      });
      
      // Handle map clicks for positioning
      adminMapRef.current.on('click', (e: any) => {
        if (selectedBranch) {
          const { lat, lng } = e.latlng;
          setSelectedPosition({ x: lng, y: lat });
        }
      });
    }
  }, [branches, selectedBranch]);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`https://api.finonest.com/api/branches/admin?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBranches(data.branches || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch branches",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch branches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBranch 
        ? `https://api.finonest.com/api/branches/${editingBranch.id}`
        : 'https://api.finonest.com/api/branches';
      
      const method = editingBranch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          x_position: formData.x_position ? parseFloat(formData.x_position) : null,
          y_position: formData.y_position ? parseFloat(formData.y_position) : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Branch ${editingBranch ? 'updated' : 'created'} successfully`,
        });
        fetchBranches();
        resetForm();
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${editingBranch ? 'update' : 'create'} branch`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingBranch ? 'update' : 'create'} branch`,
        variant: "destructive",
      });
    }
  };

  const deleteBranch = async (id: number) => {
    try {
      const response = await fetch(`https://api.finonest.com/api/branches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Immediately remove from state and refetch to ensure consistency
        setBranches(branches => branches.filter(branch => branch.id !== id));
        setTimeout(() => fetchBranches(), 500); // Refetch after a short delay
        toast({
          title: "Success",
          description: "Branch deleted successfully",
        });
      } else if (response.status === 404) {
        setBranches(branches => branches.filter(branch => branch.id !== id));
        toast({
          title: "Info",
          description: "Branch was already deleted",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete branch",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Map clicks are now handled by Leaflet event listener
    return;
  };

  const updateBranchPosition = async () => {
    if (!selectedBranch || !selectedPosition) {
      toast({
        title: "Error",
        description: "Please select a branch and position first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(`https://api.finonest.com/api/branches/${selectedBranch.id}/position`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: selectedPosition.y,
          longitude: selectedPosition.x
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Branch position updated successfully",
        });
        fetchBranches();
        setSelectedPosition(null);
        setSelectedBranch(null);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update branch position",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating branch position:', error);
      toast({
        title: "Error",
        description: "Failed to update branch position",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      latitude: "",
      longitude: "",
      x_position: "",
      y_position: "",
      manager_name: "",
      working_hours: "9:00 AM - 6:00 PM",
      status: "active"
    });
    setEditingBranch(null);
    setShowForm(false);
  };

  const editBranch = (branch: Branch) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      phone: branch.phone || "",
      email: branch.email || "",
      latitude: branch.latitude.toString(),
      longitude: branch.longitude.toString(),
      x_position: branch.x_position?.toString() || "",
      y_position: branch.y_position?.toString() || "",
      manager_name: branch.manager_name || "",
      working_hours: branch.working_hours,
      status: branch.status
    });
    setEditingBranch(branch);
    setShowForm(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Branch Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading branches...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Branch Management ({branches.length})
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Branch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingBranch ? 'Edit' : 'Create'} Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Branch Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <Input
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Map X Position (%)</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.x_position}
                        onChange={(e) => setFormData({...formData, x_position: e.target.value})}
                        placeholder="Click on map to set"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Map Y Position (%)</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.y_position}
                        onChange={(e) => setFormData({...formData, y_position: e.target.value})}
                        placeholder="Click on map to set"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Manager Name</label>
                      <Input
                        value={formData.manager_name}
                        onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Working Hours</label>
                      <Input
                        value={formData.working_hours}
                        onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingBranch ? 'Update' : 'Create'} Branch
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Interactive Map for Pin Positioning */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Branch Map Positioning</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a branch and click on the map to set its position
              </p>
            </CardHeader>
            <CardContent>
              <div 
                className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-200 cursor-crosshair border rounded-lg overflow-hidden"
                onClick={handleMapClick}
              >
                {/* Leaflet Map Container */}
                <div id="admin-map" className="w-full h-full"></div>
                
                {/* Instructions overlay when no branch selected */}
                {!selectedBranch && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium">Select a branch first</p>
                      <p className="text-sm text-gray-600">Choose a branch from the dropdown below</p>
                    </div>
                  </div>
                )}
                
                {/* Position controls */}
                {selectedPosition && selectedBranch && (
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50">
                    <p className="text-sm mb-2">
                      {selectedBranch.name}: {selectedPosition.y.toFixed(4)}, {selectedPosition.x.toFixed(4)}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={updateBranchPosition}>
                        Save Position
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedPosition(null);
                        setSelectedBranch(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 relative z-50">
                <Select value={selectedBranch?.id.toString() || ""} onValueChange={(value) => {
                  const branch = branches.find(b => b.id === parseInt(value));
                  setSelectedBranch(branch || null);
                  setSelectedPosition(null);
                }}>
                  <SelectTrigger className="relative z-50">
                    <SelectValue placeholder="Select branch to position" />
                  </SelectTrigger>
                  <SelectContent className="relative z-50">
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name} - {branch.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {branches.length === 0 ? (
            <p>No branches found.</p>
          ) : (
            <div className="space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{branch.name}</h3>
                        <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                          {branch.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {branch.address}, {branch.city}, {branch.state} - {branch.pincode}
                        </p>
                        {branch.phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {branch.phone}
                          </p>
                        )}
                        {branch.email && (
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {branch.email}
                          </p>
                        )}
                        {branch.manager_name && (
                          <p className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Manager: {branch.manager_name}
                          </p>
                        )}
                        <p className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {branch.working_hours}
                        </p>
                        {branch.x_position != null && branch.y_position != null && (
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Map Position: {Number(branch.x_position).toFixed(1)}%, {Number(branch.y_position).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editBranch(branch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{branch.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteBranch(branch.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBranches;