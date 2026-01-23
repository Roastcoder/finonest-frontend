import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  created_at: string;
  image_url?: string;
}

const BlogSimple = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('https://api.finonest.com/api/blogsb')
      .then(res => res.json())
      .then(data => setBlogs(data.blogs || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>Blog Posts</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {blogs.map(post => (
              <a 
                key={post.id}
                href={`/blog/${post.id}`}
                style={{
                  display: 'block',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: 'white'
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
                  <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{post.title}</h2>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>{post.excerpt}</p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogSimple;
