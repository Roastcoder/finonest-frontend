import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    manager_name: "",
    working_hours: "9:00 AM - 6:00 PM",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/branches/admin', {
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
          longitude: parseFloat(formData.longitude)
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
    if (!confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      const response = await fetch(`https://api.finonest.com/api/branches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBranches(branches => branches.filter(branch => branch.id !== id));
        toast({
          title: "Success",
          description: "Branch deleted successfully",
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
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editBranch(branch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteBranch(branch.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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