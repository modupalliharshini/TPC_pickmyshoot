import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomCalendar from '../components/CustomCalendar';
import '../css/main.css';
import '../css/home.css';

export default function Home() {
  const navigate = useNavigate();

  // Search widget states
  const [category, setCategory] = useState('Wedding Photography');
  const [location, setLocation] = useState('Hyderabad');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [date, setDate] = useState('');
  
  // UI states
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState({
    wedding: false,
    prewedding: false,
    maternity: false,
    baby: false,
    candid: false,
    product: false
  });

  // Click outside to close event dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setEventDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&maxPrice=${maxPrice}&date=${encodeURIComponent(date)}`);
  };

  const goToCategory = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}&location=Hyderabad`);
  };

  const handleFavClick = (e, key) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="home-page-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Find the perfect <br />
              <span className="text-accent">Photographer</span> <br />
              for every moment
            </h1>
            <p className="hero-desc">
              Discover and connect with verified photographers near you and capture your best memories.
            </p>
            
            {/* Search Widget Form */}
            <form className="search-widget" id="homepage-search-form" onSubmit={handleSearchSubmit}>
              {/* Event Field */}
              <div className="search-field">
                <span className="search-field-label">
                  <i className="fa-solid fa-camera-retro"></i> Event
                </span>
                <div 
                  className={`custom-dropdown ${eventDropdownOpen ? 'show' : ''}`} 
                  id="homepage-event-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEventDropdownOpen(!eventDropdownOpen);
                  }}
                >
                  <div className="custom-dropdown-trigger">
                    <span className="dropdown-selected-value">{category}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <ul className="custom-dropdown-menu">
                    {[
                      'Wedding Photography',
                      'Pre Wedding Shoot',
                      'Maternity Shoot',
                      'Baby Shoot',
                      'Candid Photography',
                      'Product Photography'
                    ].map((opt) => (
                      <li 
                        key={opt}
                        className={category === opt ? 'selected' : ''}
                        onClick={() => setCategory(opt)}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Location field */}
              <div className="search-field">
                <span className="search-field-label">
                  <i className="fa-solid fa-location-dot"></i> Location
                </span>
                <input 
                  type="text" 
                  className="search-field-input" 
                  id="search-location" 
                  value={location} 
                  placeholder="e.g. Hyderabad, Madhapur"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              {/* Price Field (Slider) */}
              <div className="search-field">
                <span className="search-field-label">
                  <i className="fa-solid fa-indian-rupee-sign"></i> Max Price: <span id="search-price-val" style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'none' }}>₹{maxPrice.toLocaleString('en-IN')}</span>
                </span>
                <div className="price-slider-container">
                  <input 
                    type="range" 
                    className="search-field-range" 
                    id="search-price" 
                    min="10000" 
                    max="100000" 
                    step="5000" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Date field */}
              <div className="search-field">
                <span className="search-field-label">
                  <i className="fa-solid fa-calendar-days"></i> Photoshoot Date
                </span>
                <CustomCalendar 
                  selectedDate={date} 
                  onSelectDate={setDate}
                  calendarId="homepage-calendar-picker"
                />
              </div>
              
              {/* Search Submit Button */}
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </form>
            
            {/* Trust Badges Row */}
            <div className="trust-badges-row">
              <div className="trust-badge">
                <i className="fa-solid fa-circle-check"></i> Verified Professionals
              </div>
              <div className="trust-badge">
                <i className="fa-solid fa-circle-check"></i> Free Listing for Photographers
              </div>
              <div className="trust-badge">
                <i className="fa-solid fa-circle-check"></i> No Booking Fees
              </div>
              <div className="trust-badge">
                <i className="fa-solid fa-circle-check"></i> Secure & Easy Booking
              </div>
            </div>
          </div>
        </div>
        
        {/* Bleeding Hero Image Wrapper outside .container */}
        <div className="hero-image-wrapper">
          <img className="hero-image" src="/assets/wedding_hero.png" alt="Indian Wedding Couple Photography" />
          <div className="hero-image-fade-overlay"></div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Categories</h2>
            <Link to="/search" className="view-all-link">View all <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
          
          <div className="categories-grid">
            {/* Category 1: Wedding */}
            <div className="category-card" onClick={() => goToCategory('Wedding Photography')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/wedding_hero.png" alt="Wedding Photography" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'wedding')}>
                  <i className={`${favorites.wedding ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-wedding"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-ring"></i>
              </div>
              <div className="category-name">Wedding Photography</div>
              <div className="category-count">12,450 Photographers</div>
            </div>
            
            {/* Category 2: Pre Wedding */}
            <div className="category-card" onClick={() => goToCategory('Pre Wedding Shoot')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/prewedding_shoot.png" alt="Pre Wedding Shoot" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'prewedding')}>
                  <i className={`${favorites.prewedding ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-prewedding"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-camera-retro"></i>
              </div>
              <div className="category-name">Pre Wedding Shoot</div>
              <div className="category-count">8,230 Photographers</div>
            </div>
            
            {/* Category 3: Maternity */}
            <div className="category-card" onClick={() => goToCategory('Maternity Shoot')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/maternity_shoot.png" alt="Maternity Shoot" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'maternity')}>
                  <i className={`${favorites.maternity ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-maternity"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-person-pregnant"></i>
              </div>
              <div className="category-name">Maternity Shoot</div>
              <div className="category-count">3,120 Photographers</div>
            </div>
            
            {/* Category 4: Baby Shoot */}
            <div className="category-card" onClick={() => goToCategory('Baby Shoot')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/baby_shoot.png" alt="Baby Shoot" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'baby')}>
                  <i className={`${favorites.baby ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-baby"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-baby"></i>
              </div>
              <div className="category-name">Baby Shoot</div>
              <div className="category-count">4,560 Photographers</div>
            </div>
            
            {/* Category 5: Candid */}
            <div className="category-card" onClick={() => goToCategory('Candid Photography')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/candid_shoot.png" alt="Candid Photography" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'candid')}>
                  <i className={`${favorites.candid ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-candid"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="category-name">Candid Photography</div>
              <div className="category-count">6,780 Photographers</div>
            </div>
            
            {/* Category 6: Product */}
            <div className="category-card" onClick={() => goToCategory('Product Photography')}>
              <div className="category-image-container">
                <img className="category-img" src="/assets/product_shoot.png" alt="Product Photography" />
                <button className="category-favorite-btn" onClick={(e) => handleFavClick(e, 'product')}>
                  <i className={`${favorites.product ? 'fa-solid text-accent' : 'fa-regular'} fa-heart`} id="fav-product"></i>
                </button>
              </div>
              <div className="category-icon-badge">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <div className="category-name">Product Photography</div>
              <div className="category-count">2,340 Photographers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center" style={{ flexDirection: 'column', gap: '8px', marginBottom: '50px', display: 'flex', alignItems: 'center' }}>
            <h2 className="section-title">How pickmyshoot Works</h2>
            <p style={{ color: 'var(--dark-500)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
              Three simple steps to finding and booking the perfect photographer for your special moments.
            </p>
          </div>
          
          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon"><i className="fa-solid fa-map-location-dot"></i></div>
              <h3 className="step-title">Choose Location & Style</h3>
              <p className="step-desc">
                Select your city and choose the photography style or category that fits your needs (e.g., Wedding, Pre-Wedding, Baby Shoot).
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon"><i className="fa-solid fa-images"></i></div>
              <h3 className="step-title">Compare Portfolios & Prices</h3>
              <p className="step-desc">
                Browse through verified profiles, compare pricing packages, read real reviews, and check high-resolution portfolios.
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon"><i className="fa-solid fa-calendar-check"></i></div>
              <h3 className="step-title">Connect & Book Directly</h3>
              <p className="step-desc">
                Inquire directly with photographers, chat via simulated WhatsApp, or call. Book them directly with zero platform booking fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Photographers Section */}
      <section className="featured-photographers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Photographers</h2>
            <Link to="/search" className="view-all-link">View all listings <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
          
          <div className="featured-grid">
            {/* Photographer 1: The Wedding Story */}
            <div className="featured-card" onClick={() => navigate('/profile/the-wedding-story')}>
              <div className="featured-card-img-wrapper">
                <img src="/assets/wedding_hero.png" alt="The Wedding Story" className="featured-card-img" />
                <span className="featured-badge">Top Rated</span>
              </div>
              <div className="featured-card-body">
                <div className="featured-card-header">
                  <div className="featured-avatar" style={{ backgroundColor: '#000000' }}>TWS</div>
                  <div>
                    <h3 className="featured-name">The Wedding Story <i className="fa-solid fa-circle-check text-accent" style={{ color: '#2196f3', fontSize: '13px' }}></i></h3>
                    <span className="featured-rating"><i className="fa-solid fa-star" style={{ color: '#ffb400' }}></i> 4.9 (320 Reviews)</span>
                  </div>
                </div>
                <p className="featured-desc">Passionate photography team capturing authentic, beautiful candids and cinematic films.</p>
                <div className="featured-footer">
                  <span className="featured-price">Starts at <strong>₹25,000</strong></span>
                  <span className="featured-location"><i className="fa-solid fa-location-dot"></i> Banjara Hills</span>
                </div>
              </div>
            </div>

            {/* Photographer 2: Karthik Rao */}
            <div className="featured-card" onClick={() => navigate('/profile/clicks-by-karthik?tab=about')}>
              <div className="featured-card-img-wrapper">
                <img src="/assets/prewedding_shoot.png" alt="Clicks by Karthik" className="featured-card-img" />
                <span className="featured-badge">Popular</span>
              </div>
              <div className="featured-card-body">
                <div className="featured-card-header">
                  <div className="featured-avatar" style={{ backgroundColor: '#ff9800' }}>KR</div>
                  <div>
                    <h3 className="featured-name">Karthik Rao</h3>
                    <span className="featured-rating"><i className="fa-solid fa-star" style={{ color: '#ffb400' }}></i> 4.8 (210 Reviews)</span>
                  </div>
                </div>
                <p className="featured-desc">Creative cinematic lenses capturing your grand memories and premium drone shoots.</p>
                <div className="featured-footer">
                  <span className="featured-price">Hourly Rate: <strong>₹2,500/hr</strong></span>
                  <span className="featured-location"><i className="fa-solid fa-location-dot"></i> Jubilee Hills</span>
                </div>
              </div>
            </div>

            {/* Photographer 3: Rahul Verma */}
            <div className="featured-card" onClick={() => navigate('/profile/rahul-verma?tab=about')}>
              <div className="featured-card-img-wrapper">
                <img src="/assets/candid_shoot.png" alt="Rahul Verma" className="featured-card-img" />
                <span className="featured-badge">Verified</span>
              </div>
              <div className="featured-card-body">
                <div className="featured-card-header">
                  <div className="featured-avatar" style={{ backgroundColor: '#2196f3' }}>RV</div>
                  <div>
                    <h3 className="featured-name">Rahul Verma <i className="fa-solid fa-circle-check text-accent" style={{ color: '#2196f3', fontSize: '13px' }}></i></h3>
                    <span className="featured-rating"><i className="fa-solid fa-star" style={{ color: '#ffb400' }}></i> 4.9 (180 Reviews)</span>
                  </div>
                </div>
                <p className="featured-desc">Narrative photo books and custom color-graded frames that document a deep emotional story.</p>
                <div className="featured-footer">
                  <span className="featured-price">Hourly Rate: <strong>₹2,200/hr</strong></span>
                  <span className="featured-location"><i className="fa-solid fa-location-dot"></i> Madhapur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <div className="container">
          <div className="why-choose-us-grid">
            <div className="why-choose-us-content">
              <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '20px' }}>Why Book Through pickmyshoot?</h2>
              <p style={{ color: 'var(--dark-500)', marginBottom: '30px', fontSize: '15px', lineHeight: '1.7' }}>
                We connect you directly with the best photographers in the industry. No agents, no middlemen, and absolutely transparent details.
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon"><i className="fa-solid fa-circle-check"></i></div>
                  <div>
                    <h4>100% Handpicked & Verified Artists</h4>
                    <p>We verify identities, portfolio authenticity, and business details before listing any artist.</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon"><i className="fa-solid fa-money-bill-transfer"></i></div>
                  <div>
                    <h4>Zero Commissions & Direct Booking</h4>
                    <p>Chat directly and pay them directly. We don't charge booking fees or commissions from you.</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon"><i className="fa-solid fa-shield-halved"></i></div>
                  <div>
                    <h4>Transparent Package Catalogs</h4>
                    <p>Compare full breakdowns of Essential, Premium, and Luxury packages instantly before calling.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="why-choose-us-image-wrapper">
              <img src="/assets/maternity_shoot.png" alt="Photography Session Maternity" className="why-choose-us-image" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
