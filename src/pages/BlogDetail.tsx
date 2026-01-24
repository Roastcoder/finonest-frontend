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

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const sections = [
    { key: 'table_of_contents', title: 'Table of Contents', icon: '📋' },
    { key: 'introduction', title: 'Introduction', icon: '👋' },
    { key: 'quick_info_box', title: 'Loan at a Glance', icon: '⚡' },
    { key: 'emi_example', title: 'EMI Calculator Example', icon: '🧮' },
    { key: 'what_is_loan', title: 'What is this Loan?', icon: '❓' },
    { key: 'benefits', title: 'Benefits', icon: '✅' },
    { key: 'who_should_apply', title: 'Who Should Apply?', icon: '👥' },
    { key: 'eligibility_criteria', title: 'Eligibility Criteria', icon: '📋' },
    { key: 'documents_required', title: 'Documents Required', icon: '📄' },
    { key: 'interest_rates', title: 'Interest Rate & Charges', icon: '💰' },
    { key: 'finonest_process', title: 'How Finonest Process Works', icon: '🔄' },
    { key: 'why_choose_finonest', title: 'Why Choose Finonest?', icon: '🏆' },
    { key: 'customer_testimonials', title: 'Customer Testimonials', icon: '💬' },
    { key: 'common_mistakes', title: 'Common Mistakes to Avoid', icon: '⚠️' },
    { key: 'mid_blog_cta', title: 'Apply Now', icon: '🚀' },
    { key: 'faqs', title: 'Frequently Asked Questions', icon: '❓' },
    { key: 'service_areas', title: 'Service Areas', icon: '📍' },
    { key: 'related_blogs', title: 'Related Articles', icon: '🔗' },
    { key: 'disclaimer', title: 'Disclaimer', icon: '⚖️' },
    { key: 'trust_footer', title: 'Trust & Compliance', icon: '🛡️' }
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
    "image": blog.image_url ? (blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`) : "https://finonest.com/assets/logo.png",
    "author": {
      "@type": "Person",
      "name": blog.author,
      "url": "https://finonest.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Finonest",
      "logo": {
        "@type": "ImageObject",
        "url": "https://finonest.com/assets/logo.png",
        "width": 200,
        "height": 60
      },
      "url": "https://finonest.com"
    },
    "datePublished": blog.created_at,
    "dateModified": blog.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://finonest.com/blog/${blog.slug || blog.id}`
    },
    "articleSection": blog.category,
    "keywords": blog.meta_tags || `${blog.category}, loans, finance, finonest`,
    "wordCount": blog.content ? blog.content.split(' ').length : 0,
    "inLanguage": "en-US"
  };

  const faqStructuredData = blog.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": parseFAQs(blog.faqs).map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://finonest.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://finonest.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://finonest.com/blog/${blog.slug || blog.id}`
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{blog.meta_title || blog.title} | Finonest Blog</title>
        <meta name="description" content={blog.meta_description || blog.excerpt} />
        <meta name="keywords" content={blog.meta_tags || `${blog.category}, loans, finance, finonest`} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={blog.author} />
        <meta name="article:published_time" content={blog.created_at} />
        <meta name="article:modified_time" content={blog.created_at} />
        <meta name="article:section" content={blog.category} />
        <meta name="article:tag" content={blog.meta_tags || `${blog.category}, loans, finance, finonest`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.meta_title || blog.title} />
        <meta property="og:description" content={blog.meta_description || blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://finonest.com/blog/${blog.slug || blog.id}`} />
        <meta property="og:site_name" content="Finonest" />
        <meta property="og:locale" content="en_US" />
        {blog.image_url && <meta property="og:image" content={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`} />}
        {blog.image_url && <meta property="og:image:width" content="1200" />}
        {blog.image_url && <meta property="og:image:height" content="630" />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.meta_title || blog.title} />
        <meta name="twitter:description" content={blog.meta_description || blog.excerpt} />
        {blog.image_url && <meta name="twitter:image" content={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`} />}
        <meta name="twitter:site" content="@finonest" />
        
        <link rel="canonical" href={`https://finonest.com/blog/${blog.slug || blog.id}`} />
        <link rel="alternate" type="application/rss+xml" title="Finonest Blog RSS" href="https://finonest.com/blog/rss" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        {faqStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container max-w-full px-4 pt-24 pb-8">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
                className="mb-6 hover:bg-blue-50 text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-lg">
                  <Tag className="w-3 h-3" />
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center gap-6 text-gray-500 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                {navigator.share && (
                  <Button variant="outline" size="sm" onClick={handleShare} className="ml-auto">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="container max-w-full px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={blog.image_url.startsWith('http') ? blog.image_url : `https://api.finonest.com${blog.image_url}`}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container max-w-full px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="prose prose-lg max-w-none">
                {sections.map((section) => {
                  const sectionData = blog[section.key as keyof BlogPost];
                  if (!sectionData) return null;

                  if (section.key === 'faqs' && blog.faqs) {
                    return (
                      <div key={section.key} className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{section.icon}</span>
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900">
                            {section.title}
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {parseFAQs(blog.faqs).map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                              >
                                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  openFAQ === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {openFAQ === index ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </div>
                              </button>
                              {openFAQ === index && (
                                <div className="px-6 pb-4 text-gray-700 border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                                  <p className="pt-4 leading-relaxed">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.key === 'customer_testimonials' && blog.customer_testimonials) {
                    const testimonials = blog.customer_testimonials.split('\n').filter(t => t.trim());
                    return (
                      <div key={section.key} className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{section.icon}</span>
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900">
                            {section.title}
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {testimonials.map((testimonial, index) => {
                            const match = testimonial.match(/"([^"]+)"\s*-\s*(.+)/);
                            if (!match) return null;
                            const [, quote, author] = match;
                            return (
                              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg">"</span>
                                  </div>
                                  <div>
                                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{quote}"</p>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-600" />
                                      </div>
                                      <span className="font-semibold text-gray-900">{author}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (section.key === 'mid_blog_cta' && (blog.final_cta || blog.final_cta_text)) {
                    return (
                      <div key={section.key} className="mb-16">
                        <div className="text-center">
                          <Button 
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            <a href={blog.final_cta || "https://finonest.com/apply-now"} target="_blank" rel="noopener noreferrer">
                              {blog.final_cta_text || "Apply Now"}
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={section.key} className="mb-16">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{section.icon}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-xl p-6 border-l-4 border-blue-500">
                        <div 
                          className="prose-content text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderFormattedText(sectionData as string) }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Button */}
        {blog.final_cta && (
          <div className="container max-w-full px-4 pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-6">Take the next step towards your financial goals</p>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <a href={blog.final_cta} target="_blank" rel="noopener noreferrer">
                      {blog.final_cta_text || "Apply Now - Get Instant Approval!"}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video */}
        {blog.video_url && (
          <div className="container max-w-full px-4 pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">▶</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Video Guide</h3>
                </div>
                <div className="relative overflow-hidden rounded-xl shadow-lg">
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