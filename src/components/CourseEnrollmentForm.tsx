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
    goals: '',
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
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
      if (course.price > 0 && !formData.paymentMethod) {
        toast({
          title: "Error",
          description: "Please select a payment method",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
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
              // When payment is dismissed/failed, create a lead instead
              createLeadForFailedPayment();
            }
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          createLeadForFailedPayment();
          setIsLoading(false);
        });
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

  const createLeadForFailedPayment = async () => {
    try {
      const leadData = {
        form_type: 'course_enrollment_lead',
        form_data: {
          course_id: course.id,
          course_title: course.title,
          course_price: course.price,
          user_name: user?.name || 'Unknown',
          user_email: user?.email || '',
          phone: formData.phone,
          address: formData.address,
          experience: formData.experience,
          goals: formData.goals,
          payment_status: 'failed_or_cancelled',
          lead_source: 'course_enrollment_page'
        }
      };

      const response = await fetch('https://api.finonest.com/api/leads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        toast({
          title: "Interest Recorded",
          description: "We've noted your interest. Our team will contact you soon with enrollment options.",
        });
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
    }
  };

  const enrollUser = async (paymentId?: string) => {
    const enrollmentData = {
      course_id: course.id,
      course_title: course.title,
      amount_paid: course.price,
      payment_method: formData.paymentMethod,
      payment_id: paymentId,
      payment_details: {
        upi_id: formData.upiId,
        card_number: formData.cardNumber ? formData.cardNumber.slice(-4) : null, // Only last 4 digits
        expiry_date: formData.expiryDate
      },
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
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleChange('paymentMethod', value)}
                required
              >
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
                  <SelectItem value="payu-qr">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      PayU QR Code
                    </div>
                  </SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {course.price > 0 && formData.paymentMethod === 'upi' && (
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                value={formData.upiId || ''}
                onChange={(e) => handleChange('upiId', e.target.value)}
                placeholder="yourname@paytm"
                required
              />
            </div>
          )}

          {course.price > 0 && formData.paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={formData.cardNumber || ''}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={formData.expiryDate || ''}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={formData.cvv || ''}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {course.price > 0 && formData.paymentMethod === 'payu-qr' && (
            <div className="text-center space-y-4">
              <Label>Scan QR Code to Pay</Label>
              <div className="flex justify-center">
                <img 
                  src="/assets/image.png" 
                  alt="PayU QR Code" 
                  className="w-64 h-64 border rounded-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code with any UPI app to pay ₹{course.price}
              </p>
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