import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Phone, Mail, CreditCard, ExternalLink, Calendar } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  mobile: string;
  email: string;
  product_id: number;
  product_name: string;
  product_variant: string;
  product_highlights: string;
  bank_redirect_url: string;
  channel_code: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  created_at: string;
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
      // Fetch from internal API
      const response = await fetch('https://api.finonest.com/api/leads', {
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setLeads(data.data);
        } else if (Array.isArray(data)) {
          setLeads(data);
        }
      }
    } catch (error) {
      console.error('Internal API failed:', error);
    }
    
    setLoading(false);
  };

  const updateLeadStatus = async (leadId: number, status: string) => {
    try {
      const response = await fetch(`https://api.finonest.com/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'X-API-Key': 'lms_8188272ffd90118df860b5e768fe6681',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: status as any } : lead
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
              <div key={lead.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <span className="text-xs text-muted-foreground">#{lead.id}</span>
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
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {lead.product_name} - {lead.product_variant}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {lead.product_highlights && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {lead.product_highlights}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Select 
                      value={lead.status} 
                      onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {lead.bank_redirect_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const urlWithLeadId = `${lead.bank_redirect_url}?lead_id=${lead.id}`;
                          window.open(urlWithLeadId, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Bank
                      </Button>
                    )}
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