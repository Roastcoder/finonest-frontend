import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Users, MapPin, Phone, Mail, Edit, Trash2, Eye } from "lucide-react";

interface Banker {
  id: number;
  banker_name: string;
  mobile_number: string;
  official_email: string;
  profile: string;
  lender_name: string;
  territories_count: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const AdminBankers = () => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanker, setSelectedBanker] = useState<Banker | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBankers();
  }, []);

  const fetchBankers = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin/bankers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBankers(data.bankers || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bankers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBankerStatus = async (id: number, status: 'active' | 'inactive') => {
    try {
      const response = await fetch(`https://api.finonest.com/api/admin/bankers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setBankers(bankers.map(b => b.id === id ? { ...b, status } : b));
        toast({
          title: "Success",
          description: "Banker status updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banker status",
        variant: "destructive",
      });
    }
  };

  const deleteBanker = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banker?')) return;
    
    try {
      const response = await fetch(`https://api.finonest.com/api/admin/bankers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBankers(bankers.filter(b => b.id !== id));
        toast({
          title: "Success",
          description: "Banker deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banker",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banker Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading bankers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Banker Management ({bankers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bankers.length === 0 ? (
            <p>No bankers found.</p>
          ) : (
            <div className="space-y-4">
              {bankers.map((banker) => (
                <div key={banker.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{banker.banker_name}</h3>
                        <Badge variant={banker.status === 'active' ? 'default' : 'secondary'}>
                          {banker.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {banker.mobile_number}
                        </p>
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {banker.official_email}
                        </p>
                        <p>Profile: {banker.profile.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        <p>Lender: {banker.lender_name}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {banker.territories_count} Territories
                        </p>
                        <p>Created: {new Date(banker.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedBanker(banker);
                        setShowDetails(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select value={banker.status} onValueChange={(value: 'active' | 'inactive') => 
                        updateBankerStatus(banker.id, value)
                      }>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="destructive" size="sm" onClick={() => deleteBanker(banker.id)}>
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

      {/* Banker Details Modal */}
      {showDetails && selectedBanker && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Banker Details - {selectedBanker.banker_name}</CardTitle>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Name:</label>
                <p>{selectedBanker.banker_name}</p>
              </div>
              <div>
                <label className="font-medium">Mobile:</label>
                <p>{selectedBanker.mobile_number}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p>{selectedBanker.official_email}</p>
              </div>
              <div>
                <label className="font-medium">Profile:</label>
                <p>{selectedBanker.profile.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <div>
                <label className="font-medium">Lender:</label>
                <p>{selectedBanker.lender_name}</p>
              </div>
              <div>
                <label className="font-medium">Territories:</label>
                <p>{selectedBanker.territories_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBankers;