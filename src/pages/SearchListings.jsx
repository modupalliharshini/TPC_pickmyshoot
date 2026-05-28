import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../context/supabase';
import CustomCalendar from '../components/CustomCalendar';
import '../css/main.css';
import '../css/search.css';

// Helper to map Supabase database fields (snake_case) to Frontend properties (camelCase)
const mapDbPhotographer = (dbRecord) => {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    rating: Number(dbRecord.rating),
    reviews: Number(dbRecord.reviews),
    experience: Number(dbRecord.experience),
    price: Number(dbRecord.price),
    location: dbRecord.location,
    city: dbRecord.city,
    categories: dbRecord.categories,
    image: dbRecord.image,
    gallery: dbRecord.gallery,
    avatarColor: dbRecord.avatar_color,
    avatarText: dbRecord.avatar_text,
    verified: dbRecord.verified,
    bestSeller: dbRecord.best_seller,
    isStudio: dbRecord.is_studio,
    bookedDates: dbRecord.booked_dates,
    about: dbRecord.about,
    bullets: dbRecord.bullets,
    packages: dbRecord.packages,
    languages: dbRecord.languages,
    travelOutsideCity: dbRecord.travel_outside_city,
    age: dbRecord.age,
    chargePerHour: dbRecord.charge_per_hour
  };
};

export default function SearchListings() {
  const location = useLocation();
  const navigate = useNavigate();

  // Search parameters from URL
  const queryParams = new URLSearchParams(location.search);

  // States mirroring filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProfileType, setSelectedProfileType] = useState('all'); // 'all', 'studios', 'individuals'
  const [selectedPackageTiers, setSelectedPackageTiers] = useState([]); // 'essential', 'premium', 'luxury'
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [date, setDate] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [sortKey, setSortKey] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Supabase states
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Favorites storage
  const [favorites, setFavorites] = useState([]);

  // Wishlist only trigger
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [travelOutsideOnly, setTravelOutsideOnly] = useState(false);

  const [collapsedSections, setCollapsedSections] = useState({
    experience: false,
    rate: false,
    languages: false,
    date: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Synchronize initial query params on mount/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    setSelectedCategory(params.get('category') || '');
    setSearchQuery(params.get('query') || '');
    
    const locParam = params.get('location');
    if (locParam) {
      setSelectedLocations([locParam]);
    } else {
      setSelectedLocations(['Hyderabad']);
    }

    const isIndiv = params.get('individuals') === 'true';
    setMaxPrice(params.get('maxPrice') ? parseInt(params.get('maxPrice')) : (isIndiv ? 5000 : 100000));
    setDate(params.get('date') || '');
    setOnlyWishlist(params.get('wishlist') === 'true');

    if (params.get('studios') === 'true') {
      setSelectedProfileType('studios');
    } else if (params.get('individuals') === 'true') {
      setSelectedProfileType('individuals');
    } else {
      setSelectedProfileType('all');
    }

    if (params.get('packages') === 'true') {
      setSelectedPackageTiers(['essential', 'premium', 'luxury']);
    } else {
      setSelectedPackageTiers([]);
    }

    // Load favorites
    const storedFavs = localStorage.getItem('pickmyshoot_favorites');
    setFavorites(storedFavs ? JSON.parse(storedFavs) : []);
  }, [location.search]);

  // Load photographers from Supabase
  useEffect(() => {
    async function loadPhotographers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('photographers')
          .select('*');
        if (error) {
          console.error("Error loading photographers from Supabase:", error);
        } else if (data) {
          setPhotographers(data.map(mapDbPhotographer));
        }
      } catch (err) {
        console.error("Error connecting to Supabase database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPhotographers();
  }, []);

  // Handle location checkboxes toggles
  const handleLocationToggle = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(prev => prev.filter(l => l !== loc));
    } else {
      setSelectedLocations(prev => [...prev, loc]);
    }
  };

  // Handle package tiers checkboxes toggles
  const handlePackageTierToggle = (tier) => {
    if (selectedPackageTiers.includes(tier)) {
      setSelectedPackageTiers(prev => prev.filter(t => t !== tier));
    } else {
      setSelectedPackageTiers(prev => [...prev, tier]);
    }
  };

  // Handle experiences checkboxes toggles
  const handleExperienceToggle = (range) => {
    if (selectedExperiences.includes(range)) {
      setSelectedExperiences(prev => prev.filter(r => r !== range));
    } else {
      setSelectedExperiences(prev => [...prev, range]);
    }
  };

  // Handle languages checkboxes toggles
  const handleLanguageToggle = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(prev => prev.filter(l => l !== lang));
    } else {
      setSelectedLanguages(prev => [...prev, lang]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedPackageTiers([]);
    setSelectedLocations(['Hyderabad']);
    setDate('');
    setMinRating(0);
    setSortKey('popular');
    setSearchQuery('');
    setOnlyWishlist(false);
    setSelectedExperiences([]);
    setSelectedLanguages([]);
    setTravelOutsideOnly(false);
    
    const params = new URLSearchParams(location.search);
    const hasIndividuals = params.get('individuals') === 'true';
    const hasStudios = params.get('studios') === 'true';
    const hasPackages = params.get('packages') === 'true';
    
    if (hasIndividuals) {
      setMaxPrice(5000);
      navigate('/search?individuals=true');
    } else if (hasStudios) {
      setMaxPrice(100000);
      navigate('/search?studios=true');
    } else if (hasPackages) {
      setMaxPrice(100000);
      navigate('/search?packages=true');
    } else {
      setSelectedProfileType('all');
      setMaxPrice(100000);
      navigate('/search');
    }
  };

  // Toggle favorite on listing card
  const handleCardFavToggle = (e, id) => {
    e.stopPropagation();
    
    let nextFavs = [...favorites];
    const index = nextFavs.indexOf(id);
    if (index === -1) {
      nextFavs.push(id);
    } else {
      nextFavs.splice(index, 1);
    }
    
    localStorage.setItem('pickmyshoot_favorites', JSON.stringify(nextFavs));
    setFavorites(nextFavs);
  };

  // Computed filtering
  const filteredPhotographers = photographers.filter(p => {
    // 1. Wishlist filter
    if (onlyWishlist && !favorites.includes(p.id)) return false;
    
    // 2. Category filter
    if (selectedCategory) {
      const categoryMap = {
        'Wedding': 'Wedding Photography',
        'Pre-Wedding': 'Pre Wedding Shoot',
        'Maternity': 'Maternity Shoot',
        'Baby': 'Baby Shoot',
        'Product': 'Product Photography',
        'Corporate': 'Corporate'
      };
      const mappedDbCategory = categoryMap[selectedCategory] || selectedCategory;
      if (!p.categories.includes(mappedDbCategory)) return false;
    }
    
    // 3. Location filter
    if (selectedLocations.length > 0) {
      const match = selectedLocations.some(loc => {
        if (loc.toLowerCase() === 'hyderabad') return true;
        return p.location.toLowerCase() === loc.toLowerCase();
      });
      if (!match) return false;
    }
    
    // 4. Max Price filter
    if (p.isStudio) {
      if (p.price > maxPrice) return false;
    } else {
      const isIndivMode = selectedProfileType === 'individuals';
      if (isIndivMode) {
        if (p.chargePerHour > maxPrice) return false;
      } else {
        if (p.price > maxPrice) return false;
      }
    }
    
    // 5. Min Rating filter
    if (p.rating < minRating) return false;

    // 6. Profile Type filter
    if (selectedProfileType === 'studios' && !p.isStudio) return false;
    if (selectedProfileType === 'individuals' && p.isStudio) return false;

    // 7. Package Tiers filter
    if (selectedPackageTiers.length > 0) {
      const matchesTier = selectedPackageTiers.some(tier => {
        if (tier === 'essential') return p.packages.essential.price <= 25000;
        if (tier === 'premium') return p.packages.premium.price > 25000 && p.packages.premium.price <= 50000;
        if (tier === 'luxury') return p.packages.luxury.price > 50000;
        return false;
      });
      if (!matchesTier) return false;
    }
    
    // 8. Search query text match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchCat = p.categories.some(cat => cat.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchCat) return false;
    }

    // 9. Date booked filter
    if (date && p.bookedDates && p.bookedDates.includes(date)) return false;
    
    // 10. Experience filter (photographer specific)
    if (selectedProfileType === 'individuals' && selectedExperiences.length > 0) {
      const matchExp = selectedExperiences.some(range => {
        if (range === '1-3') return p.experience >= 1 && p.experience <= 3;
        if (range === '3-5') return p.experience > 3 && p.experience <= 5;
        if (range === '5+') return p.experience > 5;
        return false;
      });
      if (!matchExp) return false;
    }

    // 11. Languages filter (photographer specific)
    if (selectedProfileType === 'individuals' && selectedLanguages.length > 0) {
      if (!p.languages) return false;
      const matchLang = p.languages.some(lang => selectedLanguages.includes(lang));
      if (!matchLang) return false;
    }

    // 12. Travel Availability filter (photographer specific)
    if (selectedProfileType === 'individuals' && travelOutsideOnly) {
      if (!p.travelOutsideCity) return false;
    }
    
    return true;
  });

  // Sorting
  const sortedPhotographers = [...filteredPhotographers].sort((a, b) => {
    if (sortKey === 'popular') {
      return b.reviews * b.rating - a.reviews * a.rating;
    } else if (sortKey === 'rating') {
      return b.rating - a.rating;
    } else if (sortKey === 'price-asc') {
      return a.price - b.price;
    } else if (sortKey === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  // Build breadcrumb / title text
  const getBreadcrumbText = () => {
    let typeText = selectedCategory || "All Photographers";
    if (selectedPackageTiers.length > 0) {
      typeText = selectedCategory ? `${selectedCategory} Packages` : "Photography Packages";
    } else if (selectedProfileType === 'studios') {
      typeText = selectedCategory ? `Premium ${selectedCategory} Studios` : "Premium Photography Studios";
    } else if (selectedProfileType === 'individuals') {
      typeText = selectedCategory ? `${selectedCategory} Artists` : "Individual Photography Artists";
    }
    const locationText = selectedLocations.length > 0 ? `in ${selectedLocations.join('/')}` : "in Hyderabad";
    return `${typeText} ${locationText}`;
  };

  const allLocations = ["Hyderabad", "Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli", "Kukatpally", "Ameerpet"];
  const displayLocations = allLocations.filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase()));
  const isPackagesMode = selectedPackageTiers.length > 0;
  const hasProfileTypeQuery = queryParams.get('individuals') === 'true' || 
                              queryParams.get('studios') === 'true' || 
                              queryParams.get('packages') === 'true';

  return (
    <div className="search-listings-root">
      {/* Breadcrumbs */}
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;&nbsp;
          <Link to="/search">Photographers</Link> &gt;&nbsp;
          <span id="breadcrumb-category">{getBreadcrumbText()}</span>
        </div>
      </div>

      {/* Search Layout Section */}
      <section className="container">
        <div className={`search-layout ${isPackagesMode ? 'packages-layout' : ''}`}>
          {/* Left Sidebar Filters — hidden in packages mode */}
          {!isPackagesMode && (
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <span className="clear-all-btn" id="clear-filters-btn" onClick={handleClearFilters}>
                Clear all
              </span>
            </div>
            
            {selectedProfileType === 'individuals' ? (
              <>
                {/* PHOTOGRAPHERS SIDEBAR FILTERS */}

                {/* Experience */}
                <div className={`filter-section ${collapsedSections.experience ? 'collapsed' : ''}`}>
                  <div
                    className="filter-section-header"
                    onClick={() => toggleSection('experience')}
                    role="button"
                    aria-expanded={!collapsedSections.experience}
                  >
                    <h4 className="filter-title">Experience</h4>
                    <i className="fa-solid fa-chevron-up accordion-chevron"></i>
                  </div>
                  <div className="filter-section-content">
                    <div className="filter-pill-grid">
                      {[
                        { label: '1–3 yrs', value: '1-3' },
                        { label: '3–5 yrs', value: '3-5' },
                        { label: '5+ yrs', value: '5+' }
                      ].map((exp) => {
                        const isChecked = selectedExperiences.includes(exp.value);
                        return (
                          <button
                            key={exp.value}
                            type="button"
                            className={`filter-pill ${isChecked ? 'active' : ''}`}
                            onClick={() => handleExperienceToggle(exp.value)}
                          >
                            {exp.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className={`filter-section ${collapsedSections.rate ? 'collapsed' : ''}`}>
                  <div
                    className="filter-section-header"
                    onClick={() => toggleSection('rate')}
                    role="button"
                    aria-expanded={!collapsedSections.rate}
                  >
                    <h4 className="filter-title">Hourly Rate</h4>
                    <i className="fa-solid fa-chevron-up accordion-chevron"></i>
                  </div>
                  <div className="filter-section-content">
                    <div className="price-slider-container">
                      <div className="price-slider-row">
                        <input
                          type="range"
                          className="price-slider"
                          id="price-slider"
                          min="1000"
                          max="5000"
                          step="200"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        />
                        <span className="price-current-label">₹{(maxPrice/1000).toFixed(maxPrice % 1000 === 0 ? 0 : 1)}K</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Availability */}
                <div className="filter-section">
                  <div className="travel-toggle-row filter-section-header no-collapse">
                    <h4 className="filter-title" style={{ marginBottom: 0 }}>Will Travel Outside City</h4>
                    <label className="switch-container" style={{ width: 'auto', padding: 0, cursor: 'pointer' }}>
                      <div className="switch-wrapper">
                        <input
                          type="checkbox"
                          checked={travelOutsideOnly}
                          onChange={(e) => setTravelOutsideOnly(e.target.checked)}
                        />
                        <span className="switch-slider"></span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Languages Spoken */}
                <div className={`filter-section ${collapsedSections.languages ? 'collapsed' : ''}`}>
                  <div
                    className="filter-section-header"
                    onClick={() => toggleSection('languages')}
                    role="button"
                    aria-expanded={!collapsedSections.languages}
                  >
                    <h4 className="filter-title">Languages Spoken</h4>
                    <i className="fa-solid fa-chevron-up accordion-chevron"></i>
                  </div>
                  <div className="filter-section-content">
                    <div className="filter-pill-grid">
                      {['English', 'Telugu', 'Hindi'].map((lang) => {
                        const isChecked = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            className={`filter-pill ${isChecked ? 'active' : ''}`}
                            onClick={() => handleLanguageToggle(lang)}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Available On */}
                <div className={`filter-section ${collapsedSections.date ? 'collapsed' : ''}`}>
                  <div
                    className="filter-section-header"
                    onClick={() => toggleSection('date')}
                    role="button"
                    aria-expanded={!collapsedSections.date}
                  >
                    <h4 className="filter-title">
                      Available On
                      {date && (
                        <strong>
                          : {(() => {
                            const [y, m, d] = date.split('-');
                            const mShorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            return `${mShorts[parseInt(m) - 1]} ${parseInt(d)}`;
                          })()}
                        </strong>
                      )}
                    </h4>
                    <i className="fa-solid fa-chevron-up accordion-chevron"></i>
                  </div>
                  <div className="filter-section-content">
                    <div className="filter-calendar-wrapper">
                      <CustomCalendar
                        selectedDate={date}
                        onSelectDate={setDate}
                        calendarId="sidebar-calendar-picker"
                        isInline={true}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* STUDIOS AND GENERIC SIDEBAR FILTERS */}
                {/* Category filters */}
                <div className="filter-section">
                  <h4 className="filter-title">Categories</h4>
                  <ul className="filter-list">
                    {[
                      'Wedding Photography',
                      'Pre Wedding Shoot',
                      'Maternity Shoot',
                      'Baby Shoot',
                      'Candid Photography',
                      'Product Photography'
                    ].map((cat) => (
                      <li key={cat}>
                        <label className="filter-item">
                          <input 
                            type="radio" 
                            name="category-filter" 
                            value={cat}
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                          />
                          {cat}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Profile Type Filter (Only show if not pre-filtered via query tabs) */}
                {!hasProfileTypeQuery && (
                  <div className="filter-section">
                    <h4 className="filter-title">Profile Type</h4>
                    <ul className="filter-list">
                      <li>
                        <label className="filter-item">
                          <input 
                            type="radio" 
                            name="profile-type-filter" 
                            value="all" 
                            checked={selectedProfileType === 'all'}
                            onChange={() => setSelectedProfileType('all')}
                          />
                          All Profiles
                        </label>
                      </li>
                      <li>
                        <label className="filter-item">
                          <input 
                            type="radio" 
                            name="profile-type-filter" 
                            value="studios"
                            checked={selectedProfileType === 'studios'}
                            onChange={() => setSelectedProfileType('studios')}
                          />
                          Premium Studios
                        </label>
                      </li>
                      <li>
                        <label className="filter-item">
                          <input 
                            type="radio" 
                            name="profile-type-filter" 
                            value="individuals"
                            checked={selectedProfileType === 'individuals'}
                            onChange={() => setSelectedProfileType('individuals')}
                          />
                          Individual Artists
                        </label>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Package Tiers Filter (Only show if not in individuals mode) */}
                {selectedProfileType !== 'individuals' && (
                  <div className="filter-section">
                    <h4 className="filter-title">Package Tiers</h4>
                    <ul className="filter-list">
                      <li>
                        <label className="filter-item">
                          <input 
                            type="checkbox" 
                            name="package-tier-filter" 
                            value="essential"
                            checked={selectedPackageTiers.includes('essential')}
                            onChange={() => handlePackageTierToggle('essential')}
                          />
                          Essential (Under ₹25k)
                        </label>
                      </li>
                      <li>
                        <label className="filter-item">
                          <input 
                            type="checkbox" 
                            name="package-tier-filter" 
                            value="premium"
                            checked={selectedPackageTiers.includes('premium')}
                            onChange={() => handlePackageTierToggle('premium')}
                          />
                          Premium (₹25k - ₹50k)
                        </label>
                      </li>
                      <li>
                        <label className="filter-item">
                          <input 
                            type="checkbox" 
                            name="package-tier-filter" 
                            value="luxury"
                            checked={selectedPackageTiers.includes('luxury')}
                            onChange={() => handlePackageTierToggle('luxury')}
                          />
                          Luxury (Above ₹50k)
                        </label>
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Location Filters */}
                <div className="filter-section">
                  <h4 className="filter-title">Location</h4>
                  <div className="sidebar-search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      className="sidebar-search-input" 
                      id="sidebar-location-search" 
                      placeholder="Search location"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                    />
                  </div>
                  <ul className="filter-list" id="location-checkbox-container">
                    {displayLocations.map((loc) => {
                      const isChecked = selectedLocations.includes(loc);
                      return (
                        <li key={loc}>
                          <label className={`filter-item ${isChecked ? 'active' : ''}`}>
                            <input 
                              type="checkbox" 
                              value={loc}
                              checked={isChecked}
                              onChange={() => handleLocationToggle(loc)}
                            />
                            {loc}
                          </label>
                        </li>
                      );
                    })}
                    {displayLocations.length === 0 && (
                      <li style={{ fontSize: '12px', color: 'var(--dark-500)', padding: '4px 0' }}>No locations found</li>
                    )}
                  </ul>
                </div>
                
                {/* Photoshoot Date Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Photoshoot Date</h4>
                  <CustomCalendar 
                    selectedDate={date} 
                    onSelectDate={setDate}
                    calendarId="sidebar-calendar-picker"
                  />
                </div>
                
                {/* Price Range Filter */}
                <div className="filter-section">
                  <div className="filter-section-header no-collapse" style={{ cursor: 'default' }}>
                    <h4 className="filter-title">
                      Price Range
                      {maxPrice < 100000 && <strong>: ₹{maxPrice.toLocaleString('en-IN')}</strong>}
                    </h4>
                  </div>
                  <div className="price-slider-container">
                    <div className="price-slider-row">
                      <input
                        type="range"
                        className="price-slider"
                        id="price-slider-studio"
                        min="10000"
                        max="100000"
                        step="5000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      />
                      <span className="price-current-label">₹{Math.round(maxPrice/1000)}K</span>
                    </div>
                  </div>
                </div>

                {/* Star Rating Filters */}
                <div className="filter-section">
                  <h4 className="filter-title">Ratings</h4>
                  <ul className="filter-list">
                    {[4, 3, 2].map((stars) => (
                      <li key={stars}>
                        <label className="filter-item">
                          <input 
                            type="radio" 
                            name="rating-filter" 
                            value={stars}
                            checked={minRating === stars}
                            onChange={() => setMinRating(stars)}
                          />
                          <span className="star-rating-filter"><i className="fa-solid fa-star"></i> {stars}+ Stars</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>
          )}
          
          <main className={isPackagesMode ? 'packages-main' : ''}>
            {/* Grid list of photographers */}
            <div className="photographers-grid" id="photographers-grid-list">
              {loading ? (
                <div className="empty-state" style={{ gridColumn: 'span 3', padding: '40px 0' }}>
                  <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '40px', color: 'var(--primary)', marginBottom: '16px' }}></i>
                  <h3>Loading Photographers...</h3>
                  <p>Fetching real-time availability from Supabase.</p>
                </div>
              ) : sortedPhotographers.map((p) => {
                const isFav = favorites.includes(p.id);
                return (
                  <div key={p.id} className="photographer-card" data-id={p.id}>
                    <div className="card-image-wrapper">
                      <img className="card-img" src={p.image} alt={p.name} />
                      {p.bestSeller && <span className="best-seller-badge">BEST SELLER</span>}
                      <button 
                        className={`fav-card-btn ${isFav ? 'active' : ''}`} 
                        onClick={(e) => handleCardFavToggle(e, p.id)}
                        aria-label="Toggle favorites"
                      >
                        <i className={`${isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                      </button>
                    </div>
                    
                    <div className="card-body">
                      <div className="card-header-info">
                        {p.isStudio && (
                          <div className="card-logo-circle" style={{ backgroundColor: p.avatarColor }}>
                            {p.avatarText}
                          </div>
                        )}
                        <div className="card-title-verified">
                          <h4 className="card-name">
                            {p.name}&nbsp;
                            {p.verified && <i className="fa-solid fa-circle-check text-accent" title="Verified Professional"></i>}
                          </h4>
                          <div className="card-meta-line">
                            <span><i className="fa-solid fa-star" style={{ color: '#ffb400' }}></i> {p.rating.toFixed(1)} ({p.reviews} Reviews)</span>
                            <span>•</span>
                            <span>{p.experience}+ Years</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-specs">
                        <div className="spec-item price-item">
                          {p.isStudio ? (
                            <>
                              <i className="fa-solid fa-tags"></i>
                              <span>Starts from ₹{p.price.toLocaleString('en-IN')}</span>
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-clock"></i>
                              <span>₹{p.chargePerHour.toLocaleString('en-IN')} / hour</span>
                            </>
                          )}
                        </div>
                        <div className="spec-item">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>{p.location}, {p.city}</span>
                        </div>
                      </div>
                      
                      {isPackagesMode && (
                        <div className="card-packages-breakdown">
                          <div className="package-row-item">
                            <span className="row-tier">Essential</span>
                            <span className="row-price">₹{p.packages.essential.price.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="package-row-item popular">
                            <span className="row-tier">Premium</span>
                            <span className="row-price">₹{p.packages.premium.price.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="package-row-item">
                            <span className="row-tier">Luxury</span>
                            <span className="row-price">₹{p.packages.luxury.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        className="btn btn-outline-primary card-btn" 
                        onClick={() => navigate(`/profile/${p.id}?tab=about`)}
                        style={{ marginTop: '10px' }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })}

              {!loading && sortedPhotographers.length === 0 && (
                <div className="empty-state" style={{ gridColumn: 'span 3' }}>
                  <i className="fa-solid fa-camera-retro"></i>
                  <h3>No Listings Found</h3>
                  <p>Try clearing some filters or searching for another category to find listings.</p>
                  <button className="btn btn-primary" onClick={handleClearFilters}>Clear All Filters</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
