import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Briefcase,
  Calendar,
  Download
} from "lucide-react";

interface DSAApplication {
  id: number;
  full_name: string;
  mobile_number: string;
  email: string;
  pan_number: string;
  city: string;
  state: string;
  current_profession: string;
  experience_years: string;
  business_type: string;
  preferred_products: string[];
  target_monthly_cases: string;
  status: 'pending' | 'approved' | 'rejected';
  registration_date: string;
  monthly_income: string;
  coverage_area: string;
}

const AdminDSAApplications = () => {
  const [applications, setApplications] = useState<DSAApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<DSAApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin/dsa-applications.php');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch DSA applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin/dsa-applications.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      const data = await response.json();
      if (data.success) {
        setApplications(prev => 
          prev.map(app => app.id === id ? { ...app, status: status as any } : app)
        );
        toast({
          title: "Status Updated",
          description: `Application ${status} successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.mobile_number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading DSA applications...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{application.full_name}</h3>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{application.mobile_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{application.city}, {application.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{application.current_profession}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(application.registration_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{application.experience_years} years exp</span>
                    </div>
                  </div>

                  {application.preferred_products.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Preferred Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {application.preferred_products.slice(0, 3).map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {application.preferred_products.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{application.preferred_products.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  
                  {application.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No DSA applications found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>DSA Application Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedApplication(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.full_name}</p>
                    <p><strong>Mobile:</strong> {selectedApplication.mobile_number}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>PAN:</strong> {selectedApplication.pan_number}</p>
                    <p><strong>Location:</strong> {selectedApplication.city}, {selectedApplication.state}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Professional Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Profession:</strong> {selectedApplication.current_profession}</p>
                    <p><strong>Experience:</strong> {selectedApplication.experience_years} years</p>
                    <p><strong>Monthly Income:</strong> {selectedApplication.monthly_income}</p>
                    <p><strong>Business Type:</strong> {selectedApplication.business_type}</p>
                    <p><strong>Coverage Area:</strong> {selectedApplication.coverage_area}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Business Preferences</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Target Monthly Cases:</strong> {selectedApplication.target_monthly_cases}</p>
                  <div>
                    <strong>Preferred Products:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedApplication.preferred_products.map((product, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedApplication.status)}
                  <span className="text-sm">
                    Status: <strong>{selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}</strong>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Applied: {new Date(selectedApplication.registration_date).toLocaleDateString()}
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'approved');
                      setSelectedApplication(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'rejected');
                      setSelectedApplication(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDSAApplications;