import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, User, Car, CreditCard, Download, FileText, TrendingUp, Shield, Activity, Search, Calendar, Filter, RefreshCw, Phone, Mail, CreditCard as CreditCardIcon } from "lucide-react";

interface LoanApplication {
  id: number;
  application_id: string;
  mobile: string;
  email: string;
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
  vehicle_color: string;
  owner_name: string;
  vehicle_value: number;
  income: number;
  employment: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  step_completed: number;
  created_at: string;
  updated_at: string;
  pan_response?: string;
  credit_response?: string;
  vehicle_response?: string;
}

interface FormattedLoanData {
  success: boolean;
  application_id: number;
  timestamp: string;
  vehicle_info: {
    title: string;
    registration_number: string;
    registration_date: string;
    details: string;
    color_fuel: string;
    owner: string;
    market_value: string;
    data_source: string;
  };
  credit_analysis: {
    score: number;
    max_score: number;
    rating: string;
    last_updated: string;
    verified: boolean;
  };
  financer_info: {
    rc_financer: string;
    source: string;
    cibil_match: boolean;
    match_message: string;
  };
  account_summary: {
    secured_loans: { count: number; total: string };
    unsecured_loans: { count: number; total: string };
    auto_loans: { count: number; total: string };
  };
  auto_loan_details?: {
    sanctioned_amount: string;
    principal_outstanding: string;
    overdue_amount: string;
    account_open_date: string;
    payment_history: string[];
    payment_record: string;
  };
  credit_overview: {
    outstanding_balance: string;
    active_accounts: number;
    monthly_emi: string;
    highest_sanction: string;
    overdue_accounts: number;
    dpd_count: number;
  };
  enquiry_history: {
    last_30_days: { total: number; auto_loans: number; others: number };
    last_60_days: { total: number; auto_loans: number; others: number };
    last_90_days: { total: number; auto_loans: number; others: number };
  };
  verification_status: {
    pan_verified: boolean;
    credit_verified: boolean;
    vehicle_verified: boolean;
  };
}

const AdminLoanOnboarding = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [formattedData, setFormattedData] = useState<FormattedLoanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, sortBy]);

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.pan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.mobile?.includes(searchTerm) ||
        app.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return (a.pan_name || '').localeCompare(b.pan_name || '');
        case 'credit_score':
          return (b.credit_score || 0) - (a.credit_score || 0);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin-loan-onboarding.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        toast({
          title: "Success",
          description: `Loaded ${data.applications?.length || 0} applications`,
        });
      } else {
        throw new Error('Failed to fetch applications');
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

  const fetchFormattedData = async (applicationId: number) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`https://api.finonest.com/api/loan-onboarding-result.php?id=${applicationId}`);
      if (response.ok) {
        const data = await response.json();
        setFormattedData(data);
      } else {
        throw new Error('Failed to fetch formatted data');
      }
    } catch (error) {
      console.error('Failed to fetch formatted data:', error);
      setFormattedData(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (app: LoanApplication) => {
    setSelectedApp(app);
    fetchFormattedData(app.id);
  };

  const downloadReport = async (applicationId: number, format: 'txt' | 'pdf') => {
    try {
      if (format === 'pdf') {
        const response = await fetch(`https://api.finonest.com/api/loan-onboarding-pdf.php?id=${applicationId}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Finonest_Report_${applicationId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } else {
        const response = await fetch(`https://api.finonest.com/api/loan-onboarding-result.php?id=${applicationId}`);
        const data = await response.json();
        
        if (data.success) {
          const content = `FINONEST INDIA PVT LTD\nAdmin Loan Report\n\nApplication ID: ${data.application_id}\nGenerated: ${new Date().toLocaleString()}\n\n=== VEHICLE INFORMATION ===\n${data.vehicle_info.title}\nRegistration Number: ${data.vehicle_info.registration_number}\nRegistration Date: ${data.vehicle_info.registration_date}\nVehicle Details: ${data.vehicle_info.details}\n${data.vehicle_info.color_fuel}\nOwner: ${data.vehicle_info.owner}\nMarket Value: ${data.vehicle_info.market_value}\n\n=== CREDIT SCORE ANALYSIS ===\nCredit Score: ${data.credit_analysis.score}/${data.credit_analysis.max_score}\nRating: ${data.credit_analysis.rating}\nLast Updated: ${data.credit_analysis.last_updated}\n\n=== FINANCER INFORMATION ===\nRC Document Financer: ${data.financer_info.rc_financer}\nCIBIL Credit Match: ${data.financer_info.cibil_match ? 'Yes' : 'No'}\n\n=== ACCOUNT SUMMARY ===\nSecured Loans: ${data.account_summary.secured_loans.count} (${data.account_summary.secured_loans.total})\nUnsecured Loans: ${data.account_summary.unsecured_loans.count} (${data.account_summary.unsecured_loans.total})\nAuto Loans: ${data.account_summary.auto_loans.count} (${data.account_summary.auto_loans.total})\n\n=== CREDIT OVERVIEW ===\nOutstanding Balance: ${data.credit_overview.outstanding_balance}\nActive Accounts: ${data.credit_overview.active_accounts}\nMonthly EMI: ${data.credit_overview.monthly_emi}\nHighest Sanction: ${data.credit_overview.highest_sanction}\n\nThank you for using Finonest Admin Panel!`;
          
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Finonest_Admin_Report_${applicationId}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to download ${format.toUpperCase()} report`,
        variant: "destructive",
      });
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
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Approved</p>
                <p className="text-2xl font-bold">{applications.filter(app => app.status === 'approved').length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{applications.filter(app => app.status === 'pending').length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Credit Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(applications.filter(app => app.credit_score).reduce((sum, app) => sum + (app.credit_score || 0), 0) / applications.filter(app => app.credit_score).length) || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Loan Applications ({filteredApplications.length})
            </span>
            <Button onClick={fetchApplications} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, mobile, PAN, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="credit_score">Credit Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg mb-2">No applications found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-blue-500" onClick={() => handleViewDetails(app)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {app.pan_name || app.mobile}
                      </CardTitle>
                      <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`${getStatusColor(app.status)} text-white font-medium`}>
                        {app.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {getStepProgress(app.step_completed)}
                      </Badge>
                      {app.credit_score && (
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          Score: {app.credit_score}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{app.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className={app.email ? 'text-gray-700' : 'text-gray-400 italic'}>
                        {app.email || 'No email'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCardIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-mono">{app.pan}</span>
                    </div>
                    {app.vehicle_model && (
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{app.vehicle_make} {app.vehicle_model} ({app.vehicle_year})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {app.vehicle_value && (
                        <span className="text-xs font-semibold text-green-600">
                          ₹{app.vehicle_value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => { setSelectedApp(null); setFormattedData(null); }}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                    {selectedApp?.pan_name || selectedApp?.mobile}
                  </DialogTitle>
                  <p className="text-xs sm:text-sm text-gray-500">Application ID: {selectedApp?.application_id || selectedApp?.id}</p>
                  {selectedApp?.vehicle_make && selectedApp?.vehicle_model && (
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">
                      {selectedApp.vehicle_make} {selectedApp.vehicle_model} ({selectedApp.vehicle_year}) • {selectedApp.fuel_type} • {selectedApp.vehicle_color}
                    </p>
                  )}
                  {selectedApp?.vehicle_rc && (
                    <p className="text-xs sm:text-sm text-green-600 font-mono">
                      RC: {selectedApp.vehicle_rc} • Owner: {selectedApp.owner_name || selectedApp.pan_name}
                    </p>
                  )}
                  {selectedApp?.email && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      📧 {selectedApp.email} • 📞 {selectedApp.mobile} • PAN: {selectedApp.pan}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedApp && (
                  <Badge className={`${getStatusColor(selectedApp.status)} text-white px-2 sm:px-3 py-1 text-xs`}>
                    {selectedApp.status.toUpperCase()}
                  </Badge>
                )}
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectedApp && downloadReport(selectedApp.id, 'txt')}
                    className="hover:bg-blue-50 text-xs px-2 sm:px-3"
                  >
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">TXT</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectedApp && downloadReport(selectedApp.id, 'pdf')}
                    className="hover:bg-green-50 text-xs px-2 sm:px-3"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Applied:</span>
                {selectedApp && new Date(selectedApp.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Step:</span>
                {selectedApp && getStepProgress(selectedApp.step_completed)}
              </span>
              {selectedApp?.credit_score && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Score:</span>
                  {selectedApp.credit_score}
                </span>
              )}
              {selectedApp?.vehicle_value && (
                <span className="flex items-center gap-1">
                  <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Value:</span>
                  ₹{selectedApp.vehicle_value.toLocaleString()}
                </span>
              )}
              {selectedApp?.income && (
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Income:</span>
                  ₹{selectedApp.income.toLocaleString()}
                </span>
              )}
              {selectedApp?.dob && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">DOB:</span>
                  {new Date(selectedApp.dob).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
              {selectedApp?.gender && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Gender:</span>
                  {selectedApp.gender === 'M' ? 'Male' : selectedApp.gender === 'F' ? 'Female' : selectedApp.gender}
                </span>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {detailsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">Loading detailed report...</p>
                  <p className="text-sm text-gray-500 mt-1">Analyzing credit and vehicle data</p>
                </div>
              </div>
            ) : formattedData ? (
              <div className="space-y-6 px-1">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Credit Score</p>
                        <p className="text-2xl font-bold">{formattedData.credit_analysis.score}</p>
                        <p className="text-blue-100 text-xs">{formattedData.credit_analysis.rating}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Vehicle Value</p>
                        <p className="text-2xl font-bold">{formattedData.vehicle_info.market_value}</p>
                        <p className="text-green-100 text-xs">Market Price</p>
                      </div>
                      <Car className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Active Accounts</p>
                        <p className="text-2xl font-bold">{formattedData.credit_overview.active_accounts}</p>
                        <p className="text-purple-100 text-xs">Credit Accounts</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Monthly EMI</p>
                        <p className="text-2xl font-bold">{formattedData.credit_overview.monthly_emi}</p>
                        <p className="text-orange-100 text-xs">Current EMI</p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>
                {/* Vehicle Information - Enhanced */}
                <Card className="shadow-xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <CardTitle className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Vehicle Information</h3>
                        <p className="text-blue-100 text-sm font-normal">{formattedData.vehicle_info.details}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-blue-600 mb-1">Registration Number</p>
                          <p className="font-bold text-xl text-gray-800">{formattedData.vehicle_info.registration_number}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-blue-600 mb-1">Registration Date</p>
                          <p className="font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            {formattedData.vehicle_info.registration_date}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-blue-600 mb-1">Vehicle Details</p>
                          <p className="font-bold text-lg text-gray-800">{formattedData.vehicle_info.details}</p>
                          <p className="text-sm text-gray-600 mt-1">{formattedData.vehicle_info.color_fuel}</p>
                          <p className="text-sm text-blue-600 mt-1">Owner: {formattedData.vehicle_info.owner}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                          <p className="text-green-100 text-sm font-medium">Market Value</p>
                          <p className="text-2xl font-bold">{formattedData.vehicle_info.market_value}</p>
                          <p className="text-green-100 text-xs mt-1">{formattedData.vehicle_info.data_source}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Score Analysis - Enhanced */}
                <Card className="shadow-xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <CardTitle className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Credit Score Analysis</h3>
                        <p className="text-purple-100 text-sm font-normal">{formattedData.credit_analysis.rating} Credit Rating</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 bg-gradient-to-br from-purple-50 to-white">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-48 h-48 relative">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="transparent"
                              className="text-gray-200"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray={`${(formattedData.credit_analysis.score / formattedData.credit_analysis.max_score) * 251.2} 251.2`}
                              className="text-purple-600 transition-all duration-1000"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-purple-600">{formattedData.credit_analysis.score}</span>
                            <span className="text-sm text-gray-600">/{formattedData.credit_analysis.max_score}</span>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                            <Shield className="w-4 h-4" />
                            {formattedData.credit_analysis.rating}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Last updated: {formattedData.credit_analysis.last_updated}</p>
                          <div className="inline-flex items-center gap-1 text-green-600 text-sm mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Real Bureau Data
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Financer Information - Enhanced */}
                <Card className="shadow-xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <CardTitle className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Vehicle Financer Information</h3>
                        <p className="text-emerald-100 text-sm font-normal">{formattedData.financer_info.rc_financer}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                        <p className="text-sm font-medium text-emerald-600 mb-2">RC Document Financer</p>
                        <p className="font-bold text-xl text-gray-800">{formattedData.financer_info.rc_financer}</p>
                        <p className="text-sm text-gray-600 mt-1">{formattedData.financer_info.source}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                        <p className="text-sm font-medium text-emerald-600 mb-2">CIBIL Credit Match</p>
                        <p className={`font-semibold text-lg ${formattedData.financer_info.cibil_match ? 'text-green-600' : 'text-gray-600'}`}>
                          {formattedData.financer_info.cibil_match ? '✓ Match Found' : '✗ No Match'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{formattedData.financer_info.match_message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* Account Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Secured Loans</p>
                      <p className="text-2xl font-bold">{formattedData.account_summary.secured_loans.count}</p>
                      <p className="text-sm text-gray-600">Total: {formattedData.account_summary.secured_loans.total}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Unsecured Loans</p>
                      <p className="text-2xl font-bold">{formattedData.account_summary.unsecured_loans.count}</p>
                      <p className="text-sm text-gray-600">Total: {formattedData.account_summary.unsecured_loans.total}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Auto Loans</p>
                      <p className="text-2xl font-bold">{formattedData.account_summary.auto_loans.count}</p>
                      <p className="text-sm text-gray-600">Total: {formattedData.account_summary.auto_loans.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auto Loan Details */}
              {formattedData.auto_loan_details && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardTitle>Auto Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sanctioned Amount</p>
                        <p className="font-bold text-xl">{formattedData.auto_loan_details.sanctioned_amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Principal Outstanding</p>
                        <p className="font-bold text-xl">{formattedData.auto_loan_details.principal_outstanding}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                        <p className="font-bold text-xl">{formattedData.auto_loan_details.overdue_amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Account Open Date</p>
                        <p className="font-bold text-lg">{formattedData.auto_loan_details.account_open_date}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Payment History (Last 6 months)</p>
                      <div className="flex gap-2">
                        {formattedData.auto_loan_details.payment_history.map((_, index) => (
                          <div key={index} className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-green-600 mt-2">{formattedData.auto_loan_details.payment_record}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Credit Overview */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Credit Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.outstanding_balance}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.active_accounts}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly EMI</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.monthly_emi}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Highest Sanction</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.highest_sanction}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overdue Accounts</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.overdue_accounts}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">DPD Count</p>
                      <p className="font-bold text-xl">{formattedData.credit_overview.dpd_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Enquiry History */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Credit Enquiry History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">Last 30 Days</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Enquiries</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_30_days.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Auto Loans</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_30_days.auto_loans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Others</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_30_days.others}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">Last 60 Days</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Enquiries</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_60_days.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Auto Loans</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_60_days.auto_loans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Others</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_60_days.others}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">Last 90 Days</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Enquiries</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_90_days.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Auto Loans</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_90_days.auto_loans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Others</span>
                          <span className="font-bold">{formattedData.enquiry_history.last_90_days.others}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            ) : selectedApp && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Unable to load detailed report</p>
                <p className="text-gray-500 mb-6">Showing basic application information</p>
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                  <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-800">{selectedApp.pan_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Mobile:</span>
                      <span className="text-gray-800">{selectedApp.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">PAN:</span>
                      <span className="text-gray-800 font-mono">{selectedApp.pan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Credit Score:</span>
                      <span className="text-gray-800 font-bold">{selectedApp.credit_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Vehicle:</span>
                      <span className="text-gray-800">{selectedApp.vehicle_make} {selectedApp.vehicle_model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">RC:</span>
                      <span className="text-gray-800 font-mono">{selectedApp.vehicle_rc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoanOnboarding;