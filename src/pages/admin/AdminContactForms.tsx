import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Users } from "lucide-react";

interface ContactForm {
  id: number;
  name: string;
  phone: string;
  email: string;
  loan_type: string;
  amount: string;
  consent_terms: boolean;
  consent_data_processing: boolean;
  consent_communication: boolean;
  consent_marketing: boolean;
  created_at: string;
}

const AdminContactForms = () => {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchContactForms();
    }
  }, [token]);

  const fetchContactForms = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin/contact-forms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContactForms(data.forms || []);
      }
    } catch (error) {
      console.error('Failed to fetch contact forms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions ({contactForms.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : contactForms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contact forms found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contactForms.map((form) => (
              <div key={form.id} className="border p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{form.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Phone:</strong> {form.phone}</p>
                      <p><strong>Email:</strong> {form.email}</p>
                      <p><strong>Date:</strong> {new Date(form.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Loan Type:</strong> {form.loan_type}</p>
                      <p><strong>Amount:</strong> ₹{form.amount}</p>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Consents:</p>
                        <div className="flex flex-wrap gap-1">
                          {form.consent_terms && <Badge variant="outline" className="text-xs">Terms</Badge>}
                          {form.consent_data_processing && <Badge variant="outline" className="text-xs">Data</Badge>}
                          {form.consent_communication && <Badge variant="outline" className="text-xs">Communication</Badge>}
                          {form.consent_marketing && <Badge variant="outline" className="text-xs">Marketing</Badge>}
                        </div>
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

export default AdminContactForms;