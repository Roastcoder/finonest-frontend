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
  IndianRupee, 
  Upload,
  Briefcase,
  Calendar,
  ArrowLeft,
  FileText
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

const JobDetail = () => {
  const { slug } = useParams();
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchJobBySlug(slug);
    }
  }, [slug]);

  const fetchJobBySlug = async (jobSlug: string) => {
    try {
      const response = await fetch(`https://api.finonest.com/api/careers/jobs`);
      if (response.ok) {
        const data = await response.json();
        const jobs = data.jobs || [];
        const foundJob = jobs.find((job: Job) => 
          job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === jobSlug
        );
        if (foundJob) {
          setJob(foundJob);
        } else {
          navigate('/careers');
        }
      } else {
        navigate('/careers');
      }
    } catch (error) {
      console.log('Job API not available');
      navigate('/careers');
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

    setIsSubmitting(true);
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
        const result = await response.json();
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
      } else {
        const error = await response.json();
        toast({
          title: "Submission failed",
          description: error.error || "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.log('Application submission failed:', error);
      toast({
        title: "Submission failed",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center">
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
          <Button 
            variant="outline" 
            onClick={() => navigate('/careers')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Button>

          {!showApplication ? (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-6">
                  {job.image && (
                    <div className="w-full md:w-48 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={job.image} 
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-4">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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
                    <Badge variant="secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      Posted {new Date(job.posted_date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>
                
                {job.requirements && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {job.requirements}
                    </pre>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={() => setShowApplication(true)} 
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Apply for this Position
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                  <label className="text-sm font-medium mb-2 block">Upload CV/Resume *</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors relative">
                    {applicationData.cv_file ? (
                      <div className="space-y-4">
                        <div className="w-32 h-40 mx-auto rounded-lg bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center p-4">
                          <FileText className="w-12 h-12 text-blue-600 mb-2" />
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-700 truncate w-full">
                              {applicationData.cv_file.name.length > 15 
                                ? applicationData.cv_file.name.substring(0, 15) + '...' 
                                : applicationData.cv_file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {applicationData.cv_file.type.includes('pdf') ? 'PDF' : 
                               applicationData.cv_file.type.includes('word') ? 'DOC' : 'Document'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(applicationData.cv_file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600 mb-2">
                            File uploaded successfully!
                          </p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setApplicationData(prev => ({ ...prev, cv_file: null }))}
                          >
                            Remove File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Click to upload your CV/Resume</p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={submitApplication} 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApplication(false)}
                    disabled={isSubmitting}
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

export default JobDetail;