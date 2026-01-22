import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Tag, Share2, ChevronDown, ChevronUp } from "lucide-react";

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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const parseFAQs = (faqText: string) => {
    const faqs = [];
    const lines = faqText.split('\n');
    let currentQ = '';
    let currentA = '';
    
    for (const line of lines) {
      if (line.trim().startsWith('**Q:') || line.trim().startsWith('Q:')) {
        if (currentQ && currentA) {
          faqs.push({ question: currentQ, answer: currentA });
        }
        currentQ = line.replace(/\*\*Q:\s*|Q:\s*/g, '').replace(/\*\*/g, '');
        currentA = '';
      } else if (line.trim().startsWith('**A:') || line.trim().startsWith('A:')) {
        currentA = line.replace(/\*\*A:\s*|A:\s*/g, '').replace(/\*\*/g, '');
      } else if (currentA && line.trim()) {
        currentA += ' ' + line.trim();
      }
    }
    
    if (currentQ && currentA) {
      faqs.push({ question: currentQ, answer: currentA });
    }
    
    return faqs;
  };

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

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container max-w-6xl pt-24 pb-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    <Tag className="w-3 h-3" />
                    {blog.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  {blog.title}
                </h1>
                
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.created_at)}
                  </div>
                  {navigator.share && (
                    <Button variant="outline" size="sm" onClick={handleShare} className="border-white/30 text-white hover:bg-white/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
              
              {blog.image_url && (
                <div className="lg:col-span-1">
                  <img
                    src={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`}
                    alt={blog.title}
                    className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container max-w-6xl py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            {blog.table_of_contents && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">📋 Table of Contents</h3>
                    <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.table_of_contents) }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Content */}
            <div className={`${blog.table_of_contents ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <div className="space-y-8">
                {blog.introduction && (
                  <section className="bg-white rounded-2xl p-8 shadow-lg border">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">📖</span>
                      Introduction
                    </h2>
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.introduction) }} />
                  </section>
                )}
                
                {blog.quick_info_box && (
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200">
                    <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">📊</span>
                      Loan at a Glance
                    </h3>
                    <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.quick_info_box) }} />
                  </section>
                )}
                
                {blog.emi_example && (
                  <section className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-200">
                    <h3 className="text-2xl font-bold mb-6 text-green-900 flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-lg">💰</span>
                      EMI Calculator Example
                    </h3>
                    <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.emi_example) }} />
                  </section>
                )}
                
                {blog.what_is_loan && (
                  <section className="bg-white rounded-2xl p-8 shadow-lg border">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <span className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">🤔</span>
                      What is Personal Loan?
                    </h2>
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.what_is_loan) }} />
                  </section>
                )}
                
                {blog.benefits && (
                  <section className="bg-white rounded-2xl p-8 shadow-lg border">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">✅</span>
                      Benefits
                    </h2>
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.benefits) }} />
                  </section>
                )}

                {blog.faqs && (
                  <section className="bg-white rounded-2xl p-8 shadow-lg border">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                      <span className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">❓</span>
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {parseFAQs(blog.faqs).map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-200 group"
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                          >
                            <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{faq.question}</span>
                            <div className="ml-4 flex-shrink-0">
                              {openFAQ === index ? (
                                <ChevronUp className="w-5 h-5 text-blue-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              )}
                            </div>
                          </button>
                          {openFAQ === index && (
                            <div className="px-6 pb-4 text-gray-700 bg-gray-50 border-t border-gray-100">
                              <p className="pt-4 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {blog.final_cta && (
                  <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center shadow-xl">
                    <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.final_cta) }} />
                  </section>
                )}
                
                {blog.disclaimer && (
                  <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <span className="text-lg">⚖️</span>
                      Disclaimer & Compliance Notice
                    </h3>
                    <div className="text-sm text-gray-600 prose prose-sm" dangerouslySetInnerHTML={{ __html: renderFormattedText(blog.disclaimer) }} />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>

        {blog.video_url && (
          <div className="container max-w-4xl pb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">📹 Video Guide</h3>
              <video
                controls
                className="w-full rounded-xl"
                poster={blog.image_url ? (blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`) : undefined}
              >
                <source src={blog.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default BlogDetail;