import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

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

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('https://api.finonest.com/api/blogs');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBlogPosts(data.blogs || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Financial Blog | Finonest - Loan Tips & Credit Advice</title>
        <meta name="description" content="Expert financial advice, loan guides, and credit score tips. Stay updated with latest personal finance insights from Finonest." />
        <meta property="og:title" content="Finonest Blog - Financial Insights" />
        <meta property="og:description" content="Expert financial advice and loan guides" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finonest.com/blog" />
        <link rel="canonical" href="https://finonest.com/blog" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Financial Insights & Expert Advice
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed with our latest articles on loans, credit scores, and financial planning
            </p>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-primary text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && blogPosts.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-2">No blog posts yet</h2>
              <p className="text-muted-foreground">Check back soon for financial insights!</p>
            </div>
          )}

          {!loading && !error && blogPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post.id}>
                  <Link
                    to={`/blog/${post.id}`}
                    className="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={`Featured image for ${post.title}`}
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="200"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <Tag className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-primary font-medium text-sm">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default Blog;
