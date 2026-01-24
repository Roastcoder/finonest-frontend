import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Eye, Calendar, User, Image, Video, Bot, Sparkles } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getAIConfig } from "@/lib/aiConfig";

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
  meta_title?: string;
  meta_description?: string;
  meta_tags?: string;
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
  final_cta_text?: string;
  disclaimer?: string;
  trust_footer?: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState({ apiKey: '', model: '', enabled: true });
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
    meta_title: "",
    meta_description: "",
    meta_tags: "",
    table_of_contents: "",
    introduction: "",
    quick_info_box: "",
    emi_example: "",
    what_is_loan: "",
    benefits: "",
    who_should_apply: "",
    eligibility_criteria: "",
    documents_required: "",
    interest_rates: "",
    finonest_process: "",
    why_choose_finonest: "",
    customer_testimonials: "",
    common_mistakes: "",
    mid_blog_cta: "",
    faqs: "",
    service_areas: "",
    related_blogs: "",
    final_cta: "",
    final_cta_text: "",
    disclaimer: "",
    trust_footer: ""
  });

  const categories = ["Credit Score", "Car Loan", "Home Loan", "Personal Loan", "Business Loan", "Financial Planning"];

  useEffect(() => {
    fetchBlogs();
    getAIConfig().then(setAiConfig);
  }, []);

  const generateBlogWithAI = async () => {
    if (!aiConfig.enabled) {
      toast({
        title: "Error",
        description: "AI features are currently disabled. Please enable them in settings.",
        variant: "destructive",
      });
      return;
    }

    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI blog generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': aiConfig.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a comprehensive blog post for Finonest about: "${aiPrompt}". Return ONLY a valid JSON object with these exact fields as strings:
              {
                "title": "SEO-optimized blog title",
                "excerpt": "Brief 2-3 sentence summary",
                "content": "Main blog content in markdown format",
                "category": "One of: Credit Score, Car Loan, Home Loan, Personal Loan, Business Loan, Financial Planning",
                "meta_tags": "SEO keywords separated by commas (e.g., personal loan, finance, credit score, finonest)",
                "table_of_contents": "1. Introduction\n2. What is [Loan Type]\n3. Benefits\n4. Eligibility\n5. Process\n6. FAQs",
                "introduction": "Engaging opening paragraph about the loan type",
                "quick_info_box": "• Loan Amount: ₹1 lakh to ₹50 lakhs\n• Interest Rate: 8.5% - 15% p.a.\n• Tenure: 1-7 years\n• Processing Fee: 0.5% - 2%",
                "emi_example": "For a ₹10 lakh loan at 12% interest for 5 years, your EMI would be approximately ₹22,244. Use our EMI calculator for personalized calculations.",
                "what_is_loan": "Detailed explanation of what this loan type is and its purpose",
                "benefits": "• Quick approval process\n• Competitive interest rates\n• Flexible repayment options\n• Minimal documentation\n• No hidden charges",
                "who_should_apply": "Target audience description - who would benefit from this loan",
                "eligibility_criteria": "• Age: 21-65 years\n• Income: Minimum ₹25,000/month\n• Employment: Salaried/Self-employed\n• Credit Score: 650+\n• Work Experience: 2+ years",
                "documents_required": "• Identity Proof (Aadhar/PAN)\n• Address Proof\n• Income Proof (Salary slips/ITR)\n• Bank Statements (6 months)\n• Employment Proof",
                "interest_rates": "Interest rates range from 8.5% to 15% per annum depending on your credit profile. Processing fees: 0.5% to 2% of loan amount. No prepayment charges after 12 months.",
                "finonest_process": "1. Apply Online - Fill simple application form\n2. Document Upload - Submit required documents\n3. Verification - Our team verifies details\n4. Approval - Get approval within 24-48 hours\n5. Disbursement - Funds transferred to your account",
                "why_choose_finonest": "• 50+ banking partners for best rates\n• Quick approval in 24-48 hours\n• Expert guidance throughout\n• Transparent process, no hidden fees\n• Dedicated relationship manager",
                "customer_testimonials": "\"Finonest helped me get my home loan approved within 2 days. Excellent service!\" - Rajesh Kumar, Mumbai\n\"Best rates and hassle-free process. Highly recommended!\" - Priya Sharma, Delhi",
                "common_mistakes": "• Not checking credit score before applying\n• Applying to multiple lenders simultaneously\n• Incomplete documentation\n• Not comparing interest rates\n• Ignoring processing fees and charges",
                "mid_blog_cta": "Ready to apply? Get pre-approved in just 2 minutes! Our experts will help you find the best loan offer.",
                "faqs": "Q: What is the minimum loan amount?\nA: The minimum loan amount is ₹1 lakh.\n\nQ: How long does approval take?\nA: Approval typically takes 24-48 hours.\n\nQ: Can I prepay my loan?\nA: Yes, prepayment is allowed after 12 months without charges.",
                "service_areas": "We serve customers across India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad, and 500+ other cities.",
                "related_blogs": "• How to Improve Your Credit Score\n• EMI vs Interest Rate: What Matters More\n• Top 10 Loan Mistakes to Avoid\n• Understanding Loan Processing Fees",
                "final_cta": "https://finonest.com/apply-now",
                "final_cta_text": "Apply Now - Get Instant Pre-Approval!",
                "disclaimer": "Finonest acts as a loan facilitator. Final approval depends on lender policies. Interest rates and terms subject to change. Please read all terms carefully before applying.",
                "trust_footer": "Finonest is a trusted financial services platform with 50+ banking partners. We are committed to transparency and helping you make informed financial decisions."
              }
              
              Return ONLY the JSON object, no additional text or formatting.`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const blogData = JSON.parse(jsonMatch[0]);
            
            // Helper function to safely extract string values
            const safeString = (value) => {
              if (typeof value === 'string') return value;
              if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value).replace(/[{}"]/g, '').replace(/,/g, ', ');
              }
              return value ? String(value) : '';
            };
            
            setFormData({
              title: safeString(blogData.title),
              excerpt: safeString(blogData.excerpt),
              content: safeString(blogData.content),
              category: safeString(blogData.category),
              status: 'draft',
              image_url: '',
              video_url: '',
              meta_title: safeString(blogData.title),
              meta_description: safeString(blogData.excerpt),
              meta_tags: safeString(blogData.meta_tags) || `${safeString(blogData.category)}, loans, finance, finonest`,
              table_of_contents: safeString(blogData.table_of_contents),
              introduction: safeString(blogData.introduction),
              quick_info_box: safeString(blogData.quick_info_box),
              emi_example: safeString(blogData.emi_example),
              what_is_loan: safeString(blogData.what_is_loan),
              benefits: safeString(blogData.benefits),
              who_should_apply: safeString(blogData.who_should_apply),
              eligibility_criteria: safeString(blogData.eligibility_criteria),
              documents_required: safeString(blogData.documents_required),
              interest_rates: safeString(blogData.interest_rates),
              finonest_process: safeString(blogData.finonest_process),
              why_choose_finonest: safeString(blogData.why_choose_finonest),
              customer_testimonials: safeString(blogData.customer_testimonials),
              common_mistakes: safeString(blogData.common_mistakes),
              mid_blog_cta: safeString(blogData.mid_blog_cta),
              faqs: safeString(blogData.faqs),
              service_areas: safeString(blogData.service_areas),
              related_blogs: safeString(blogData.related_blogs),
              final_cta: safeString(blogData.final_cta) || 'https://finonest.com/apply-now',
              final_cta_text: safeString(blogData.final_cta_text) || 'Apply Now',
              disclaimer: safeString(blogData.disclaimer),
              trust_footer: safeString(blogData.trust_footer)
            });
            
            setShowForm(true);
            setAiPrompt('');
            
            toast({
              title: "Success",
              description: "AI blog generated successfully!",
            });
          }
        } catch (parseError) {
          toast({
            title: "Error",
            description: "Failed to parse AI response. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate blog with AI.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
      meta_title: "",
      meta_description: "",
      meta_tags: "",
      table_of_contents: "",
      introduction: "",
      quick_info_box: "",
      emi_example: "",
      what_is_loan: "",
      benefits: "",
      who_should_apply: "",
      eligibility_criteria: "",
      documents_required: "",
      interest_rates: "",
      finonest_process: "",
      why_choose_finonest: "",
      customer_testimonials: "",
      common_mistakes: "",
      mid_blog_cta: "",
      faqs: "",
      service_areas: "",
      related_blogs: "",
      final_cta: "",
      final_cta_text: "",
      disclaimer: "",
      trust_footer: ""
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
      meta_title: blog.meta_title || blog.title,
      meta_description: blog.meta_description || blog.excerpt,
      meta_tags: blog.meta_tags || "",
      table_of_contents: blog.table_of_contents || "",
      introduction: blog.introduction || "",
      quick_info_box: blog.quick_info_box || "",
      emi_example: blog.emi_example || "",
      what_is_loan: blog.what_is_loan || "",
      benefits: blog.benefits || "",
      who_should_apply: blog.who_should_apply || "",
      eligibility_criteria: blog.eligibility_criteria || "",
      documents_required: blog.documents_required || "",
      interest_rates: blog.interest_rates || "",
      finonest_process: blog.finonest_process || "",
      why_choose_finonest: blog.why_choose_finonest || "",
      customer_testimonials: blog.customer_testimonials || "",
      common_mistakes: blog.common_mistakes || "",
      mid_blog_cta: blog.mid_blog_cta || "",
      faqs: blog.faqs || "",
      service_areas: blog.service_areas || "",
      related_blogs: blog.related_blogs || "",
      final_cta: blog.final_cta || "",
      final_cta_text: blog.final_cta_text || "",
      disclaimer: blog.disclaimer || "",
      trust_footer: blog.trust_footer || ""
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
            <div className="flex gap-2">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Blog Post
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* AI Blog Generator */}
          <Card className="mb-6 border-2 border-dashed border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="w-5 h-5" />
                AI Blog Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Blog Topic/Prompt</label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Write a comprehensive guide about home loans for first-time buyers in India'"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={generateBlogWithAI} 
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating Blog...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Blog with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Title (SEO)</label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      placeholder="SEO optimized title (leave empty to use blog title)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 50-60 characters. Leave empty to use blog title.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description (SEO)</label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      placeholder="SEO optimized description (leave empty to use excerpt)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 150-160 characters. Leave empty to use excerpt.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Blog Sections</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Table of Contents</label>
                        <Textarea value={formData.table_of_contents} onChange={(e) => setFormData({...formData, table_of_contents: e.target.value})} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Introduction</label>
                        <Textarea value={formData.introduction} onChange={(e) => setFormData({...formData, introduction: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quick Info Box (Loan at a Glance)</label>
                        <Textarea value={formData.quick_info_box} onChange={(e) => setFormData({...formData, quick_info_box: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">EMI Example / Calculator Teaser</label>
                        <Textarea value={formData.emi_example} onChange={(e) => setFormData({...formData, emi_example: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">What Is [Loan Name]?</label>
                        <Textarea value={formData.what_is_loan} onChange={(e) => setFormData({...formData, what_is_loan: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Benefits of [Loan Name]</label>
                        <Textarea value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Who Should Apply for This Loan?</label>
                        <Textarea value={formData.who_should_apply} onChange={(e) => setFormData({...formData, who_should_apply: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Eligibility Criteria</label>
                        <Textarea value={formData.eligibility_criteria} onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Documents Required</label>
                        <Textarea value={formData.documents_required} onChange={(e) => setFormData({...formData, documents_required: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Interest Rate & Charges Disclosure</label>
                        <Textarea value={formData.interest_rates} onChange={(e) => setFormData({...formData, interest_rates: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">How Finonest Loan Process Works</label>
                        <Textarea value={formData.finonest_process} onChange={(e) => setFormData({...formData, finonest_process: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Why Choose Finonest?</label>
                        <Textarea value={formData.why_choose_finonest} onChange={(e) => setFormData({...formData, why_choose_finonest: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Customer Testimonials</label>
                        <Textarea value={formData.customer_testimonials} onChange={(e) => setFormData({...formData, customer_testimonials: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Common Mistakes to Avoid</label>
                        <Textarea value={formData.common_mistakes} onChange={(e) => setFormData({...formData, common_mistakes: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mid-Blog Call to Action</label>
                        <Textarea value={formData.mid_blog_cta} onChange={(e) => setFormData({...formData, mid_blog_cta: e.target.value})} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Frequently Asked Questions (FAQs)</label>
                        <Textarea value={formData.faqs} onChange={(e) => setFormData({...formData, faqs: e.target.value})} rows={4} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Service Areas / Local Presence</label>
                        <Textarea value={formData.service_areas} onChange={(e) => setFormData({...formData, service_areas: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Related Blogs & Internal Links</label>
                        <Textarea value={formData.related_blogs} onChange={(e) => setFormData({...formData, related_blogs: e.target.value})} rows={3} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Final Call to Action URL</label>
                        <Input
                          type="url"
                          value={formData.final_cta}
                          onChange={(e) => setFormData({...formData, final_cta: e.target.value})}
                          placeholder="https://example.com/apply-now"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                        <Input
                          value={formData.final_cta_text}
                          onChange={(e) => setFormData({...formData, final_cta_text: e.target.value})}
                          placeholder="Apply Now - Get Instant Approval!"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Disclaimer & Compliance Notice</label>
                        <Textarea value={formData.disclaimer} onChange={(e) => setFormData({...formData, disclaimer: e.target.value})} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Trust & Compliance Footer</label>
                        <Textarea value={formData.trust_footer} onChange={(e) => setFormData({...formData, trust_footer: e.target.value})} rows={2} />
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