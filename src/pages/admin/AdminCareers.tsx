import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Users,
  Briefcase,
  Calendar,
  MapPin
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

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  cover_letter: string;
  cv_filename: string;
  applied_date: string;
  status: string;
}

const AdminCareers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const { token } = useAuth();
  const { toast } = useToast();

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    features: [''],
    image: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addFeature = () => setJobForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  const removeFeature = (index: number) => setJobForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  const updateFeature = (index: number, value: string) => setJobForm(prev => ({ ...prev, features: prev.features.map((f, i) => i === index ? value : f) }));

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/careers/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response Data:', data);
        setJobs(data.jobs || []);
      } else {
        console.error('API Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Jobs API Error:', error);
      // Fallback: Create sample job data for testing
      setJobs([
        {
          id: 1,
          title: "Senior Financial Analyst",
          department: "Finance",
          location: "Mumbai, India",
          type: "Full-time",
          salary: "₹8,00,000 - ₹12,00,000 per annum",
          description: "We are looking for a Senior Financial Analyst to join our growing team.",
          requirements: "• Bachelor's degree in Finance\n• 3+ years experience\n• Strong analytical skills",
          posted_date: "2024-01-15",
          status: "active"
        }
      ]);
    }
  };

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      const response = await fetch('https://api.finonest.com/api/careers/applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Applications API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Applications API Response Data:', data);
        setApplications(data.applications || []);
      } else {
        console.error('Applications API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Applications API Error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      // Fallback: Empty applications for now
      setApplications([]);
    }
  };

  const handleJobSubmit = async () => {
    if (!jobForm.title || !jobForm.department || !jobForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', jobForm.title);
      formData.append('department', jobForm.department);
      formData.append('location', jobForm.location);
      formData.append('type', jobForm.type);
      formData.append('salary', jobForm.salary);
      formData.append('description', jobForm.description);
      formData.append('requirements', jobForm.requirements);
      
      if (jobForm.image) {
        formData.append('image', jobForm.image);
      }
      
      const url = editingJob 
        ? `https://api.finonest.com/api/careers/jobs/${editingJob.id}`
        : 'https://api.finonest.com/api/careers/jobs';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: editingJob ? "Job updated" : "Job posted",
          description: "Job has been saved successfully"
        });
        fetchJobs();
        resetJobForm();
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = "Please try again later";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          // If it's not JSON, it's likely a PHP error
          if (errorText.includes('<br />')) {
            errorMessage = "Server error occurred. Please check the server logs.";
          }
        }
        
        toast({
          title: "Operation failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.log('Job creation/update failed:', error);
      toast({
        title: "Operation failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      features: [''],
      image: null
    });
    setImagePreview(null);
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditJob = (job: Job) => {
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
      features: [''],
      image: null
    });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await fetch(`https://api.finonest.com/api/careers/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast({
        title: "Job deleted",
        description: "Job has been removed successfully"
      });
      fetchJobs();
    } catch (error) {
      console.log('Job deletion failed:', error);
      toast({
        title: "Deletion failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      await fetch(`https://api.finonest.com/api/careers/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      toast({
        title: "Status updated",
        description: `Application marked as ${status}`
      });
      fetchApplications();
    } catch (error) {
      console.log('Status update failed:', error);
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (applicationId: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await fetch(`https://api.finonest.com/api/careers/applications/${applicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast({
        title: "Application deleted",
        description: "Application has been removed successfully"
      });
      fetchApplications();
    } catch (error) {
      console.log('Application deletion failed:', error);
      toast({
        title: "Deletion failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Career Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={activeTab === 'jobs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('jobs')}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Jobs</span> ({jobs.length})
          </Button>
          <Button
            variant={activeTab === 'applications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('applications')}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Apps</span> ({applications.length})
          </Button>
        </div>
      </div>

      {activeTab === 'jobs' && (
        <>
          {/* Jobs Management */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Job Postings</h2>
            <Button onClick={() => setShowJobForm(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {/* Job Form */}
          {showJobForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingJob ? 'Edit Job' : 'Post New Job'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Job Title *</label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Senior Financial Analyst"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department *</label>
                    <Input
                      value={jobForm.department}
                      onChange={(e) => setJobForm(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Finance"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="WFH">Work From Home</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Salary Range</label>
                    <Input
                      value={jobForm.salary}
                      onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                      placeholder="e.g., ₹8-12 LPA"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-lg font-bold italic">Job Description *</label>
                  <div className="flex gap-2 mb-2">
                    <select className="text-xs border rounded px-2 py-1" onChange={(e) => {
                      const textarea = document.querySelector('textarea[placeholder*="Describe the role"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const text = textarea.value;
                      const newText = text.substring(0, start) + e.target.value + ' ' + text.substring(start);
                      setJobForm(prev => ({ ...prev, description: newText }));
                    }}>
                      <option value="">Heading</option>
                      <option value="#">H1</option>
                      <option value="##">H2</option>
                      <option value="###">H3</option>
                      <option value="####">H4</option>
                      <option value="#####">H5</option>
                      <option value="######">H6</option>
                    </select>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Describe the role"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const selectedText = text.substring(start, end);
                      const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                      setJobForm(prev => ({ ...prev, description: newText }));
                    }}>B</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Describe the role"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const selectedText = text.substring(start, end);
                      const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                      setJobForm(prev => ({ ...prev, description: newText }));
                    }}>I</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      setJobForm(prev => ({ ...prev, description: prev.description + '\n• ' }));
                    }}>•</Button>
                  </div>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-lg font-bold italic">Requirements</label>
                  <div className="flex gap-2 mb-2">
                    <select className="text-xs border rounded px-2 py-1" onChange={(e) => {
                      const textarea = document.querySelector('textarea[placeholder*="List the requirements"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const text = textarea.value;
                      const newText = text.substring(0, start) + e.target.value + ' ' + text.substring(start);
                      setJobForm(prev => ({ ...prev, requirements: newText }));
                    }}>
                      <option value="">Heading</option>
                      <option value="#">H1</option>
                      <option value="##">H2</option>
                      <option value="###">H3</option>
                      <option value="####">H4</option>
                      <option value="#####">H5</option>
                      <option value="######">H6</option>
                    </select>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="List the requirements"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const selectedText = text.substring(start, end);
                      const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                      setJobForm(prev => ({ ...prev, requirements: newText }));
                    }}>B</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="List the requirements"]') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const selectedText = text.substring(start, end);
                      const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                      setJobForm(prev => ({ ...prev, requirements: newText }));
                    }}>I</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      setJobForm(prev => ({ ...prev, requirements: prev.requirements + '\n• ' }));
                    }}>•</Button>
                  </div>
                  <Textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List the requirements (use • for bullet points)..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-lg font-bold italic">Job Features</label>
                  <div className="space-y-2 mt-2">
                    {(jobForm.features || ['']).map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input value={feature} onChange={(e) => updateFeature(index, e.target.value)} placeholder="Enter job feature..." className="flex-1" />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)} disabled={(jobForm.features || ['']).length === 1}>✕</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full">+ Add Feature</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Job Image (Optional)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-green-600">
                          {jobForm.image?.name}
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setJobForm(prev => ({ ...prev, image: null }));
                            setImagePreview(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Upload job image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Please upload an image smaller than 5MB",
                            variant: "destructive"
                          });
                          return;
                        }
                        if (file) {
                          setJobForm(prev => ({ ...prev, image: file }));
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setImagePreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleJobSubmit} 
                    className="w-full sm:w-auto"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingJob ? 'Updating...' : 'Posting...'}
                      </>
                    ) : (
                      editingJob ? 'Update Job' : 'Post Job'
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetJobForm} className="w-full sm:w-auto" disabled={isUploading}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Jobs List */}
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex gap-3 flex-1 min-w-0">
                      {job.image && (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={job.image} 
                            alt={job.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold mb-2 truncate">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span>{job.type}</span>
                          <span>{job.salary}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {job.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'applications' && (
        <>
          {/* Applications Management */}
          <h2 className="text-lg md:text-xl font-semibold">Job Applications</h2>

          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold mb-1 truncate">{application.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 truncate">Applied for: {application.job_title}</p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                        <span className="truncate">{application.email}</span>
                        <span>{application.phone}</span>
                        <span>Exp: {application.experience}</span>
                      </div>
                      <p className="text-xs sm:text-sm line-clamp-2">{application.cover_letter}</p>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                      <Badge variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'reviewed' ? 'default' :
                        application.status === 'shortlisted' ? 'default' :
                        application.status === 'rejected' ? 'destructive' : 'secondary'
                      } className="text-xs">
                        {application.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApplication(application)}>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteApplication(application.id)}>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Details Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{selectedApplication.name}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate">{selectedApplication.job_title}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm break-all">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-sm">{selectedApplication.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Experience</label>
                    <p className="text-sm">{selectedApplication.experience}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Cover Letter</label>
                    <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{selectedApplication.cover_letter}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">CV/Resume</label>
                    <div className="flex items-center gap-2">
                      {selectedApplication.cv_filename ? (
                        <a 
                          href={`https://api.finonest.com/${selectedApplication.cv_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {selectedApplication.cv_filename}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">No CV uploaded</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={() => updateApplicationStatus(selectedApplication.id, 'shortlisted')} className="w-full sm:w-auto text-xs sm:text-sm">
                      Shortlist
                    </Button>
                    <Button variant="outline" onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')} className="w-full sm:w-auto text-xs sm:text-sm">
                      Mark Reviewed
                    </Button>
                    <Button variant="destructive" onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')} className="w-full sm:w-auto text-xs sm:text-sm">
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCareers;