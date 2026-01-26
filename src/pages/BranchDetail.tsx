import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Clock, Mail, Navigation, User } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  manager_name?: string;
  working_hours: string;
  status: string;
}

const BranchDetail = () => {
  const { branchName } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranch();
  }, [branchName]);

  const fetchBranch = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/branches');
      const data = await response.json();
      if (response.ok) {
        const branches = data.branches || [];
        const foundBranch = branches.find((b: Branch) => 
          b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === branchName?.toLowerCase()
        );
        setBranch(foundBranch || null);
      }
    } catch (error) {
      console.error('Failed to fetch branch:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (branch) {
      const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading branch details...</div>
        </div>
      </>
    );
  }

  if (!branch) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Branch Not Found</h1>
            <p className="text-muted-foreground mb-6">The branch you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/branches')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Branches
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{branch.name} | Finonest Branch</title>
        <meta name="description" content={`Visit our ${branch.name} located at ${branch.address}, ${branch.city}, ${branch.state} for all your financial needs.`} />
        <meta name="keywords" content={`finonest ${branch.name.toLowerCase()}, loans, financial services, ${branch.city}, ${branch.state}`} />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/branches')}
            className="mb-6 hover:bg-blue-50 text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Branches
          </Button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{branch.name}</h1>
              <p className="text-blue-100 text-lg">{branch.city}, {branch.state}</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">{branch.address}, {branch.city}, {branch.state} - {branch.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">{branch.working_hours}</p>
                    </div>
                  </div>

                

                  {branch.email && (
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a href={`mailto:${branch.email}`} className="text-purple-600 hover:underline">
                          {branch.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {branch.manager_name && (
                    <div className="flex items-start gap-4">
                      <User className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Branch Manager</h3>
                        <p className="text-gray-600">{branch.manager_name}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={openInMaps}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Our Services</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Home Loans', 'Personal Loans', 'Business Loans', 'Car Loans', 'Credit Cards', 'Loan Against Property'].map((service, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
                        <span className="text-sm font-medium text-gray-800">{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-4 text-xl">Contact Us</h3>
                    <div className="space-y-3">
                      {branch.phone && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`tel:${branch.phone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </a>
                        </Button>
                      )}
                      {branch.email && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`mailto:${branch.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default BranchDetail;