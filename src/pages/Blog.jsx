import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/blog.css';

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Wedding',
    title: 'How to Choose the Perfect Wedding Photographer in Hyderabad',
    excerpt: 'Your wedding photos are forever. Here\'s a comprehensive guide to finding a photographer whose style, personality, and pricing align perfectly with your dream wedding.',
    author: 'Priya Sharma',
    authorInitials: 'PS',
    authorColor: '#e91e8c',
    date: 'May 20, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    category: 'Tips',
    title: '10 Poses That Make Every Pre-Wedding Shoot Look Stunning',
    excerpt: 'Pre-wedding shoots are all about telling your love story naturally. Discover the top poses that candid photographers swear by for effortless, cinematic shots.',
    author: 'Rahul Verma',
    authorInitials: 'RV',
    authorColor: '#7c3aed',
    date: 'May 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80',
    featured: false,
  },
  {
    id: 3,
    category: 'Maternity',
    title: 'Capturing the Glow: A Guide to Maternity Photography',
    excerpt: 'Maternity shoots celebrate one of life\'s most beautiful chapters. Learn what to wear, when to shoot, and how to prepare for a maternity session you\'ll treasure forever.',
    author: 'Ananya Reddy',
    authorInitials: 'AR',
    authorColor: '#0ea5e9',
    date: 'May 10, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    featured: false,
  },
  {
    id: 4,
    category: 'Product',
    title: 'Product Photography That Actually Sells: A Seller\'s Handbook',
    excerpt: 'Great product images can increase conversions by over 80%. Learn lighting techniques, backgrounds, and angles that make your products irresistible online.',
    author: 'Karthik Rao',
    authorInitials: 'KR',
    authorColor: '#f59e0b',
    date: 'May 5, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    featured: false,
  },
  {
    id: 5,
    category: 'Tips',
    title: 'Golden Hour vs Blue Hour: Which is Better for Outdoor Shoots?',
    excerpt: 'Both golden hour and blue hour offer magical lighting — but they create very different moods. Find out which works best for your photography style and subject.',
    author: 'Akhil Reddy',
    authorInitials: 'AR',
    authorColor: '#10b981',
    date: 'Apr 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    category: 'Studio',
    title: 'Renting a Photography Studio in Hyderabad: What You Need to Know',
    excerpt: 'Studio rentals can be intimidating for first-timers. Here\'s everything you need to know about what to look for, how to budget, and what questions to ask before booking.',
    author: 'Priya Sharma',
    authorInitials: 'PS',
    authorColor: '#e91e8c',
    date: 'Apr 20, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Wedding', 'Maternity', 'Product', 'Tips', 'Studio'];

const CATEGORY_COLORS = {
  Wedding: { bg: '#fce7f3', text: '#db2777' },
  Maternity: { bg: '#e0f2fe', text: '#0369a1' },
  Product: { bg: '#fef3c7', text: '#b45309' },
  Tips: { bg: '#ede9fe', text: '#7c3aed' },
  Studio: { bg: '#d1fae5', text: '#065f46' },
  All: { bg: '#f1f5f9', text: '#475569' },
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = BLOG_POSTS.find(p => p.featured);
  const filtered = BLOG_POSTS.filter(p => !p.featured && (activeCategory === 'All' || p.category === activeCategory));

  return (
    <div className="blog-root">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="container">
          <div className="blog-hero-layout">
            <div className="blog-hero-inner">
              <span className="blog-hero-tag">Our Blogs</span>
              <h1 className="blog-hero-title">Photography Insights &amp; Inspiration</h1>
              <p className="blog-hero-sub">Tips, guides, and stories from professional photographers across Hyderabad.</p>
              <div className="blog-hero-stats">
                <div className="blog-hero-stat"><strong>6+</strong><span>Articles</span></div>
                <div className="blog-hero-stat-divider"></div>
                <div className="blog-hero-stat"><strong>5</strong><span>Categories</span></div>
                <div className="blog-hero-stat-divider"></div>
                <div className="blog-hero-stat"><strong>Weekly</strong><span>Updates</span></div>
              </div>
            </div>
            <div className="blog-hero-cover">
              <img
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80"
                alt="Photography blog cover"
                className="blog-hero-cover-img"
              />
              <div className="blog-hero-cover-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Post */}
        {featured && (activeCategory === 'All') && (
          <div className="blog-featured-card">
            <div className="blog-featured-img-wrap">
              <img src={featured.image} alt={featured.title} className="blog-featured-img" />
              <span className="blog-cat-badge" style={{ background: CATEGORY_COLORS[featured.category]?.bg, color: CATEGORY_COLORS[featured.category]?.text }}>
                {featured.category}
              </span>
            </div>
            <div className="blog-featured-body">
              <span className="blog-featured-label">⭐ Featured Post</span>
              <h2 className="blog-featured-title">{featured.title}</h2>
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
              <div className="blog-card-meta">
                <div className="blog-author">
                  <div className="blog-author-avatar" style={{ background: featured.authorColor }}>{featured.authorInitials}</div>
                  <span>{featured.author}</span>
                </div>
                <span className="blog-meta-dot">·</span>
                <span>{featured.date}</span>
                <span className="blog-meta-dot">·</span>
                <span><i className="fa-regular fa-clock"></i> {featured.readTime}</span>
              </div>
              <button className="blog-read-btn">
                Read Article <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="blog-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`blog-cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filtered.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-img-wrap">
                <img src={post.image} alt={post.title} className="blog-card-img" />
                <span className="blog-cat-badge" style={{ background: CATEGORY_COLORS[post.category]?.bg, color: CATEGORY_COLORS[post.category]?.text }}>
                  {post.category}
                </span>
              </div>
              <div className="blog-card-body">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <div className="blog-author">
                    <div className="blog-author-avatar" style={{ background: post.authorColor }}>{post.authorInitials}</div>
                    <span>{post.author}</span>
                  </div>
                  <span className="blog-meta-dot">·</span>
                  <span><i className="fa-regular fa-clock"></i> {post.readTime}</span>
                </div>
                <button className="blog-card-read-btn">
                  Read More <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="blog-empty">
            <i className="fa-regular fa-newspaper"></i>
            <p>No posts in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
