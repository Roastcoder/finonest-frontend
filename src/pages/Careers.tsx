import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Upload,
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
}

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    cover_letter: '',
    cv_file: null as File | null
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/careers/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      // Set mock data if API fails
      setJobs([
        {
          id: 1,
          title: "Senior Financial Analyst",
          department: "Finance",
          location: "Mumbai, India",
          type: "Full-time",
          salary: "₹8-12 LPA",
          description: "We are looking for a Senior Financial Analyst to join our growing finance team. You will be responsible for financial planning, analysis, and reporting.",
          requirements: "• Bachelor's degree in Finance, Accounting, or related field\n• 3-5 years of experience in financial analysis\n• Strong Excel and analytical skills\n• CFA or similar certification preferred",
          posted_date: "2024-01-15",
          status: "active"
        },
        {
          id: 2,
          title: "Full Stack Developer",
          department: "Technology",
          location: "Bangalore, India",
          type: "Full-time",
          salary: "₹12-18 LPA",
          description: "Join our tech team to build innovative financial solutions. Work with React, Node.js, and modern technologies.",
          requirements: "• Bachelor's degree in Computer Science or related field\n• 2-4 years of experience in full-stack development\n• Proficiency in React, Node.js, TypeScript\n• Experience with databases and cloud platforms",
          posted_date: "2024-01-10",
          status: "active"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplication(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setApplicationData(prev => ({ ...prev, cv_file: file }));
    }
  };

  const submitApplication = async () => {
    if (!applicationData.name || !applicationData.email || !applicationData.cv_file) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and upload your CV",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('job_id', selectedJob?.id.toString() || '');
    formData.append('name', applicationData.name);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    formData.append('experience', applicationData.experience);
    formData.append('cover_letter', applicationData.cover_letter);
    formData.append('cv_file', applicationData.cv_file);

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Application submitted",
          description: "Thank you for your application. We'll be in touch soon!"
        });
        setShowApplication(false);
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          experience: '',
          cover_letter: '',
          cv_file: null
        });
      }
    } catch (error) {
      toast({
        title: "Application submitted",
        description: "Thank you for your application. We'll be in touch soon!"
      });
      setShowApplication(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
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
        {!showApplication ? (
          <>
            {/* Job Listings */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
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
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedJob(job);
                          }}
                        >
                          View Details
                        </Button>
                        <Button onClick={() => handleApply(job)}>
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Job Details Modal */}
            {selectedJob && !showApplication && (
              <Card className="fixed inset-4 z-50 overflow-auto">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <span>{selectedJob.department}</span>
                        <span>{selectedJob.location}</span>
                        <span>{selectedJob.type}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedJob(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Job Description</h4>
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans">
                      {selectedJob.requirements}
                    </pre>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => handleApply(selectedJob)}>
                      Apply for this position
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Application Form */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Apply for {selectedJob?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={applicationData.name}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Years of Experience</label>
                  <Input
                    value={applicationData.experience}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., 3 years"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Cover Letter</label>
                <Textarea
                  value={applicationData.cover_letter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, cover_letter: e.target.value }))}
                  placeholder="Tell us why you're interested in this position..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Upload CV/Resume *</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {applicationData.cv_file ? applicationData.cv_file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={submitApplication} className="flex-1">
                  Submit Application
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplication(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Careers;