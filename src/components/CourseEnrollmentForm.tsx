import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { LogIn, CreditCard, Wallet } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  price: number;
  original_price?: number;
}

interface CourseEnrollmentFormProps {
  course: Course;
  onClose?: () => void;
}

export const CourseEnrollmentForm: React.FC<CourseEnrollmentFormProps> = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    paymentMethod: '',
    phone: '',
    address: '',
    experience: '',
    goals: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const { token, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRazorpayKey();
  }, []);

  const fetchRazorpayKey = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/settings/razorpay-key');
      if (response.ok) {
        const data = await response.json();
        setRazorpayKey(data.key || 'rzp_test_default');
      }
    } catch (error) {
      console.error('Failed to fetch Razorpay key:', error);
      setRazorpayKey('rzp_test_default');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (course.price > 0) {
        // For paid courses, initiate Razorpay payment
        const options = {
          key: razorpayKey,
          amount: course.price * 100, // Amount in paise
          currency: 'INR',
          name: 'Finonest',
          description: `Enrollment for ${course.title}`,
          handler: async (response: any) => {
            // Payment successful, now enroll the user
            await enrollUser(response.razorpay_payment_id);
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: formData.phone
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
            }
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Free course, enroll directly
        await enrollUser();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process enrollment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollUser = async (paymentId?: string) => {
    const enrollmentData = {
      course_id: course.id,
      course_title: course.title,
      amount_paid: course.price,
      payment_method: formData.paymentMethod,
      payment_id: paymentId,
      student_info: {
        phone: formData.phone,
        address: formData.address,
        experience: formData.experience,
        goals: formData.goals
      }
    };

    const response = await fetch('https://api.finonest.com/api/forms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        form_type: 'course_enrollment',
        form_data: enrollmentData 
      }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: `Successfully enrolled in ${course.title}`,
      });
      if (onClose) onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
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
            Please login to enroll in this course.
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
        <CardTitle>Enroll in {course.title}</CardTitle>
        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold text-primary">₹{course.price}</span>
          {course.original_price && course.original_price > course.price && (
            <span className="line-through text-muted-foreground">₹{course.original_price}</span>
          )}
          {course.price === 0 && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">FREE</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {course.price > 0 && (
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      UPI Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Financial Experience Level</Label>
            <Select value={formData.experience} onValueChange={(value) => handleChange('experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="goals">Learning Goals</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
              placeholder="What do you hope to achieve from this course?"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Processing...' : course.price === 0 ? 'Enroll for Free' : `Pay ₹${course.price} & Enroll`}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};