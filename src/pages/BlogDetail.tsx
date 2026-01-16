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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://api.finonest.com/api/blogs/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading article...</div>
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'This blog post does not exist.'}</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.image_url,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Finonest",
      "logo": {
        "@type": "ImageObject",
        "url": "https://finonest.com/logo.png"
      }
    },
    "datePublished": blog.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://finonest.com/blog/${blog.id}`
    }
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Finonest Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://finonest.com/blog/${blog.id}`} />
        {blog.image_url && <meta property="og:image" content={blog.image_url} />}
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:author" content={blog.author} />
        <link rel="canonical" href={`https://finonest.com/blog/${blog.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        <article className="pt-24 pb-12">
          <div className="container max-w-4xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3" />
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {blog.title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.created_at)}
                  </div>
                </div>
                {navigator.share && (
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </header>

            {blog.image_url && (
              <div className="mb-8">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  loading="eager"
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            <div className="space-y-4 text-base leading-relaxed">
              {blog.content.split('\n').map((line, index) => {
                line = line.trim();
                if (!line) return null;
                
                // Numbered list items with bold headings
                const numberedMatch = line.match(/^(\d+)\.\s+\*\*(.*?)\*\*:?\s*(.*)/);
                if (numberedMatch) {
                  return (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {numberedMatch[1]}. {numberedMatch[2]}
                      </h3>
                      {numberedMatch[3] && (
                        <p className="text-muted-foreground ml-6">{numberedMatch[3]}</p>
                      )}
                    </div>
                  );
                }
                
                // Bold text
                if (line.includes('**')) {
                  const parts = line.split(/\*\*(.*?)\*\*/);
                  return (
                    <p key={index} className="text-muted-foreground">
                      {parts.map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
                      )}
                    </p>
                  );
                }
                
                // Regular paragraph
                return <p key={index} className="text-muted-foreground">{line}</p>;
              })}
            </div>

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
