import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, User, Car, CreditCard } from "lucide-react";

interface LoanApplication {
  id: number;
  application_id: string;
  mobile: string;
  pan: string;
  pan_name: string;
  dob: string;
  gender: string;
  credit_score: number;
  vehicle_rc: string;
  vehicle_model: string;
  vehicle_make: string;
  vehicle_year: number;
  fuel_type: string;
  vehicle_value: number;
  income: number;
  employment: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  step_completed: number;
  created_at: string;
  updated_at: string;
}

const AdminLoanOnboarding = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/loan-applications.php', {
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
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStepProgress = (step: number) => {
    const steps = ['Mobile', 'PAN', 'Credit', 'Vehicle', 'Income', 'Complete'];
    return `${steps[step - 1] || 'Unknown'} (${step}/6)`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Loan Onboarding Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No onboarding applications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedApp(app)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{app.pan_name || app.mobile}</CardTitle>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {getStepProgress(app.step_completed)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><strong>Mobile:</strong> {app.mobile}</p>
                    <p className="text-sm"><strong>PAN:</strong> {app.pan}</p>
                    {app.credit_score && (
                      <p className="text-sm"><strong>Credit Score:</strong> {app.credit_score}</p>
                    )}
                    {app.vehicle_model && (
                      <p className="text-sm"><strong>Vehicle:</strong> {app.vehicle_make} {app.vehicle_model}</p>
                    )}
                    <p className="text-sm"><strong>Date:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedApp?.pan_name || selectedApp?.mobile} - Onboarding Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedApp.status)}>
                  {selectedApp.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {getStepProgress(selectedApp.step_completed)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {selectedApp.pan_name || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {selectedApp.mobile}</p>
                    <p><strong>PAN:</strong> {selectedApp.pan}</p>
                    <p><strong>DOB:</strong> {selectedApp.dob || 'N/A'}</p>
                    <p><strong>Gender:</strong> {selectedApp.gender || 'N/A'}</p>
                    <p><strong>Employment:</strong> {selectedApp.employment || 'N/A'}</p>
                    <p><strong>Income:</strong> ₹{selectedApp.income?.toLocaleString() || 'N/A'}</p>
                  </CardContent>
                </Card>

                {/* Credit Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Credit Score:</strong> {selectedApp.credit_score || 'N/A'}</p>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Credit score range: {selectedApp.credit_score ? 
                          selectedApp.credit_score >= 750 ? 'Excellent' :
                          selectedApp.credit_score >= 700 ? 'Good' :
                          selectedApp.credit_score >= 650 ? 'Fair' : 'Poor'
                        : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>RC Number:</strong> {selectedApp.vehicle_rc || 'N/A'}</p>
                    <p><strong>Make:</strong> {selectedApp.vehicle_make || 'N/A'}</p>
                    <p><strong>Model:</strong> {selectedApp.vehicle_model || 'N/A'}</p>
                    <p><strong>Year:</strong> {selectedApp.vehicle_year || 'N/A'}</p>
                    <p><strong>Fuel Type:</strong> {selectedApp.fuel_type || 'N/A'}</p>
                    <p><strong>Market Value:</strong> ₹{selectedApp.vehicle_value?.toLocaleString() || 'N/A'}</p>
                  </CardContent>
                </Card>

                {/* Application Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Application ID:</strong> {selectedApp.application_id}</p>
                    <p><strong>Status:</strong> {selectedApp.status}</p>
                    <p><strong>Step Completed:</strong> {getStepProgress(selectedApp.step_completed)}</p>
                    <p><strong>Created:</strong> {new Date(selectedApp.created_at).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(selectedApp.updated_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoanOnboarding;