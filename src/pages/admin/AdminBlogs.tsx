import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Eye, Calendar, User, Image, Video } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  image_url?: string;
  video_url?: string;
  table_of_contents?: string;
  introduction?: string;
  quick_info_box?: string;
  emi_example?: string;
  what_is_loan?: string;
  benefits?: string;
  who_should_apply?: string;
  eligibility_criteria?: string;
  documents_required?: string;
  interest_rates?: string;
  finonest_process?: string;
  why_choose_finonest?: string;
  customer_testimonials?: string;
  common_mistakes?: string;
  mid_blog_cta?: string;
  faqs?: string;
  service_areas?: string;
  related_blogs?: string;
  final_cta?: string;
  disclaimer?: string;
  trust_footer?: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft" as "draft" | "published",
    image_url: "",
    video_url: "",
    meta_tags: ""
  });

  const categories = ["Credit Score", "Car Loan", "Home Loan", "Personal Loan", "Business Loan", "Financial Planning"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      console.log('Fetching blogs from admin endpoint...');
      console.log('Token:', token);
      
      const response = await fetch('https://api.finonest.com/api/blogs/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setBlogs(data.blogs || []);
        console.log('Blogs set:', data.blogs?.length || 0);
      } else {
        console.error('Error response:', data);
        toast({
          title: "Error",
          description: data.error || "Failed to fetch blogs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBlog 
        ? `https://api.finonest.com/api/blogs/${editingBlog.id}`
        : 'https://api.finonest.com/api/blogs';
      
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Blog ${editingBlog ? 'updated' : 'created'} successfully`,
        });
        fetchBlogs();
        resetForm();
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${editingBlog ? 'update' : 'create'} blog`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingBlog ? 'update' : 'create'} blog`,
        variant: "destructive",
      });
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const response = await fetch(`https://api.finonest.com/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBlogs(blogs => blogs.filter(blog => blog.id !== id));
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      status: "draft",
      image_url: "",
      video_url: "",
      meta_tags: ""
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const editBlog = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      status: blog.status,
      image_url: blog.image_url || "",
      video_url: blog.video_url || "",
      meta_tags: ""
    });
    setEditingBlog(blog);
    setShowForm(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading blogs...</p>
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
              Blog Management ({blogs.length})
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingBlog ? 'Edit' : 'Create'} Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <div className="flex gap-2 mb-2">
                      <select className="text-xs border rounded px-2 py-1" onChange={(e) => {
                        const textarea = document.querySelector('textarea[rows="8"]') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const text = textarea.value;
                        const newText = text.substring(0, start) + e.target.value + ' ' + text.substring(start);
                        setFormData({...formData, content: newText});
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
                      const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selectedText = text.substring(start, end);
                        const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                        setFormData({...formData, content: newText});
                        textarea.focus();
                      }
                    }}>B</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        const textarea = document.querySelector('textarea[rows="8"]') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selectedText = text.substring(start, end);
                        const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                        setFormData({...formData, content: newText});
                      }}>I</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        setFormData({...formData, content: formData.content + '\n• '});
                      }}>•</Button>
                    </div>
                    <Textarea
                      id="blog-content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Select value={formData.status} onValueChange={(value: "draft" | "published") => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Featured Image
                    </label>
                    <ImageUpload
                      onImageUploaded={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
                      currentImage={formData.image_url}
                      onRemoveImage={() => setFormData({...formData, image_url: ""})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video URL (Optional)
                    </label>
                    <Input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Tags (SEO Keywords)</label>
                    <Input
                      value={formData.meta_tags}
                      onChange={(e) => setFormData({...formData, meta_tags: e.target.value})}
                      placeholder="credit score, loans, finance (comma separated)"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Blog Sections</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Table of Contents</label>
                        <Textarea value={formData.table_of_contents || ''} onChange={(e) => setFormData({...formData, table_of_contents: e.target.value})} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Introduction</label>
                        <Textarea value={formData.introduction || ''} onChange={(e) => setFormData({...formData, introduction: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quick Info Box</label>
                        <Textarea value={formData.quick_info_box || ''} onChange={(e) => setFormData({...formData, quick_info_box: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">EMI Example</label>
                        <Textarea value={formData.emi_example || ''} onChange={(e) => setFormData({...formData, emi_example: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Benefits</label>
                        <Textarea value={formData.benefits || ''} onChange={(e) => setFormData({...formData, benefits: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Eligibility Criteria</label>
                        <Textarea value={formData.eligibility_criteria || ''} onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Documents Required</label>
                        <Textarea value={formData.documents_required || ''} onChange={(e) => setFormData({...formData, documents_required: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">FAQs</label>
                        <Textarea value={formData.faqs || ''} onChange={(e) => setFormData({...formData, faqs: e.target.value})} rows={4} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Final CTA</label>
                        <Textarea value={formData.final_cta || ''} onChange={(e) => setFormData({...formData, final_cta: e.target.value})} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Disclaimer</label>
                        <Textarea value={formData.disclaimer || ''} onChange={(e) => setFormData({...formData, disclaimer: e.target.value})} rows={2} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingBlog ? 'Update' : 'Create'} Blog Post
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {blogs.length === 0 ? (
            <p>No blog posts found.</p>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{blog.title}</h3>
                        <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                          {blog.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {blog.category}
                        </Badge>
                        {blog.image_url && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Image className="w-3 h-3" />
                            Image
                          </span>
                        )}
                        {blog.video_url && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Video className="w-3 h-3" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editBlog(blog)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteBlog(blog.id)}>
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

export default AdminBlogs;