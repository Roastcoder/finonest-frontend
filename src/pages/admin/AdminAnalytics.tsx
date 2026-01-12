import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Application {
  id: number;
  status: string;
  created_at: string;
}

interface ContactForm {
  id: number;
  created_at: string;
}

const AdminAnalytics = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [appsRes, contactsRes] = await Promise.all([
        fetch('http://api.finonest.com:4000/api/admin/forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://api.finonest.com:4000/api/admin/contact-forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      }
      
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContactForms(contactsData.forms || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const stats = [
    { title: 'Total Applications', value: applications.length.toString(), change: '+0%' },
    { title: 'Contact Forms', value: contactForms.length.toString(), change: '+0%' },
    { title: 'Approved Loans', value: applications.filter(app => app.status === 'APPROVED').length.toString(), change: '+0%' },
    { title: 'Pending Reviews', value: applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length.toString(), change: '+0%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Badge variant="secondary">{stat.change}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">test@example.com joined</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">System started</p>
                <p className="text-xs text-muted-foreground">Admin panel initialized</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;