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
    image: null as File | null
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/careers/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.log('Jobs API not available');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/careers/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.log('Applications API not available');
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

    try {
      const url = editingJob 
        ? `/api/careers/jobs/${editingJob.id}`
        : '/api/careers/jobs';
      
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobForm)
      });

      if (response.ok) {
        toast({
          title: editingJob ? "Job updated" : "Job posted",
          description: "Job has been saved successfully"
        });
        fetchJobs();
        resetJobForm();
      }
    } catch (error) {
      console.log('Job creation/update failed:', error);
      toast({
        title: "Operation failed",
        description: "Please try again later",
        variant: "destructive"
      });
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
      image: null
    });
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
      image: null
    });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await fetch(`/api/careers/jobs/${jobId}`, {
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
      await fetch(`/api/careers/applications/${applicationId}`, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Career Management</h1>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'jobs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Jobs ({jobs.length})
          </Button>
          <Button
            variant={activeTab === 'applications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('applications')}
          >
            <Users className="w-4 h-4 mr-2" />
            Applications ({applications.length})
          </Button>
        </div>
      </div>

      {activeTab === 'jobs' && (
        <>
          {/* Jobs Management */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Job Postings</h2>
            <Button onClick={() => setShowJobForm(true)}>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="text-sm font-medium">Job Description *</label>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Requirements</label>
                  <Textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List the requirements (use • for bullet points)..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Job Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setJobForm(prev => ({ ...prev, image: file || null }));
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload an image for the job posting (optional)</p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleJobSubmit}>
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </Button>
                  <Button variant="outline" onClick={resetJobForm}>
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
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span>{job.department}</span>
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        <span>{job.salary}</span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
          <h2 className="text-xl font-semibold">Job Applications</h2>

          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{application.name}</h3>
                      <p className="text-muted-foreground mb-2">Applied for: {application.job_title}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span>{application.email}</span>
                        <span>{application.phone}</span>
                        <span>Experience: {application.experience}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{application.cover_letter}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'reviewed' ? 'default' :
                        application.status === 'shortlisted' ? 'default' :
                        application.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {application.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApplication(application)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
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
            <Card className="fixed inset-4 z-50 overflow-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedApplication.name}</CardTitle>
                    <p className="text-muted-foreground">{selectedApplication.job_title}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedApplication(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p>{selectedApplication.phone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Experience</label>
                  <p>{selectedApplication.experience}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Cover Letter</label>
                  <p className="whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">CV/Resume</label>
                  <p>{selectedApplication.cv_filename}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => updateApplicationStatus(selectedApplication.id, 'shortlisted')}>
                    Shortlist
                  </Button>
                  <Button variant="outline" onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')}>
                    Mark Reviewed
                  </Button>
                  <Button variant="destructive" onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCareers;