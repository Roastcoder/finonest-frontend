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
  slug?: string;
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

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderFormattedText = (text: string) => {
    return text
      .replace(/#{6}\s*(.*?)$/gm, '<h6>$1</h6>')
      .replace(/#{5}\s*(.*?)$/gm, '<h5>$1</h5>')
      .replace(/#{4}\s*(.*?)$/gm, '<h4>$1</h4>')
      .replace(/#{3}\s*(.*?)$/gm, '<h3>$1</h3>')
      .replace(/#{2}\s*(.*?)$/gm, '<h2>$1</h2>')
      .replace(/#{1}\s*(.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*{4,}(.*?)\*{4,}/g, '<strong>$1</strong>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
      .replace(/•/g, '&bull;')
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        // Check if id is numeric - use ID endpoint, otherwise use slug endpoint
        const isNumeric = /^\d+$/.test(id);
        const url = isNumeric 
          ? `https://api.finonest.com/api/blogs/${id}`
          : `https://api.finonest.com/api/blogs/slug/${id}`;
        
        const res = await fetch(url);
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
      "@id": `https://finonest.com/blog/${blog.slug || blog.id}`
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
        <meta property="og:url" content={`https://finonest.com/blog/${blog.slug || blog.id}`} />
        {blog.image_url && <meta property="og:image" content={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`} />}
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:author" content={blog.author} />
        <link rel="canonical" href={`https://finonest.com/blog/${blog.slug || blog.id}`} />
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
                  src={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`}
                  alt={blog.title}
                  loading="eager"
                  className="w-full h-64 md:h-96 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}

            <div className="space-y-8 text-base leading-relaxed">
              {blog.table_of_contents && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.table_of_contents) }} />
                </section>
              )}
              
              {blog.introduction && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.introduction) }} />
                </section>
              )}
              
              {blog.quick_info_box && (
                <section className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Loan at a Glance</h3>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.quick_info_box) }} />
                </section>
              )}
              
              {blog.emi_example && (
                <section className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">EMI Calculator Example</h3>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.emi_example) }} />
                </section>
              )}
              
              {blog.what_is_loan && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">What is Personal Loan?</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.what_is_loan) }} />
                </section>
              )}
              
              {blog.benefits && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.benefits) }} />
                </section>
              )}
              
              {blog.who_should_apply && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Who Should Apply for This Loan?</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.who_should_apply) }} />
                </section>
              )}
              
              {blog.eligibility_criteria && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Eligibility Criteria</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.eligibility_criteria) }} />
                </section>
              )}
              
              {blog.documents_required && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Documents Required</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.documents_required) }} />
                </section>
              )}
              
              {blog.interest_rates && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Interest Rate & Charges Disclosure</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.interest_rates) }} />
                </section>
              )}
              
              {blog.finonest_process && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">How Finonest Loan Process Works</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.finonest_process) }} />
                </section>
              )}
              
              {blog.why_choose_finonest && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Why Choose Finonest?</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.why_choose_finonest) }} />
                </section>
              )}
              
              {blog.customer_testimonials && (
                <section className="bg-yellow-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">Customer Testimonials</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.customer_testimonials) }} />
                </section>
              )}
              
              {blog.common_mistakes && (
                <section className="bg-red-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">Common Mistakes to Avoid</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.common_mistakes) }} />
                </section>
              )}
              
              {blog.mid_blog_cta && (
                <section className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.mid_blog_cta) }} />
                </section>
              )}
              
              {blog.faqs && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQs)</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.faqs) }} />
                </section>
              )}
              
              {blog.service_areas && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Service Areas / Local Presence</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.service_areas) }} />
                </section>
              )}
              
              {blog.related_blogs && (
                <section className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4">Related Blogs & Internal Links</h2>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.related_blogs) }} />
                </section>
              )}
              
              {blog.final_cta && (
                <section className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.final_cta) }} />
                </section>
              )}
              
              {blog.disclaimer && (
                <section className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <h3 className="font-semibold mb-2">Disclaimer & Compliance Notice</h3>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.disclaimer) }} />
                </section>
              )}
              
              {blog.trust_footer && (
                <section className="bg-green-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-3">Trust & Compliance</h3>
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.trust_footer) }} />
                </section>
              )}
            </div>

            {blog.video_url && (
              <div className="mt-8">
                <video
                  controls
                  className="w-full rounded-xl"
                  poster={blog.image_url ? (blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`) : undefined}
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
