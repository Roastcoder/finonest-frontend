import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Upload,
  Briefcase,
  Calendar,
  ArrowLeft
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

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
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
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`https://api.finonest.com/api/careers/jobs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      }
    } catch (error) {
      console.log('Job API not available');
    } finally {
      setLoading(false);
    }
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
    formData.append('job_id', job?.id.toString() || '');
    formData.append('name', applicationData.name);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    formData.append('experience', applicationData.experience);
    formData.append('cover_letter', applicationData.cover_letter);
    formData.append('cv_file', applicationData.cv_file);

    try {
      const response = await fetch('https://api.finonest.com/api/careers/apply', {
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
      console.log('Application submission failed:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later or contact support",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <Button onClick={() => navigate('/careers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 pt-20">
        <div className="container mx-auto px-4 py-8">
          {!showApplication ? (
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={() => navigate('/careers')}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Jobs
              </Button>

              {/* Job Header */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex gap-6">
                    {job.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={job.image} 
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                      <div className="flex flex-wrap gap-6 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          {job.salary}
                        </div>
                      </div>
                      <Badge variant="secondary" className="mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {new Date(job.posted_date).toLocaleDateString()}
                      </Badge>
                      <Button 
                        onClick={() => setShowApplication(true)}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Apply for this Position
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <div className="grid gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {job.requirements}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Application Form */
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Apply for {job.title}</CardTitle>
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
      <Footer />
    </>
  );
};

export default JobDetails;