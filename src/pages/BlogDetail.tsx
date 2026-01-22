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
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const sections = [
    { key: 'introduction', title: 'Introduction', icon: '📖' },
    { key: 'table_of_contents', title: 'Table of Contents', icon: '📋' },
    { key: 'quick_info_box', title: 'Loan at a Glance', icon: '📊' },
    { key: 'emi_example', title: 'EMI Calculator', icon: '💰' },
    { key: 'what_is_loan', title: 'What is Personal Loan?', icon: '🤔' },
    { key: 'benefits', title: 'Benefits', icon: '✅' },
    { key: 'who_should_apply', title: 'Who Should Apply?', icon: '👥' },
    { key: 'eligibility_criteria', title: 'Eligibility Criteria', icon: '📋' },
    { key: 'documents_required', title: 'Documents Required', icon: '📄' },
    { key: 'interest_rates', title: 'Interest Rates & Charges', icon: '💳' },
    { key: 'finonest_process', title: 'Finonest Process', icon: '🔄' },
    { key: 'why_choose_finonest', title: 'Why Choose Finonest?', icon: '⭐' },
    { key: 'customer_testimonials', title: 'Customer Testimonials', icon: '💬' },
    { key: 'common_mistakes', title: 'Common Mistakes', icon: '⚠️' },
    { key: 'mid_blog_cta', title: 'Apply Now', icon: '🚀' },
    { key: 'faqs', title: 'FAQs', icon: '❓' },
    { key: 'service_areas', title: 'Service Areas', icon: '📍' },
    { key: 'related_blogs', title: 'Related Blogs', icon: '🔗' },
    { key: 'final_cta', title: 'Final Call to Action', icon: '🎯' },
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

  const renderSectionContent = () => {
    if (!blog) return null;

    const sectionData = blog[activeSection as keyof BlogPost];
    if (!sectionData) return <div className="text-gray-500 text-center py-12">No content available for this section.</div>;

    const section = sections.find(s => s.key === activeSection);
    
    if (activeSection === 'faqs' && blog.faqs) {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
            <span className="text-2xl">{section?.icon}</span>
            {section?.title}
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
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
          <span className="text-2xl">{section?.icon}</span>
          {section?.title}
        </h2>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderFormattedText(sectionData as string) }} />
      </div>
    );
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
          <div className="container max-w-7xl pt-24 pb-8">
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

        {/* Content Layout */}
        <div className="container max-w-7xl py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Section Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Sections</h3>
                <div className="space-y-2">
                  {sections.map((section) => {
                    const hasContent = blog[section.key as keyof BlogPost];
                    if (!hasContent) return null;
                    
                    return (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                          activeSection === section.key
                            ? 'bg-blue-50 border-blue-200 text-blue-900'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{section.icon}</span>
                          <span className="font-medium text-sm">{section.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Right Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-lg border min-h-[600px]">
                {renderSectionContent()}
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