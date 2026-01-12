import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    income: '',
    employment: '',
    purpose: '',
    documents: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();
  const { toast } = useToast();

  // Load saved form data on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('applicationFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('applicationFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://api.finonest.com:4000/api/forms/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form_data: formData }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application submitted successfully",
        });
        setFormData({
          loanType: '',
          amount: '',
          income: '',
          employment: '',
          purpose: '',
          documents: ''
        });
        // Clear saved form data after successful submission
        localStorage.removeItem('applicationFormData');
        // Scroll to top after successful submission
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!token || !user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <LogIn className="w-16 h-16 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            Please login to submit a loan application.
          </p>
          <Link to="/auth">
            <Button className="w-full">
              Login / Register
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Loan Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="loanType">Loan Type</Label>
            <Select value={formData.loanType} onValueChange={(value) => handleChange('loanType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="home">Home Loan</SelectItem>
                <SelectItem value="car">Car Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Loan Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="income">Monthly Income</Label>
            <Input
              id="income"
              type="number"
              value={formData.income}
              onChange={(e) => handleChange('income', e.target.value)}
              placeholder="Enter monthly income"
              required
            />
          </div>

          <div>
            <Label htmlFor="employment">Employment Type</Label>
            <Select value={formData.employment} onValueChange={(value) => handleChange('employment', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Describe the purpose of the loan"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};