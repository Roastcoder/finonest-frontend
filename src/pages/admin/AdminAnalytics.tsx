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
      // Fetch applications
      try {
        const appsRes = await fetch('https://api.finonest.com/api/admin/forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const text = await appsRes.text();
          if (text) {
            const appsData = JSON.parse(text);
            setApplications(appsData.applications || []);
          }
        }
      } catch (error) {
        console.log('Applications API error:', error);
      }

      // Fetch contact forms
      try {
        const contactsRes = await fetch('https://api.finonest.com/api/admin/contact-forms', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (contactsRes.ok) {
          const text = await contactsRes.text();
          if (text) {
            const contactsData = JSON.parse(text);
            setContactForms(contactsData.forms || []);
          }
        }
      } catch (error) {
        console.log('Contact forms API error:', error);
      }

      // Fetch users
      try {
        const usersRes = await fetch('https://api.finonest.com/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const text = await usersRes.text();
          if (text) {
            const usersData = JSON.parse(text);
            setUsers(usersData.users || []);
          }
        }
      } catch (error) {
        console.log('Users API error:', error);
      }

      // Set mock data for modules that don't have working APIs
      setBlogs([
        { id: 1, created_at: '2024-01-01', status: 'published' },
        { id: 2, created_at: '2024-01-02', status: 'published' },
        { id: 3, created_at: '2024-01-03', status: 'published' },
        { id: 4, created_at: '2024-01-04', status: 'draft' }
      ]);
      
      setCourses([
        { id: 1, created_at: '2024-01-01', status: 'active' },
        { id: 2, created_at: '2024-01-02', status: 'active' },
        { id: 3, created_at: '2024-01-03', status: 'active' }
      ]);
      
      setEnrollments([
        { id: 1, created_at: '2024-01-01', status: 'completed' },
        { id: 2, created_at: '2024-01-02', status: 'active' },
        { id: 3, created_at: '2024-01-03', status: 'active' },
        { id: 4, created_at: '2024-01-04', status: 'completed' },
        { id: 5, created_at: '2024-01-05', status: 'active' }
      ]);
      
      setBranches([
        { id: 1, created_at: '2024-01-01', status: 'active' },
        { id: 2, created_at: '2024-01-02', status: 'active' },
        { id: 3, created_at: '2024-01-03', status: 'active' }
      ]);
      
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
    <div className="space-y-3 p-3">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-sm"
              onClick={() => navigate(stat.href)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                  </div>
                  <div className={`p-2 rounded-full ${stat.bgColor} ml-2`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {performanceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium truncate">{item.category}</span>
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
      <div className="space-y-3">
        {/* Monthly Trends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4" />
              Monthly Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="w-4 h-4" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
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
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {applicationStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="w-4 h-4" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'Apps', value: totalApplications },
              { name: 'Users', value: activeUsers },
              { name: 'Blogs', value: publishedBlogs },
              { name: 'Courses', value: activeCourses },
              { name: 'Enrollments', value: enrollments.length },
              { name: 'Branches', value: activeBranches },
              { name: 'Contacts', value: contactForms.length }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="space-y-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-xs h-8" 
              onClick={() => navigate('/admin/applications')}
            >
              <FileText className="w-3 h-3 mr-2" />
              <span className="truncate">Applications ({pendingApplications})</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-xs h-8" 
              onClick={() => navigate('/admin/users')}
            >
              <Users className="w-3 h-3 mr-2" />
              <span className="truncate">Users ({activeUsers})</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-xs h-8" 
              onClick={() => navigate('/admin/contact-forms')}
            >
              <MessageSquare className="w-3 h-3 mr-2" />
              <span className="truncate">Contact Forms ({contactForms.length})</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-2 bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Application Approved</p>
                    <p className="text-xs text-muted-foreground truncate">Personal loan</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-2 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">New User</p>
                    <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-2 bg-purple-50 border-purple-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Blog Published</p>
                    <p className="text-xs text-muted-foreground truncate">Financial Tips</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-2 bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3 h-3 text-orange-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Course Enrollment</p>
                    <p className="text-xs text-muted-foreground truncate">5 new students</p>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;