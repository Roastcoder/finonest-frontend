import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
<<<<<<< HEAD
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
=======
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, FileText, Eye } from "lucide-react";

interface Application {
  id: number;
  user_name?: string;
  user_email?: string;
  type?: string;
  amount?: string;
  purpose?: string;
  income?: string;
  employment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useAuth();

  const loanTypes = [
    { key: 'all', label: 'All Applications' },
    { key: 'home', label: 'Home Loan' },
    { key: 'personal', label: 'Personal Loan' },
    { key: 'business', label: 'Business Loan' },
    { key: 'car', label: 'Car Loan' },
    { key: 'credit-card', label: 'Credit Card' },
    { key: 'lap', label: 'Loan Against Property' }
  ];

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token]);

  useEffect(() => {
    filterApplications();
  }, [applications, activeFilter]);

  const filterApplications = () => {
    if (activeFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter(app => {
          const loanType = app.type?.toLowerCase();
          return loanType === activeFilter || 
                 (activeFilter === 'home' && loanType === 'home') ||
                 (activeFilter === 'personal' && loanType === 'personal') ||
                 (activeFilter === 'business' && loanType === 'business') ||
                 (activeFilter === 'car' && (loanType === 'vehicle' || loanType === 'car')) ||
                 (activeFilter === 'lap' && loanType === 'lap');
        })
      );
    }
  };

  const fetchApplications = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('https://api.finonest.com/api/admin/forms', {
=======
      const response = await fetch('http://api.finonest.com:4000/api/admin/forms', {
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
<<<<<<< HEAD
      const response = await fetch(`https://api.finonest.com/api/admin/forms/${id}`, {
=======
      const response = await fetch(`http://api.finonest.com:4000/api/admin/forms/${id}`, {
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setApplications(apps => 
          apps.map(app => 
            app.id === id ? { ...app, status: status as any } : app
          )
        );
        toast({
          title: "Success",
          description: "Status updated successfully",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'UNDER_REVIEW': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {loanTypes.map((type) => {
          const count = type.key === 'all' 
            ? applications.length 
            : applications.filter(app => {
                const loanType = app.type?.toLowerCase();
                return loanType === type.key || 
                       (type.key === 'home' && loanType === 'home') ||
                       (type.key === 'personal' && loanType === 'personal') ||
                       (type.key === 'business' && loanType === 'business') ||
                       (type.key === 'car' && (loanType === 'vehicle' || loanType === 'car')) ||
                       (type.key === 'lap' && loanType === 'lap');
              }).length;
          
          return (
            <Button 
              key={type.key}
              variant={activeFilter === type.key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(type.key)}
              size="sm"
            >
              {type.label} ({count})
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeFilter === 'all' 
              ? `All Applications (${filteredApplications.length})` 
              : `${loanTypes.find(t => t.key === activeFilter)?.label} Applications (${filteredApplications.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {activeFilter === 'all' ? 'No applications found' : `No ${loanTypes.find(t => t.key === activeFilter)?.label} applications found`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map((app) => {
                return (
                  <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedApp(app)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{app.user_name || `Application #${app.id}`}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.toUpperCase()}
                          </Badge>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      {app.type && (
                        <Badge variant="secondary" className="w-fit">
                          {app.type.toUpperCase()}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <p><strong>Email:</strong> {app.user_email || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(app.created_at).toLocaleDateString('en-GB')}</p>
                        {app.amount && (
                          <p><strong>Amount:</strong> ₹{app.amount}</p>
                        )}
                        {app.employment && (
                          <p><strong>Employment:</strong> {app.employment}</p>
                        )}
                      </div>
                      <Select
                        value={app.status}
                        onValueChange={(value) => updateStatus(app.id, value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUBMITTED">Submitted</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Application Details Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedApp?.user_name || `Application #${selectedApp?.id}`} - Details</DialogTitle>
<<<<<<< HEAD
            <DialogDescription>
              View and manage application details and status.
            </DialogDescription>
=======
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedApp.status)}>
                  {selectedApp.status.toUpperCase()}
                </Badge>
                {selectedApp.type && (
                  <Badge variant="secondary">
                    {selectedApp.type.toUpperCase()}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg">User Information</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {selectedApp.user_name || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedApp.user_email || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>Application ID:</strong> #{selectedApp.id}</p>
                        <p><strong>Submitted:</strong> {new Date(selectedApp.created_at).toLocaleDateString('en-GB')} {new Date(selectedApp.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Loan Information</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {selectedApp.type && (
                          <p><strong>Loan Type:</strong> {selectedApp.type}</p>
                        )}
                        {selectedApp.amount && (
                          <p><strong>Amount:</strong> ₹{selectedApp.amount}</p>
                        )}
                        {selectedApp.income && (
                          <p><strong>Monthly Income:</strong> ₹{selectedApp.income}</p>
                        )}
                        {selectedApp.employment && (
                          <p><strong>Employment:</strong> {selectedApp.employment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedApp.purpose && (
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Application Details</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApp.purpose.split(' | ').map((item, index) => {
                          const [key, value] = item.split(': ');
                          if (key && value && value !== 'N/A' && value !== 'None') {
                            return (
                              <div key={index} className="text-sm">
                                <strong>{key}:</strong> {value}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Application Status</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <p><strong>Current Status:</strong></p>
                        <Badge className={getStatusColor(selectedApp.status)}>
                          {selectedApp.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Update Status:</label>
                        <Select
                          value={selectedApp.status}
                          onValueChange={(value) => {
                            updateStatus(selectedApp.id, value);
                            setSelectedApp({...selectedApp, status: value as any});
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;