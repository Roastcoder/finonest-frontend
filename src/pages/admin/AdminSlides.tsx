import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, Image, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
}

const AdminSlides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "",
    button_link: "",
    order_position: 1,
    is_active: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/slides.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch slides",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch slides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSlide 
        ? `https://api.finonest.com/api/slides.php?id=${editingSlide.id}`
        : 'https://api.finonest.com/api/slides.php';
      
      const method = editingSlide ? 'PUT' : 'POST';

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
          description: `Slide ${editingSlide ? 'updated' : 'created'} successfully`,
        });
        fetchSlides();
        resetForm();
        // Trigger hero section refresh
        window.dispatchEvent(new CustomEvent('slidesUpdated'));
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || `Failed to ${editingSlide ? 'update' : 'create'} slide`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingSlide ? 'update' : 'create'} slide`,
        variant: "destructive",
      });
    }
  };

  const deleteSlide = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.finonest.com/api/slides.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSlides(slides => slides.filter(slide => slide.id !== id));
        toast({
          title: "Success",
          description: "Slide deleted successfully",
        });
        window.dispatchEvent(new CustomEvent('slidesUpdated'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete slide",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "",
      button_link: "",
      order_position: 1,
      is_active: true
    });
    setEditingSlide(null);
    setShowForm(false);
  };

  const editSlide = (slide: Slide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image_url: slide.image_url,
      button_text: slide.button_text,
      button_link: slide.button_link,
      order_position: slide.order_position,
      is_active: slide.is_active
    });
    setEditingSlide(slide);
    setShowForm(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Home Page Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading slides...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              <span className="text-base sm:text-lg">Home Page Slides ({slides.length})</span>
            </CardTitle>
            <Button onClick={() => setShowForm(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Slide
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingSlide ? 'Edit' : 'Create'} Slide</CardTitle>
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
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Slide Image</label>
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <strong>📐 Image Guidelines:</strong> Upload 1200x800px (3:2 ratio) for best results
                    </div>
                    <ImageUpload
                      onImageUploaded={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
                      currentImage={formData.image_url}
                      onRemoveImage={() => setFormData({...formData, image_url: ""})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Text</label>
                      <Input
                        value={formData.button_text}
                        onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                        placeholder="Apply Now"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Button Link</label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={formData.button_link}
                        onChange={(e) => setFormData({...formData, button_link: e.target.value})}
                      >
                        <option value="">Select a link</option>
                        <option value="/services/home-loan">Home Loan</option>
                        <option value="/services/personal-loan">Personal Loan</option>
                        <option value="/services/car-loan">Car Loan</option>
                        <option value="/services/used-car-loan">Used Car Loan</option>
                        <option value="/services/business-loan">Business Loan</option>
                        <option value="/services/lap">Loan Against Property</option>
                        <option value="/credit-cards">Credit Cards</option>
                        <option value="/apply">Apply Now</option>
                        <option value="/contact">Contact Us</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Order Position</label>
                      <Input
                        type="number"
                        value={formData.order_position}
                        onChange={(e) => setFormData({...formData, order_position: parseInt(e.target.value)})}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={formData.is_active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({...formData, is_active: e.target.value === 'active'})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" size="sm" className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      {editingSlide ? 'Update' : 'Create'} Slide
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetForm} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {slides.length === 0 ? (
            <p>No slides found.</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="border p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 w-full">
                      {slide.image_url && (
                        <img 
                          src={slide.image_url.startsWith('http') ? slide.image_url : `https://api.finonest.com${slide.image_url.startsWith('/') ? slide.image_url : `/uploads/images/${slide.image_url}`}`}
                          alt={slide.title}
                          className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.log('Image failed to load:', slide.image_url);
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold text-base sm:text-lg">{slide.title}</h3>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${slide.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {slide.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Order: {slide.order_position}
                            </span>
                          </div>
                        </div>
                        {slide.subtitle && (
                          <p className="text-sm text-gray-600 mb-1">{slide.subtitle}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-2">{slide.description}</p>
                        {slide.button_text && slide.button_link && (
                          <p className="text-xs text-blue-600">Button: {slide.button_text} → {slide.button_link}</p>
                        )}
                        {!slide.button_text && slide.button_link && (
                          <p className="text-xs text-blue-600">Button: Apply Now → {slide.button_link}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => editSlide(slide)} className="flex-1 sm:flex-none">
                        <Edit className="w-4 h-4" />
                        <span className="sm:hidden ml-2">Edit</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteSlide(slide.id)} className="flex-1 sm:flex-none">
                        <Trash2 className="w-4 h-4" />
                        <span className="sm:hidden ml-2">Delete</span>
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

export default AdminSlides;