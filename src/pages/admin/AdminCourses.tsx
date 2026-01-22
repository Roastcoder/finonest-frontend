import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, BookOpen, Clock, GraduationCap } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'inactive';
  price: number;
  original_price?: number;
  image_path?: string;
  video_path?: string;
  created_at: string;
  updated_at: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    lessons: 0,
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    status: "active" as "active" | "inactive",
    price: 0,
    original_price: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const toggleCard = (courseId: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCards(newExpanded);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive",
        });
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
    setUploading(true);
    
    try {
      const url = editingCourse 
        ? `https://api.finonest.com/api/courses/${editingCourse.id}`
        : 'https://api.finonest.com/api/courses';
      
      // Use POST for both create and update to handle FormData properly
      const method = 'POST';
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('lessons', formData.lessons.toString());
      formDataToSend.append('level', formData.level);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('price', formData.price.toString());
      if (formData.original_price) {
        formDataToSend.append('original_price', formData.original_price.toString());
      }
      
      // Add method override for updates
      if (editingCourse) {
        formDataToSend.append('_method', 'PUT');
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      if (videoFile) {
        formDataToSend.append('video', videoFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || `Course ${editingCourse ? 'updated' : 'created'} successfully`,
        });
        fetchCourses();
        resetForm();
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${editingCourse ? 'update' : 'create'} course`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`https://api.finonest.com/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setCourses(courses => courses.filter(course => course.id !== id));
        toast({
          title: "Success",
          description: result.message || "Course deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete course",
          variant: "destructive",
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
      status: "active",
      price: 0,
      original_price: ""
    });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
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
      status: course.status,
      price: course.price,
      original_price: course.original_price?.toString() || ""
    });
    
    // Set existing image preview if course has an image
    if (course.image_path) {
      setImagePreview(`https://api.finonest.com/${course.image_path}`);
    } else {
      setImagePreview(null);
    }
    
    // Reset file inputs since we're editing existing content
    setImageFile(null);
    setVideoFile(null);
    
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <GraduationCap className="w-5 h-5" />
              <span className="break-words">Finobizz Learning Management ({courses.length})</span>
            </CardTitle>
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
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
                    <div className="flex gap-2 mb-2">
                      <select className="text-xs border rounded px-2 py-1" onChange={(e) => {
                        const textarea = document.querySelector('textarea[rows="3"]') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const text = textarea.value;
                        const newText = text.substring(0, start) + e.target.value + ' ' + text.substring(start);
                        setFormData({...formData, description: newText});
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
                        const textarea = document.querySelector('textarea[rows="3"]') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selectedText = text.substring(start, end);
                        const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                        setFormData({...formData, description: newText});
                      }}>B</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        const textarea = document.querySelector('textarea[rows="3"]') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selectedText = text.substring(start, end);
                        const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                        setFormData({...formData, description: newText});
                      }}>I</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        setFormData({...formData, description: formData.description + '\n• '});
                      }}>•</Button>
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Original Price (₹) - Optional</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.original_price}
                        onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                        placeholder="Leave empty if no discount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Course Image (16:9 Ratio Recommended)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {(imagePreview || editingCourse?.image_path) && (
                        <div className="mt-2">
                          <div className="aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
                            <img 
                              src={imagePreview || `https://api.finonest.com/${editingCourse?.image_path}`} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {imagePreview ? 'New image preview' : 'Current image'} (16:9 aspect ratio)
                          </p>
                        </div>
                      )}
                      {!imagePreview && !editingCourse?.image_path && (
                        <div className="mt-2">
                          <div className="aspect-video w-full max-w-xs bg-gray-100 rounded-lg border flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <BookOpen className="w-8 h-8 mx-auto mb-1" />
                              <p className="text-xs">16:9 Ratio</p>
                              <p className="text-xs">Recommended</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Course Video</label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="flex-1" disabled={uploading}>
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {editingCourse ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>{editingCourse ? 'Update' : 'Create'} Course</>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1" disabled={uploading}>
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
              {courses.map((course) => {
                const isExpanded = expandedCards.has(course.id);
                return (
                  <div key={course.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                      <button 
                        onClick={() => toggleCard(course.id)}
                        className="p-2 hover:bg-gray-100 rounded text-lg font-bold"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    </div>
                    <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                      <p className="text-sm text-muted-foreground mb-2 break-words">{course.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 flex-shrink-0" />
                          {course.lessons} lessons
                        </span>
                        <span className="font-semibold text-primary">
                          ₹{course.price}
                          {course.original_price && course.original_price > course.price && (
                            <span className="ml-1 line-through text-muted-foreground">₹{course.original_price}</span>
                          )}
                        </span>
                        <span>
                          Created: {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editCourse(course)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;