import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Users, Phone, Mail, CreditCard, ExternalLink, Calendar } from "lucide-react";

interface Lead {
  id?: number;
  lead_id?: string;
  name?: string;
  customer_name?: string;
  email: string;
  mobile: string;
  status: string;
  created_at: string;
  product_name?: string;
  product_variant?: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // First try local admin API
      const localResponse = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log('Local API Response:', localData);
        if (localData.success && localData.leads && Array.isArray(localData.leads)) {
          console.log('Setting leads from local API:', localData.leads);
          setLeads(localData.leads);
          setLoading(false);
          return;
        }
      }

      // Fallback to external cards API
      const response = await fetch('https://cards.finonest.com/api/leads?channel_code=PARTNER_001', {
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('External API Response:', data);
        if (data.status === 200 && data.data && Array.isArray(data.data)) {
          console.log('Setting leads from external API:', data.data);
          setLeads(data.data);
        } else if (Array.isArray(data)) {
          setLeads(data);
        }
      } else {
        console.log('External API Response not OK:', response.status);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
    
    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch(`https://cards.finonest.com/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.lead_id === leadId ? { ...lead, status } : lead
        ));
        toast({
          title: "Success",
          description: "Lead status updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading applications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Credit Card Applications ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="text-muted-foreground">No applications found.</p>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id || lead.lead_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{lead.name || lead.customer_name}</h3>
                      <span className="text-xs text-muted-foreground">#{lead.id || lead.lead_id}</span>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.mobile}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      {(lead.product_name || lead.product_variant) && (
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {lead.product_name} {lead.product_variant && `- ${lead.product_variant}`}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLeads;