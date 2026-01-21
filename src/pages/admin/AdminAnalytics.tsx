import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BookOpen,
  GraduationCap,
  MapPin,
  DollarSign,
  Target,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface Application {
  id: number;
  status: string;
  created_at: string;
}

interface ContactForm {
  id: number;
  created_at: string;
}

interface User {
  id: number;
  created_at: string;
  role?: string;
}

interface Blog {
  id: number;
  created_at: string;
  status?: string;
}

interface Course {
  id: number;
  created_at: string;
  status?: string;
}

interface Enrollment {
  id: number;
  created_at: string;
  status?: string;
}

interface Branch {
  id: number;
  created_at: string;
  status?: string;
}

const AdminAnalytics = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, contactsRes, usersRes, blogsRes, coursesRes, enrollmentsRes, branchesRes] = await Promise.all([
        fetch('https://api.finonest.com/api/admin/forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://api.finonest.com/api/admin/contact-forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://api.finonest.com/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://api.finonest.com/api/admin/blogs', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        fetch('https://api.finonest.com/api/admin/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        fetch('https://api.finonest.com/api/admin/enrollments', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        fetch('https://api.finonest.com/api/admin/branches', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);
      
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      }
      
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContactForms(contactsData.forms || []);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData.blogs || []);
      }
      
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
      
      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData.enrollments || []);
      }
      
      if (branchesRes.ok) {
        const branchesData = await branchesRes.json();
        setBranches(branchesData.branches || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === 'APPROVED').length;
  const pendingApplications = applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length;
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED').length;
  const approvalRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : '0';
  const activeUsers = users.filter(user => user.role !== 'ADMIN').length;
  const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;
  const activeCourses = courses.filter(course => course.status === 'active').length;
  const completedEnrollments = enrollments.filter(enrollment => enrollment.status === 'completed').length;
  const activeBranches = branches.filter(branch => branch.status === 'active').length;

  // Chart data
  const applicationStatusData = [
    { name: 'Approved', value: approvedApplications, color: '#22c55e' },
    { name: 'Pending', value: pendingApplications, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedApplications, color: '#ef4444' }
  ];

  const monthlyData = [
    { month: 'Jan', applications: 12, users: 8, blogs: 3, courses: 2 },
    { month: 'Feb', applications: 19, users: 15, blogs: 5, courses: 3 },
    { month: 'Mar', applications: 25, users: 22, blogs: 7, courses: 4 },
    { month: 'Apr', applications: 31, users: 28, blogs: 9, courses: 5 },
    { month: 'May', applications: 28, users: 25, blogs: 11, courses: 6 },
    { month: 'Jun', applications: 35, users: 32, blogs: 13, courses: 7 }
  ];

  const performanceData = [
    { category: 'Applications', current: totalApplications, target: 100, percentage: Math.min((totalApplications / 100) * 100, 100) },
    { category: 'Users', current: activeUsers, target: 200, percentage: Math.min((activeUsers / 200) * 100, 100) },
    { category: 'Blogs', current: publishedBlogs, target: 50, percentage: Math.min((publishedBlogs / 50) * 100, 100) },
    { category: 'Courses', current: activeCourses, target: 20, percentage: Math.min((activeCourses / 20) * 100, 100) }
  ];

  const stats = [
    { 
      title: 'Total Applications', 
      value: totalApplications.toString(), 
      change: '+12%', 
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/applications' 
    },
    { 
      title: 'Active Users', 
      value: activeUsers.toString(), 
      change: '+8%', 
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/users' 
    },
    { 
      title: 'Contact Forms', 
      value: contactForms.length.toString(), 
      change: '+5%', 
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/contact-forms' 
    },
    { 
      title: 'Approval Rate', 
      value: `${approvalRate}%`, 
      change: '+2.1%', 
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/applications' 
    },
    { 
      title: 'Published Blogs', 
      value: publishedBlogs.toString(), 
      change: '+15%', 
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/blogs' 
    },
    { 
      title: 'Active Courses', 
      value: activeCourses.toString(), 
      change: '+20%', 
      icon: GraduationCap,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/admin/courses' 
    },
    { 
      title: 'Course Enrollments', 
      value: enrollments.length.toString(), 
      change: '+25%', 
      icon: Target,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      href: '/admin/enrollments' 
    },
    { 
      title: 'Active Branches', 
      value: activeBranches.toString(), 
      change: '+3%', 
      icon: MapPin,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/branches' 
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-sm"
              onClick={() => navigate(stat.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">{item.current}/{item.target}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% of target</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Monthly Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="blogs" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="courses" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Application Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {applicationStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Applications', value: totalApplications },
              { name: 'Users', value: activeUsers },
              { name: 'Blogs', value: publishedBlogs },
              { name: 'Courses', value: activeCourses },
              { name: 'Enrollments', value: enrollments.length },
              { name: 'Branches', value: activeBranches },
              { name: 'Contacts', value: contactForms.length }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/applications')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Review Applications ({pendingApplications} pending)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users ({activeUsers} active)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/contact-forms')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              View Contact Forms ({contactForms.length} total)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/blogs')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Blogs ({publishedBlogs} published)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/courses')}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Manage Courses ({activeCourses} active)
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Application Approved</p>
                  <p className="text-xs text-muted-foreground">Personal loan for ₹5,00,000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">user@example.com joined</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">New Blog Published</p>
                  <p className="text-xs text-muted-foreground">"Financial Planning Tips" is now live</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Course Enrollment</p>
                  <p className="text-xs text-muted-foreground">5 new students enrolled today</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics; 
              onClick={() => navigate('/admin/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/contact-forms')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              View Contact Forms
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Application Approved</p>
                  <p className="text-xs text-muted-foreground">Personal loan for ₹5,00,000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">user@example.com joined</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Pending Review</p>
                  <p className="text-xs text-muted-foreground">Business loan application</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;