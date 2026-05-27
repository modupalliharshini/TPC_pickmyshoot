import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PHOTOGRAPHERS } from '../data/database';
import InquiryModal from '../components/InquiryModal';
import WhatsAppChat from '../components/WhatsAppChat';
import '../css/main.css';
import '../css/profile.css';

export default function ProfileDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Find photographer from data
  const photographer = PHOTOGRAPHERS.find(p => p.id === id) || PHOTOGRAPHERS[0];

  // Tab state
  const [activeTab, setActiveTab] = useState('about');

  // Popup overlay states
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  // Sync tab query parameter & favorites
  useEffect(() => {
    let tabParam = searchParams.get('tab') || 'about';
    
    // Coerce portfolio back to about for individual photographers
    if (!photographer.isStudio && tabParam === 'portfolio') {
      tabParam = 'about';
    }
    
    setActiveTab(tabParam);

    // Sync favorite state
    const storedFavs = localStorage.getItem('pickmyshoot_favorites');
    const favArray = storedFavs ? JSON.parse(storedFavs) : [];
    setFavorites(favArray);
    setIsSaved(favArray.includes(photographer.id));
  }, [searchParams, photographer]);

  const handleTabClick = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleProfileFavToggle = () => {
    let nextFavs = [...favorites];
    const index = nextFavs.indexOf(photographer.id);
    if (index === -1) {
      nextFavs.push(photographer.id);
      setIsSaved(true);
    } else {
      nextFavs.splice(index, 1);
      setIsSaved(false);
    }
    localStorage.setItem('pickmyshoot_favorites', JSON.stringify(nextFavs));
    setFavorites(nextFavs);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  // Switch to About and scroll to works section for individual photographer scroll
  const handleViewGalleryClick = () => {
    if (photographer.isStudio) {
      handleTabClick('portfolio');
    } else {
      handleTabClick('about');
      setTimeout(() => {
        const worksSec = document.querySelector('.works-section');
        if (worksSec) {
          worksSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Mock data for reviews
  const reviews = [
    { name: "Sneha Reddy", rating: 5, text: "Absolutely incredible team! The Wedding Story captured our wedding so beautifully. The candid shots were extremely natural, and the video team did a fantastic job with the cinematic trailer. Everyone in our family was very impressed." },
    { name: "Rahul Verma", rating: 5, text: "Excellent experience. Very professional crew, they came on time and guided us throughout the shoot. The album print quality is premium and delivered within the promised 10 days. Highly recommend their Premium Package." },
    { name: "Amit Sharma", rating: 4, text: "Great wedding photography! The team was creative and very cooperative. The only minor thing was that the photo editing took 3 days longer than expected, but the final output was absolutely worth the wait. Great color grading!" }
  ];

  // Mock data for FAQs
  const faqs = [
    { q: "What is your photography files delivery timeline?", a: "We usually deliver the fully color-graded and edited digital images within 10 to 15 business days. Handcrafted photo albums take another 7 to 10 days after you complete selections." },
    { q: "Do you charge extra travel fees inside Hyderabad?", a: "No extra travel fees apply for shoots situated within the Hyderabad Metropolitan Area. For locations far outside OR outstation shoots, travel and accommodation fees are billed at actual cost." },
    { q: "Do we get raw, unedited photography files?", a: "We provide raw unedited files only in our Luxury Package. For Essential and Premium packages, we provide high-resolution, color-corrected JPEGs." },
    { q: "What is your booking cancellation and refund policy?", a: "We require a 20% advance payment to lock in your date. Cancellations made at least 15 days before the event receive a full refund. Cancellations after that are non-refundable but can be adjusted to another booking date." }
  ];

  const gallery = photographer.gallery || [];
  const portfolioImages = [...gallery, ...gallery, ...gallery].slice(0, 9);

  return (
    <div className="profile-details-root">
      {/* Profile Actions Toolbar */}
      <section className="container mt-4">
        <div className="profile-actions-bar">
          <Link 
            to={photographer.isStudio ? '/search?studios=true' : '/search?individuals=true'} 
            className="profile-action-btn"
            id="profile-back-to-listings"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to listings
          </Link>
          
          <div className="profile-actions-right">
            <span className="profile-action-btn" onClick={handleCopyLink} title="Copy profile URL">
              <i className="fa-solid fa-share-nodes"></i> Share
            </span>
            <span className="profile-action-btn" onClick={handleProfileFavToggle} title="Save profile to favorites">
              <i className={`${isSaved ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`}></i> Save
            </span>
          </div>
        </div>
      </section>

      {/* Hero Photo Gallery Grid (Studio only) */}
      {photographer.isStudio && (
        <section className="container">
          <div className="gallery-grid" id="profile-gallery-grid" style={{ display: 'grid' }}>
            <div className="gallery-left">
              <img src={gallery[0] || '/assets/wedding_hero.png'} alt={`${photographer.name} Main Photo`} />
              <button 
                className={`gallery-fav-btn ${isSaved ? 'active' : ''}`} 
                onClick={handleProfileFavToggle}
                title="Save to favorites"
              >
                <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
              </button>
            </div>
            <div className="gallery-right">
              <div className="gallery-thumb"><img src={gallery[1] || '/assets/prewedding_shoot.png'} alt="Portfolio Thumbnail 1" /></div>
              <div className="gallery-thumb"><img src={gallery[2] || '/assets/candid_shoot.png'} alt="Portfolio Thumbnail 2" /></div>
              <div className="gallery-thumb"><img src={gallery[3] || '/assets/maternity_shoot.png'} alt="Portfolio Thumbnail 3" /></div>
              <div className="gallery-thumb">
                <img src={gallery[4] || '/assets/baby_shoot.png'} alt="Portfolio Thumbnail 4" />
                <div className="gallery-overlay" onClick={handleViewGalleryClick}>
                  <span className="gallery-overlay-count">+25</span>
                  <span>View Gallery</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile Metadata Header */}
      <section className="container">
        <div className="profile-meta-block">
          <div className="profile-meta-left">
            {/* Circular avatar profile logo */}
            {(!photographer.isStudio && photographer.image) ? (
              <div className="profile-avatar-lg" style={{ backgroundColor: 'transparent', padding: '0', display: 'block' }}>
                <img 
                  src={photographer.image} 
                  alt={photographer.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
            ) : (
              <div className="profile-avatar-lg" style={{ backgroundColor: photographer.avatarColor }}>
                {photographer.avatarText}
              </div>
            )}
            
            <div className="profile-title-details">
              <h1 id="profile-name">
                {photographer.name}&nbsp;
                {photographer.verified && <i className="fa-solid fa-circle-check" style={{ color: '#2196f3', fontSize: '20px' }} title="Verified Professional"></i>}
              </h1>
              
              <div className="profile-subtitle-line" id="profile-meta-line">
                <span><i className="fa-solid fa-star" style={{ color: '#ffb400' }}></i> {photographer.rating.toFixed(1)} ({photographer.reviews} Reviews)</span>
                <span>•</span>
                {!photographer.isStudio ? (
                  <>
                    <span>{photographer.age} Years Old</span>
                    <span>•</span>
                    <span>{photographer.experience}+ Years Experience</span>
                    <span>•</span>
                    <span className="text-accent" style={{ fontWeight: 800 }}>₹{photographer.chargePerHour.toLocaleString('en-IN')}/hour</span>
                  </>
                ) : (
                  <span>{photographer.experience}+ Years Experience</span>
                )}
              </div>
              
              <div className="profile-location-line" id="profile-location-line">
                <i className="fa-solid fa-location-dot"></i> {photographer.location}, {photographer.city}
              </div>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="profile-meta-right">
            <button className="btn btn-primary open-inquiry-modal-btn" onClick={() => setInquiryOpen(true)}>
              Send Inquiry <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button className="btn btn-whatsapp" id="whatsapp-trigger-btn" onClick={() => setWhatsappOpen(true)}>
              <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <section className="container">
        <div className="profile-tabs-bar">
          <div 
            className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabClick('about')}
          >
            About
          </div>
          {photographer.isStudio && (
            <>
              <div 
                className={`profile-tab ${activeTab === 'packages' ? 'active' : ''}`}
                onClick={() => handleTabClick('packages')}
              >
                Packages
              </div>
              <div 
                className={`profile-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => handleTabClick('portfolio')}
              >
                Portfolio
              </div>
            </>
          )}
          <div 
            className={`profile-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabClick('reviews')}
          >
            Reviews
          </div>
          {photographer.isStudio && (
            <div 
              className={`profile-tab ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => handleTabClick('faq')}
            >
              FAQ
            </div>
          )}
        </div>
      </section>

      {/* Tab Content Sections */}
      <section className="container" id="tab-view-content">
        {activeTab === 'about' && (
          <div className="profile-about-layout">
            <div className="about-block-content">
              <h3 className="packages-block-title" style={{ marginBottom: '16px' }}>
                {photographer.isStudio ? 'About the Studio' : 'About the Photographer'}
              </h3>
              <p>{photographer.about}</p>
              <ul className="about-bullet-list" style={{ marginBottom: '32px' }}>
                {photographer.bullets.map((b, i) => (
                  <li key={i} className="about-bullet-item">
                    <i className="fa-solid fa-circle-check text-accent"></i> {b}
                  </li>
                ))}
              </ul>
              
              {/* Portfolio Showcase embedded inside About for non-studios, or as works-section for studios too */}
              <div className="works-section">
                <h3 className="works-title">Portfolio Showcase</h3>
                <div className="works-grid">
                  {gallery.map((img, i) => (
                    <div key={i} className="works-item">
                      <img src={img} alt={`Portfolio Showcase ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Packages block for Studio profiles only */}
            {photographer.isStudio && (
              <div className="about-packages-section">
                <div className="packages-block-header">
                  <h3 className="packages-block-title">Photography Catalog Packages</h3>
                  <span className="view-all-link" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('packages')}>
                    View all packages <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <div className="packages-block-grid">
                  {/* Essential */}
                  <div className="package-card">
                    <span className="package-tier">Essential</span>
                    <div className="package-price">₹{photographer.packages.essential.price.toLocaleString('en-IN')}</div>
                    <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.essential.hours} Hours Coverage</li>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.essential.photographers} Professional Photographer</li>
                      <li><i className="fa-solid fa-check"></i> 100+ Edited High-Res Images</li>
                      <li><i className="fa-solid fa-check"></i> Online Private Gallery Access</li>
                    </ul>
                    <button className="btn btn-outline-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setInquiryOpen(true)}>Book Essential</button>
                  </div>
                  
                  {/* Premium */}
                  <div className="package-card popular">
                    <span className="popular-badge">Most Popular</span>
                    <span className="package-tier">Premium</span>
                    <div className="package-price" style={{ color: 'var(--primary)' }}>₹{photographer.packages.premium.price.toLocaleString('en-IN')}</div>
                    <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.premium.hours} Hours Coverage</li>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.premium.photographers} Photographers (Candid + Traditional)</li>
                      <li><i className="fa-solid fa-check"></i> 250+ Edited High-Res Images</li>
                      <li><i className="fa-solid fa-check"></i> Premium Handcrafted Photo Book</li>
                      <li><i className="fa-solid fa-check"></i> Cinematic Teaser (2 mins)</li>
                    </ul>
                    <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setInquiryOpen(true)}>Book Premium</button>
                  </div>
                  
                  {/* Luxury */}
                  <div className="package-card">
                    <span className="package-tier">Luxury</span>
                    <div className="package-price">₹{photographer.packages.luxury.price.toLocaleString('en-IN')}</div>
                    <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.luxury.hours} Hours Coverage</li>
                      <li><i className="fa-solid fa-check"></i> {photographer.packages.luxury.photographers} Photographers + Cinematographers</li>
                      <li><i className="fa-solid fa-check"></i> Unlimited Edited High-Res Images</li>
                      <li><i className="fa-solid fa-check"></i> Hardcover Signature Photo Book</li>
                      <li><i className="fa-solid fa-check"></i> Full Cinematic Film (20 mins)</li>
                      <li><i className="fa-solid fa-check"></i> Drone Videography Coverage</li>
                    </ul>
                    <button className="btn btn-outline-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setInquiryOpen(true)}>Book Luxury</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'packages' && photographer.isStudio && (
          <div className="portfolio-tab-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '50px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Choose Your Photography Catalog Package</h3>
            <div className="packages-block-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '900px', margin: '0 auto' }}>
              {/* Essential */}
              <div className="package-card">
                <span className="package-tier">Essential Package</span>
                <div className="package-price">₹{photographer.packages.essential.price.toLocaleString('en-IN')}</div>
                <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.essential.hours} Hours Coverage</li>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.essential.photographers} Photographer</li>
                  <li><i className="fa-solid fa-circle-check"></i> 100+ High-Res JPEGs</li>
                  <li><i className="fa-solid fa-circle-check"></i> 15 Days Delivery timeline</li>
                </ul>
                <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => setInquiryOpen(true)}>Book Essential</button>
              </div>
              
              {/* Premium */}
              <div className="package-card popular">
                <span className="popular-badge">Most Popular</span>
                <span className="package-tier">Premium Package</span>
                <div className="package-price" style={{ color: 'var(--primary)' }}>₹{photographer.packages.premium.price.toLocaleString('en-IN')}</div>
                <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.premium.hours} Hours Coverage</li>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.premium.photographers} Photographers</li>
                  <li><i className="fa-solid fa-circle-check"></i> 250+ Color-graded Images</li>
                  <li><i className="fa-solid fa-circle-check"></i> Signature Photo Album</li>
                  <li><i className="fa-solid fa-circle-check"></i> Cinematic Short Video</li>
                  <li><i className="fa-solid fa-circle-check"></i> 10 Days Delivery timeline</li>
                </ul>
                <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => setInquiryOpen(true)}>Book Premium</button>
              </div>
              
              {/* Luxury */}
              <div className="package-card">
                <span className="package-tier">Luxury Package</span>
                <div className="package-price">₹{photographer.packages.luxury.price.toLocaleString('en-IN')}</div>
                <ul className="package-features-list" style={{ marginBottom: '20px' }}>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.luxury.hours} Hours Coverage</li>
                  <li><i className="fa-solid fa-circle-check"></i> {photographer.packages.luxury.photographers} Photographers</li>
                  <li><i className="fa-solid fa-circle-check"></i> Full Raw & Edited Files</li>
                  <li><i className="fa-solid fa-circle-check"></i> Premium Photo Albums (2 Sets)</li>
                  <li><i className="fa-solid fa-circle-check"></i> Cinematic Video (Full length)</li>
                  <li><i className="fa-solid fa-circle-check"></i> Drone Aerial Views</li>
                  <li><i className="fa-solid fa-circle-check"></i> 7 Days Delivery timeline</li>
                </ul>
                <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => setInquiryOpen(true)}>Book Luxury</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && photographer.isStudio && (
          <div className="portfolio-tab-grid" style={{ marginBottom: '80px' }}>
            {portfolioImages.map((img, i) => (
              <div key={i} className="portfolio-item">
                <img src={img} alt={`${photographer.name} Portfolio Image ${i+1}`} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab-list">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Customer Reviews ({photographer.reviews})</h3>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dark-900)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              ★ {photographer.rating.toFixed(1)} <span style={{ fontSize: '14px', color: 'var(--dark-500)', fontWeight: 600 }}>out of 5 stars based on customer submissions</span>
            </div>
            
            {reviews.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-user-line">
                  <span className="review-user-name">{r.name}</span>
                  <span className="review-rating-stars">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && photographer.isStudio && (
          <div className="faq-tab-list">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Frequently Asked Questions</h3>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question">{faq.q}</div>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inquiry Modal */}
      <InquiryModal 
        isOpen={inquiryOpen} 
        onClose={() => setInquiryOpen(false)} 
        photographer={photographer}
      />

      {/* WhatsApp Chat widget */}
      <WhatsAppChat 
        isOpen={whatsappOpen} 
        onClose={() => setWhatsappOpen(false)} 
        photographer={photographer}
      />
    </div>
  );
}
