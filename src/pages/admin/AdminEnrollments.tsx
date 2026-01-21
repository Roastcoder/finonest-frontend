import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Eye, Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  course_title: string;
  amount_paid: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_id?: string;
  payment_details?: {
    upi_id?: string;
    card_number?: string;
    expiry_date?: string;
  };
  student_info: {
    phone: string;
    address: string;
    experience: string;
    goals: string;
  };
  enrollment_date: string;
  status: 'active' | 'completed' | 'cancelled';
  user_name?: string;
  user_email?: string;
}

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        toast({
          title: "Error",
          description: `Server error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
        return;
      }

      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        const text = await response.text();
        console.error('Response text:', text.substring(0, 200));
        toast({
          title: "Error",
          description: "Server returned invalid response format",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      setEnrollments(data.enrollments || []);
      
    } catch (error) {
      console.error('Network Error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollmentStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`https://api.finonest.com/api/enrollments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Enrollment status updated",
        });
        fetchEnrollments();
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
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
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    if (filter === 'paid') return enrollment.amount_paid > 0;
    if (filter === 'free') return enrollment.amount_paid === 0;
    return enrollment.payment_status === filter;
  });

  const exportToCSV = () => {
    const headers = ['Course', 'Student', 'Email', 'Phone', 'Amount', 'Payment Status', 'Enrollment Date'];
    const csvData = filteredEnrollments.map(e => [
      e.course_title,
      e.user_name || 'N/A',
      e.user_email || 'N/A',
      e.student_info.phone,
      `₹${e.amount_paid}`,
      e.payment_status,
      new Date(e.enrollment_date).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_enrollments.csv';
    a.click();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading enrollments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Course Enrollments ({filteredEnrollments.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Enrollments</SelectItem>
                  <SelectItem value="paid">Paid Courses</SelectItem>
                  <SelectItem value="free">Free Courses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length === 0 ? (
            <p>No enrollments found.</p>
          ) : (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="border p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg break-words">{enrollment.course_title}</h3>
                      <p className="text-sm text-muted-foreground break-words">
                        Student: {enrollment.user_name || 'N/A'} ({enrollment.user_email || 'N/A'})
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(enrollment.payment_status)}>
                        {enrollment.payment_status}
                      </Badge>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="space-y-1">
                      <p><strong>Phone:</strong> <span className="break-all">{enrollment.student_info.phone}</span></p>
                      <p><strong>Experience:</strong> {enrollment.student_info.experience}</p>
                      <p><strong>Amount:</strong> ₹{enrollment.amount_paid}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Payment Method:</strong> {enrollment.payment_method || 'N/A'}</p>
                      {enrollment.payment_details?.upi_id && (
                        <p><strong>UPI ID:</strong> {enrollment.payment_details.upi_id}</p>
                      )}
                      {enrollment.payment_details?.card_number && (
                        <p><strong>Card:</strong> ****{enrollment.payment_details.card_number}</p>
                      )}
                      <p><strong>Enrolled:</strong> {new Date(enrollment.enrollment_date).toLocaleDateString()}</p>
                      {enrollment.payment_id && (
                        <p><strong>Payment ID:</strong> <span className="break-all text-xs">{enrollment.payment_id}</span></p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3 pt-3 border-t">
                    <p className="text-sm break-words"><strong>Goals:</strong> {enrollment.student_info.goals}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select 
                      value={enrollment.status} 
                      onValueChange={(value) => updateEnrollmentStatus(enrollment.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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

export default AdminEnrollments;