import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: string;
  created_at: string;
  image_url?: string;
  video_url?: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (blogId: string) => {
    try {
      console.log('Fetching blog with ID:', blogId);
      const response = await fetch(`https://api.finonest.com/api/blogs/${blogId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Blog data:', data);
        setBlog(data.blog);
      } else {
        console.error('Failed to fetch blog, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} - Finonest Blog</title>
        <meta name="description" content={blog.excerpt} />
        <link rel="canonical" href={`https://finonest.com/blog/${blog.id}`} />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        <article className="pt-24 pb-12">
          <div className="container max-w-4xl">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3" />
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {blog.title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.created_at)}
                  </div>
                  <span>{getReadTime(blog.content)}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            {blog.image_url && (
              <div className="mb-8">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Video */}
            {blog.video_url && (
              <div className="mt-8">
                <video
                  controls
                  className="w-full rounded-xl"
                  poster={blog.image_url}
                >
                  <source src={blog.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default BlogDetail;