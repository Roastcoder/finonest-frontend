import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Edit, Trash2, BookOpen, Clock, GraduationCap } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    lessons: 0,
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCourse 
        ? `https://api.finonest.com/api/admin/courses/${editingCourse.id}`
        : 'https://api.finonest.com/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Course ${editingCourse ? 'updated' : 'created'} successfully`,
        });
        fetchCourses();
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course`,
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`https://api.finonest.com/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCourses(courses => courses.filter(course => course.id !== id));
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      lessons: 0,
      level: "Beginner",
      status: "active"
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const editCourse = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      lessons: course.lessons,
      level: course.level,
      status: course.status
    });
    setEditingCourse(course);
    setShowForm(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finobizz Learning Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading courses...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Finobizz Learning Management ({courses.length})
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingCourse ? 'Edit' : 'Create'} Course</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Course Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="e.g., 4 hours"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Lessons</label>
                      <Input
                        type="number"
                        value={formData.lessons}
                        onChange={(e) => setFormData({...formData, lessons: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Level</label>
                      <Select value={formData.level} onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setFormData({...formData, level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingCourse ? 'Update' : 'Create'} Course
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.lessons} lessons
                        </span>
                        <span>
                          Created: {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editCourse(course)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;