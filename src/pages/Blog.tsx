import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";

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

  useEffect(() => {
    fetch('https://api.finonest.com/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogPosts(data.blogs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Finonest</title>
      </Helmet>

      <Navbar />

      <main style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'yellow' }}>
            <a href="/blog/1" style={{ color: 'blue', textDecoration: 'underline' }}>TEST LINK - Right click me</a>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
            Financial Insights & Expert Advice
          </h1>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : blogPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>No blog posts found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {blogPosts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '20px' }}>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: '#0a3055',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      marginBottom: '12px'
                    }}>
                      {post.category}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                      {post.title}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af' }}>
                      <span>{post.author}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#0a3055',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Read More →
                      </span>
                    </div>
                  </div>
                </a>
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
