import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  Plus, 
  Loader2,
  Shield,
  FileText,
  Calculator,
  CheckCircle,
  Clock,
  X,
  Eye
} from "lucide-react";
import logo from "@/assets/logo.png";

interface Application {
  id: number;
  user_name?: string;
  user_email?: string;
  type: string;
  loan_type?: string;
  amount: number;
  employment?: string;
  employment_type?: string;
  income?: number;
  monthly_income?: number;
  purpose?: string;
  notes?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at?: string;
}

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, token, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!token || !user) {
        navigate('/auth');
        return;
      }
      
      if (user.role === 'ADMIN') {
        navigate('/admin');
        return;
      }
      
      fetchApplications();
    }
  }, [authLoading, token, user, navigate]);

  const fetchApplications = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('https://api.finonest.com/api/forms/mine', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          console.log('API Response:', data);
          setApplications(data.applications || []);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Response text:', text);
        }
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const formatDisplayValue = (key: string, value: string) => {
    if (key === 'DOB' && value && value !== 'N/A') {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      } catch (e) {
        // If parsing fails, return original value
      }
    }
    return value;
  };

  const parseAllFormFields = (purpose: string) => {
    if (!purpose) return {};
    
    const parts = purpose.split(' | ');
    const fields: Record<string, string> = {};
    
    parts.forEach(part => {
      const [key, value] = part.split(': ');
      if (key && value) {
        fields[key.trim()] = value.trim();
      }
    });
    
    return fields;
  };

  const getKeyInfo = (purpose: string) => {
    if (!purpose) return 'No additional info';
    
    const parts = purpose.split(' | ');
    const company = parts.find(p => p.startsWith('Company: '))?.replace('Company: ', '');
    const designation = parts.find(p => p.startsWith('Designation: '))?.replace('Designation: ', '');
    
    if (company && designation) {
      return `${designation} at ${company}`;
    }
    return 'Application submitted';
  };

  const parsePurposeNotes = (purpose: string) => {
    if (!purpose || purpose === 'N/A') return { purpose: 'N/A', notes: 'N/A' };
    
    const parts = purpose.split(' | ');
    const purposeMatch = parts.find(p => p.startsWith('Purpose: '));
    const notesMatch = parts.find(p => p.startsWith('Additional Notes: '));
    
    return {
      purpose: purposeMatch ? purposeMatch.replace('Purpose: ', '') : 'N/A',
      notes: notesMatch ? notesMatch.replace('Additional Notes: ', '') : 'N/A'
    };
  };

  const getDisplayLoanType = (type: string) => {
    const typeMapping: Record<string, string> = {
      'HOME': 'Home Loan',
      'PERSONAL': 'Personal Loan',
      'BUSINESS': 'Business Loan',
      'VEHICLE': 'Car Loan',
      'LAP': 'Loan Against Property'
    };
    return typeMapping[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'UNDER_REVIEW': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role === 'ADMIN') {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Finonest | Welcome Back</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-16">
        <header className="md:hidden bg-white/80 backdrop-blur-lg border-b border-blue-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="Finonest" className="h-10 object-contain" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        <header className="hidden md:block bg-white/80 backdrop-blur-lg border-b border-blue-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="Finonest" className="h-10 object-contain" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-xs text-gray-600">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Financial Dashboard</h1>
            <p className="text-gray-600">Manage your loans and track your applications</p>
          </div>

          <div className="grid gap-8">
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'APPROVED').length}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/apply" className="group p-6 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Apply for Loan</h3>
                    <p className="text-sm text-gray-600">Start your loan application</p>
                  </div>
                </Link>
                
                <Link to="/cibil-check" className="group p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Credit Score</h3>
                    <p className="text-sm text-gray-600">Check your CIBIL score</p>
                  </div>
                </Link>

                <Link to="/emi-calculator" className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">EMI Calculator</h3>
                    <p className="text-sm text-gray-600">Calculate loan EMI</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* My Applications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {applications.length} Total
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-6">Start your loan journey by applying for a loan</p>
                    <Link to="/apply">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply for Loan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div 
                        key={app.id} 
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedApp(app)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Application #{app.id}</h3>
                                <p className="text-sm text-gray-600">
                                  Applied on {new Date(app.created_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Loan Type</p>
                                <p className="font-medium text-gray-900">{getDisplayLoanType(app.type || app.loan_type || 'N/A')}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Amount</p>
                                <p className="font-medium text-gray-900">₹{Number(app.amount || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Employment</p>
                                <p className="font-medium text-gray-900">{(app.employment || app.employment_type || 'N/A').charAt(0).toUpperCase() + (app.employment || app.employment_type || 'N/A').slice(1).toLowerCase()}</p>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500">{getKeyInfo(app.purpose || '')}</p>
                            </div>
                          </div>
                          <div className="ml-6 flex items-center gap-2">
                            <Badge className={`${getStatusColor(app.status)} text-white px-3 py-1`}>
                              {app.status.replace('_', ' ')}
                            </Badge>
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Application #{selectedApp.id}</h2>
                  <p className="text-gray-600">Application Details</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedApp(null)}
                  className="hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-semibold text-gray-900">Application {selectedApp.status.replace('_', ' ')}</p>
                  </div>
                  <Badge className={`${getStatusColor(selectedApp.status)} text-white px-4 py-2`}>
                    {selectedApp.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Application Info */}
                <div className="space-y-6">
                  {/* Basic Loan Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Loan Type</p>
                        <p className="font-medium text-gray-900">{getDisplayLoanType(selectedApp.type || selectedApp.loan_type || 'N/A')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Requested Amount</p>
                        <p className="font-medium text-gray-900 text-lg">₹{Number(selectedApp.amount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Employment Type</p>
                        <p className="font-medium text-gray-900">{(selectedApp.employment || selectedApp.employment_type || 'N/A').charAt(0).toUpperCase() + (selectedApp.employment || selectedApp.employment_type || 'N/A').slice(1).toLowerCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Income</p>
                        <p className="font-medium text-gray-900">₹{Number(selectedApp.income || selectedApp.monthly_income || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Complete Form Details */}
                  {(() => {
                    const formFields = parseAllFormFields(selectedApp.purpose || '');
                    const hasFormData = Object.keys(formFields).length > 0;
                    
                    if (!hasFormData) return null;
                    
                    return (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Application Details</h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {Object.entries(formFields).map(([key, value]) => {
                              if (!value || value === 'N/A' || value === 'None') return null;
                              
                              const displayValue = formatDisplayValue(key, value);
                              
                              return (
                                <div key={key} className="mb-2">
                                  <p className="text-gray-600 font-medium">{key}</p>
                                  <p className="text-gray-900">{displayValue}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Application Submitted</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedApp.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedApp.updated_at && selectedApp.updated_at !== selectedApp.created_at && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Last Updated</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedApp.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={() => setSelectedApp(null)} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Close
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedApp(null);
                      navigate('/apply');
                    }}
                  >
                    Apply for Another Loan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;