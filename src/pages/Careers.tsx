import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Clock, 
  DollarSign,
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
          salary: "₹8-12 LPA",
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
          salary: "₹4-6 LPA",
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
          salary: "₹5-8 LPA",
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

  const handleJobClick = (jobId: number) => {
    navigate(`/careers/job/${jobId}`);
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
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleJobClick(job.id)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      {job.image ? (
                        <img 
                          src={job.image} 
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-8 h-8 text-primary/60" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
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
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(job.posted_date).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
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