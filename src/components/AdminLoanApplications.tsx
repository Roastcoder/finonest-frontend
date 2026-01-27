import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoanApplication {
  id: number;
  mobile: string;
  pan: string;
  pan_name: string;
  credit_score: number;
  vehicle_value: number;
  income: number;
  employment: string;
  application_status: string;
  created_at: string;
  pan_response: any;
  credit_response: any;
  vehicle_response: any;
}

const AdminLoanApplications: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin-applications.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedApp(app)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{app.pan_name}</h3>
                    <p className="text-sm text-gray-600">{app.mobile}</p>
                  </div>
                  <Badge className={getStatusColor(app.application_status)}>
                    {app.application_status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Credit Score: <span className="font-medium">{app.credit_score}</span></div>
                  <div>Income: <span className="font-medium">₹{app.income?.toLocaleString()}</span></div>
                  <div>Vehicle Value: <span className="font-medium">₹{app.vehicle_value?.toLocaleString()}</span></div>
                  <div>Applied: <span className="font-medium">{new Date(app.created_at).toLocaleDateString()}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Details */}
        {selectedApp && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Application Details - {selectedApp.pan_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="credit">Credit</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p>{selectedApp.pan_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mobile</label>
                      <p>{selectedApp.mobile}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">PAN</label>
                      <p>{selectedApp.pan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">DOB</label>
                      <p>{selectedApp.pan_response?.data?.dob}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Income</label>
                      <p>₹{selectedApp.income?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Employment</label>
                      <p>{selectedApp.employment}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="credit" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Credit Score: {selectedApp.credit_score}</h4>
                    {selectedApp.credit_response?.data?.CAIS_Account?.CAIS_Account_DETAILS && (
                      <div className="space-y-2">
                        <h5 className="font-medium">Credit Accounts:</h5>
                        {selectedApp.credit_response.data.CAIS_Account.CAIS_Account_DETAILS.slice(0, 3).map((account: any, index: number) => (
                          <div key={index} className="bg-white p-2 rounded text-sm">
                            <p><strong>Account:</strong> {account.Account_Type}</p>
                            <p><strong>Status:</strong> {account.Account_Status}</p>
                            <p><strong>Balance:</strong> ₹{account.Current_Balance?.toLocaleString()}</p>
                            <p><strong>Subscriber:</strong> {account.Subscriber_Name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedApp.credit_response?.data?.CAIS_Summary && (
                      <div className="mt-4">
                        <h5 className="font-medium">Summary:</h5>
                        <p>Total Accounts: {selectedApp.credit_response.data.CAIS_Summary.Credit_Account?.CreditAccountTotal}</p>
                        <p>Active Accounts: {selectedApp.credit_response.data.CAIS_Summary.Credit_Account?.CreditAccountActive}</p>
                        <p>Outstanding Balance: ₹{selectedApp.credit_response.data.CAIS_Summary.Total_Outstanding_Balance?.Outstanding_Balance_All?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="vehicle" className="space-y-4">
                  {selectedApp.vehicle_response?.data && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">RC Number</label>
                          <p>{selectedApp.vehicle_response.data.rc_number}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Owner</label>
                          <p>{selectedApp.vehicle_response.data.owner_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Make & Model</label>
                          <p>{selectedApp.vehicle_response.data.maker_description} {selectedApp.vehicle_response.data.maker_model}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fuel Type</label>
                          <p>{selectedApp.vehicle_response.data.fuel_type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Registration Date</label>
                          <p>{selectedApp.vehicle_response.data.registration_date}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Market Value</label>
                          <p>₹{selectedApp.vehicle_value?.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedApp.vehicle_response.data.financed && (
                        <div className="bg-yellow-50 p-3 rounded">
                          <h5 className="font-medium text-yellow-800">Existing Finance</h5>
                          <p>Financer: {selectedApp.vehicle_response.data.financer}</p>
                          <p>Status: Currently Financed</p>
                        </div>
                      )}
                      
                      <div className="bg-green-50 p-3 rounded">
                        <h5 className="font-medium text-green-800">Insurance Details</h5>
                        <p>Company: {selectedApp.vehicle_response.data.insurance_company}</p>
                        <p>Valid Until: {selectedApp.vehicle_response.data.insurance_upto}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="raw" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">PAN Response</h5>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(selectedApp.pan_response, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Credit Response</h5>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(selectedApp.credit_response, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Vehicle Response</h5>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(selectedApp.vehicle_response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                <Button variant="destructive">Reject</Button>
                <Button variant="outline">Request Documents</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminLoanApplications;