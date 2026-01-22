import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Clock, 
  IndianRupee,
  Briefcase,
  Calendar
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  posted_date: string;
  status: string;
  image?: string;
}

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/careers/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.log('Jobs API not available, using sample data');
      // Fallback sample jobs
      setJobs([
        {
          id: 1,
          title: "Senior Financial Advisor",
          department: "Finance",
          location: "Mumbai, India",
          type: "Full-time",
          salary: "₹8,00,000 - ₹12,00,000 per annum",
          description: "Join our team as a Senior Financial Advisor and help clients achieve their financial goals. You will provide expert advice on investments, loans, and financial planning.",
          requirements: "Bachelor's degree in Finance, 3+ years experience",
          posted_date: "2024-01-15",
          status: "active"
        },
        {
          id: 2,
          title: "Loan Processing Executive",
          department: "Operations",
          location: "Delhi, India",
          type: "Full-time",
          salary: "₹4,00,000 - ₹6,00,000 per annum",
          description: "We are looking for a detail-oriented Loan Processing Executive to handle loan applications, documentation, and customer service.",
          requirements: "Bachelor's degree, 1-2 years banking experience",
          posted_date: "2024-01-10",
          status: "active"
        },
        {
          id: 3,
          title: "Digital Marketing Specialist",
          department: "Marketing",
          location: "Bangalore, India",
          type: "Full-time",
          salary: "₹5,00,000 - ₹8,00,000 per annum",
          description: "Drive our digital marketing initiatives and help grow our online presence. You will manage social media, content marketing, and digital campaigns.",
          requirements: "Marketing degree, 2+ years digital marketing experience",
          posted_date: "2024-01-08",
          status: "active"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createJobSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleJobClick = (job: Job) => {
    const slug = createJobSlug(job.title);
    navigate(`/careers/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Build your career with Finonest and help shape the future of financial services
            </p>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        {/* Job Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => handleJobClick(job)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      {job.image ? (
                        <img 
                          src={job.image} 
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-12 h-12 text-primary/60" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-3">{job.title}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {job.salary}
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(job.posted_date).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Careers;