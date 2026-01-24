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

  const sections = [
    { key: 'table_of_contents', title: 'Table of Contents' },
    { key: 'introduction', title: 'Introduction' },
    { key: 'quick_info_box', title: 'Loan at a Glance' },
    { key: 'emi_example', title: 'EMI Calculator Example' },
    { key: 'what_is_loan', title: 'What is Personal Loan?' },
    { key: 'benefits', title: 'Benefits' },
    { key: 'who_should_apply', title: 'Who Should Apply?' },
    { key: 'eligibility_criteria', title: 'Eligibility Criteria' },
    { key: 'documents_required', title: 'Documents Required' },
    { key: 'interest_rates', title: 'Interest Rate & Charges' },
    { key: 'finonest_process', title: 'How Finonest Process Works' },
    { key: 'why_choose_finonest', title: 'Why Choose Finonest?' },
    { key: 'customer_testimonials', title: 'Customer Testimonials' },
    { key: 'common_mistakes', title: 'Common Mistakes to Avoid' },
    { key: 'mid_blog_cta', title: 'Apply Now' },
    { key: 'faqs', title: 'Frequently Asked Questions' },
    { key: 'service_areas', title: 'Service Areas' },
    { key: 'related_blogs', title: 'Related Blogs' },
    { key: 'final_cta', title: 'Final Call to Action' },
    { key: 'disclaimer', title: 'Disclaimer' },
    { key: 'trust_footer', title: 'Trust & Compliance' }
  ];

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
      .replace(/#{6}\s*(.*?)$/gm, '<h6 class="text-base font-semibold mb-2">$1</h6>')
      .replace(/#{5}\s*(.*?)$/gm, '<h5 class="text-lg font-semibold mb-2">$1</h5>')
      .replace(/#{4}\s*(.*?)$/gm, '<h4 class="text-xl font-semibold mb-3">$1</h4>')
      .replace(/#{3}\s*(.*?)$/gm, '<h3 class="text-xl font-bold mb-3">$1</h3>')
      .replace(/#{2}\s*(.*?)$/gm, '<h2 class="text-2xl font-bold mb-4">$1</h2>')
      .replace(/#{1}\s*(.*?)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
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
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container max-w-4xl pt-24 pb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                <Tag className="w-3 h-3" />
                {blog.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {blog.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {blog.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.created_at)}
              </div>
              {navigator.share && (
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="container max-w-4xl py-8">
            <img
              src={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="container max-w-4xl pb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              {sections.map((section) => {
                const sectionData = blog[section.key as keyof BlogPost];
                if (!sectionData) return null;

                if (section.key === 'faqs' && blog.faqs) {
                  return (
                    <div key={section.key} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {parseFAQs(blog.faqs).map((faq, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg">
                            <button
                              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {openFAQ === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                            {openFAQ === index && (
                              <div className="px-4 pb-3 text-gray-700 border-t border-gray-100">
                                <p className="pt-3">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={section.key} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
                      {section.title}
                    </h2>
                    <div 
                      className="prose-content"
                      dangerouslySetInnerHTML={{ __html: renderFormattedText(sectionData as string) }} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Video */}
        {blog.video_url && (
          <div className="container max-w-4xl pb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Video Guide</h3>
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