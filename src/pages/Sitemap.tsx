import { useEffect, useState } from 'react';

const Sitemap = () => {
  const [sitemapXml, setSitemapXml] = useState('');

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch blog posts
        const response = await fetch('https://api.finonest.com/api/blogs');
        const data = await response.json();
        const blogs = data.blogs || [];

        // Static pages
        const staticPages = [
          { url: 'https://finonest.com/', lastmod: '2025-01-17', changefreq: 'daily', priority: '1.0' },
          { url: 'https://finonest.com/about', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.9' },
          { url: 'https://finonest.com/contact', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.7' },
          { url: 'https://finonest.com/apply', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/home-loan', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/car-loan', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/used-car-loan', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/personal-loan', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/business-loan', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/credit-cards', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/loan-against-property', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/services/lap', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.7' },
          { url: 'https://finonest.com/services/finobizz-learning', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.7' },
          { url: 'https://finonest.com/credit-score', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/cibil-check', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.7' },
          { url: 'https://finonest.com/emi-calculator', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.8' },
          { url: 'https://finonest.com/blog', lastmod: '2025-01-17', changefreq: 'weekly', priority: '0.9' },
          { url: 'https://finonest.com/banking-partners', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.7' },
          { url: 'https://finonest.com/careers', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.6' },
          { url: 'https://finonest.com/branches', lastmod: '2025-01-17', changefreq: 'monthly', priority: '0.6' },
          { url: 'https://finonest.com/terms-and-conditions', lastmod: '2025-01-17', changefreq: 'yearly', priority: '0.3' },
          { url: 'https://finonest.com/privacy-policy', lastmod: '2025-01-17', changefreq: 'yearly', priority: '0.3' }
        ];

        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';

        // Add static pages
        staticPages.forEach(page => {
          xml += `  <url>\\n`;
          xml += `    <loc>${page.url}</loc>\\n`;
          xml += `    <lastmod>${page.lastmod}</lastmod>\\n`;
          xml += `    <changefreq>${page.changefreq}</changefreq>\\n`;
          xml += `    <priority>${page.priority}</priority>\\n`;
          xml += `  </url>\\n`;
        });

        // Add blog posts
        blogs.forEach((blog: any) => {
          const lastmod = new Date(blog.updated_at || blog.created_at).toISOString().split('T')[0];
          const slug = blog.slug || blog.id;
          xml += `  <url>\\n`;
          xml += `    <loc>https://finonest.com/blog/${slug}</loc>\\n`;
          xml += `    <lastmod>${lastmod}</lastmod>\\n`;
          xml += `    <changefreq>monthly</changefreq>\\n`;
          xml += `    <priority>0.7</priority>\\n`;
          xml += `  </url>\\n`;
        });

        xml += '</urlset>';
        setSitemapXml(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (sitemapXml) {
      // Set content type and return XML
      document.querySelector('html')?.setAttribute('data-content-type', 'application/xml');
    }
  }, [sitemapXml]);

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      {sitemapXml}
    </pre>
  );
};

export default Sitemap;