/* pickmyshoot - Search and Filter Logic */

// Filter state
let filters = {
  category: "",
  locations: [],
  maxPrice: 100000,
  minRating: 0,
  searchQuery: "",
  locationSearch: "",
  onlyWishlist: false,
  profileType: "all", // "all", "studios", "individuals"
  packageTiers: [], // 'essential', 'premium', 'luxury'
  showPackages: false,
  date: ""
};

// Current sorting key
let currentSort = "popular";

document.addEventListener("DOMContentLoaded", () => {
  initURLParams();
  
  // Initialize sidebar custom calendar picker variables if present
  const sidebarCal = document.getElementById('sidebar-calendar-picker');
  if (sidebarCal) {
    const today = new Date();
    if (!sidebarCal.dataset.currentMonth) {
      sidebarCal.dataset.currentMonth = today.getMonth();
      sidebarCal.dataset.currentYear = today.getFullYear();
    }
    renderCustomCalendar('sidebar-calendar-picker');
  }
  
  setupFilterEventListeners();
  renderFiltersUI();
  applyFiltersAndRender();
});

// Parse URL Query parameters
function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  
  const categoryParam = params.get('category');
  if (categoryParam) {
    filters.category = categoryParam;
  }
  
  const queryParam = params.get('query');
  if (queryParam) {
    filters.searchQuery = queryParam;
  }
  
  const locationParam = params.get('location');
  if (locationParam) {
    if (locationParam.toLowerCase() !== 'hyderabad') {
      filters.locations = [locationParam];
    } else {
      filters.locations = ["Hyderabad"];
    }
  }

  const maxPriceParam = params.get('maxPrice');
  if (maxPriceParam) {
    filters.maxPrice = parseInt(maxPriceParam);
  }

  const dateParam = params.get('date');
  if (dateParam) {
    filters.date = dateParam;
  }
  
  const wishlistParam = params.get('wishlist');
  if (wishlistParam === 'true') {
    filters.onlyWishlist = true;
  }

  const studiosParam = params.get('studios');
  if (studiosParam === 'true') {
    filters.profileType = "studios";
  }

  const individualsParam = params.get('individuals');
  if (individualsParam === 'true') {
    filters.profileType = "individuals";
  }

  const packagesParam = params.get('packages');
  if (packagesParam === 'true') {
    filters.showPackages = true;
    filters.packageTiers = ["essential", "premium", "luxury"];
  }
}

// Bind event listeners to DOM elements
function setupFilterEventListeners() {
  // Sorting dropdown
  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }
  
  // Price slider
  const priceSlider = document.getElementById('price-slider');
  const priceValueLabel = document.getElementById('price-value');
  if (priceSlider && priceValueLabel) {
    priceSlider.addEventListener('input', (e) => {
      filters.maxPrice = parseInt(e.target.value);
      priceValueLabel.textContent = `₹${filters.maxPrice.toLocaleString('en-IN')}`;
      applyFiltersAndRender();
    });
  }
  
  // Location Search input
  const locInput = document.getElementById('sidebar-location-search');
  if (locInput) {
    locInput.addEventListener('input', (e) => {
      filters.locationSearch = e.target.value.toLowerCase();
      renderLocationCheckboxes();
    });
  }

  // Photoshoot Date Picker
  const datePicker = document.getElementById('sidebar-date-picker');
  if (datePicker) {
    datePicker.addEventListener('change', (e) => {
      filters.date = e.target.value;
      applyFiltersAndRender();
    });
  }
  
  // Clear all button
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllFilters();
    });
  }
}

// Reset filter state
function clearAllFilters() {
  filters = {
    category: "",
    locations: [],
    maxPrice: 100000,
    minRating: 0,
    searchQuery: "",
    locationSearch: "",
    onlyWishlist: false,
    profileType: "all",
    packageTiers: [],
    showPackages: false
  };
  
  // Reset DOM inputs
  const priceSlider = document.getElementById('price-slider');
  const priceValueLabel = document.getElementById('price-value');
  if (priceSlider && priceValueLabel) {
    priceSlider.value = 100000;
    priceValueLabel.textContent = "₹1,00,000";
  }
  
  const locInput = document.getElementById('sidebar-location-search');
  if (locInput) locInput.value = "";
  
  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.value = "popular";
    currentSort = "popular";
  }

  // Reset Profile Type radio inputs
  const profileRadios = document.querySelectorAll('input[name="profile-type-filter"]');
  profileRadios.forEach(radio => {
    radio.checked = (radio.value === 'all');
  });

  // Reset Package Tier checkbox inputs
  const packageChecks = document.querySelectorAll('input[name="package-tier-filter"]');
  packageChecks.forEach(check => {
    check.checked = false;
  });
  
  // Re-sync checkboxes & render
  renderFiltersUI();
  applyFiltersAndRender();
}

// Synchronize Left Filter Sidebar DOM based on current filters state
function renderFiltersUI() {
  // 1. Categories
  const categoryInputs = document.querySelectorAll('input[name="category-filter"]');
  categoryInputs.forEach(input => {
    input.checked = (input.value === filters.category);
    input.onchange = (e) => {
      filters.category = e.target.checked ? e.target.value : "";
      updateBreadcrumbs();
      applyFiltersAndRender();
    };
  });
  
  // 2. Locations
  renderLocationCheckboxes();
  
  // 3. Ratings
  const ratingInputs = document.querySelectorAll('input[name="rating-filter"]');
  ratingInputs.forEach(input => {
    const val = parseInt(input.value);
    input.checked = (val === filters.minRating);
    input.onchange = (e) => {
      filters.minRating = e.target.checked ? val : 0;
      applyFiltersAndRender();
    };
  });

  // 4. Profile Type (Studios / Individuals)
  const profileInputs = document.querySelectorAll('input[name="profile-type-filter"]');
  profileInputs.forEach(input => {
    input.checked = (input.value === filters.profileType);
    input.onchange = (e) => {
      filters.profileType = e.target.value;
      updateBreadcrumbs();
      applyFiltersAndRender();
    };
  });

  // 5. Package Tiers
  const packageInputs = document.querySelectorAll('input[name="package-tier-filter"]');
  packageInputs.forEach(input => {
    input.checked = filters.packageTiers.includes(input.value);
    input.onchange = (e) => {
      const val = input.value;
      if (e.target.checked) {
        if (!filters.packageTiers.includes(val)) {
          filters.packageTiers.push(val);
        }
      } else {
        const idx = filters.packageTiers.indexOf(val);
        if (idx > -1) {
          filters.packageTiers.splice(idx, 1);
        }
      }
      filters.showPackages = filters.packageTiers.length > 0;
      updateBreadcrumbs();
      applyFiltersAndRender();
    };
  });
  // 6. Price Slider Sync
  const priceSlider = document.getElementById('price-slider');
  const priceValueLabel = document.getElementById('price-value');
  if (priceSlider && priceValueLabel) {
    priceSlider.value = filters.maxPrice;
    priceValueLabel.textContent = `₹${filters.maxPrice.toLocaleString('en-IN')}`;
  }

  // 7. Date Picker Sync
  const datePicker = document.getElementById('sidebar-date-picker');
  if (datePicker) {
    datePicker.value = filters.date || '';
    
    const customCal = document.getElementById('sidebar-calendar-picker');
    if (customCal && filters.date) {
      customCal.dataset.selectedDate = filters.date;
      
      const [y, m, d] = filters.date.split('-').map(Number);
      customCal.dataset.currentMonth = m - 1;
      customCal.dataset.currentYear = y;
      
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      customCal.querySelector('.calendar-selected-value').textContent = `${monthNames[m - 1]} ${d}, ${y}`;
      renderCustomCalendar('sidebar-calendar-picker');
    } else if (customCal) {
      customCal.dataset.selectedDate = '';
      customCal.querySelector('.calendar-selected-value').textContent = 'Select Date';
      renderCustomCalendar('sidebar-calendar-picker');
    }
  }

  // Breadcrumb update
  updateBreadcrumbs();
}

// Dynamically list location checkmark boxes (supporting inline filtering)
function renderLocationCheckboxes() {
  const container = document.getElementById('location-checkbox-container');
  if (!container) return;
  
  const allLocations = ["Hyderabad", "Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli", "Kukatpally", "Ameerpet"];
  const filteredLocs = allLocations.filter(loc => loc.toLowerCase().includes(filters.locationSearch));
  
  if (filteredLocs.length === 0) {
    container.innerHTML = `<li style="font-size: 12px; color: var(--dark-500); padding: 4px 0;">No locations found</li>`;
    return;
  }
  
  container.innerHTML = filteredLocs.map(loc => {
    const isChecked = filters.locations.includes(loc);
    return `
      <li>
        <label class="filter-item ${isChecked ? 'active' : ''}">
          <input type="checkbox" value="${loc}" ${isChecked ? 'checked' : ''} onchange="handleLocationToggle(this)">
          ${loc}
        </label>
      </li>
    `;
  }).join('');
}

// Location checkbox toggler callback
function handleLocationToggle(checkbox) {
  const value = checkbox.value;
  if (checkbox.checked) {
    if (!filters.locations.includes(value)) {
      filters.locations.push(value);
    }
  } else {
    const index = filters.locations.indexOf(value);
    if (index > -1) {
      filters.locations.splice(index, 1);
    }
  }
  applyFiltersAndRender();
  renderLocationCheckboxes();
}

// Breadcrumb text builder
function updateBreadcrumbs() {
  const categoryLabel = document.getElementById('breadcrumb-category');
  const resultsHeading = document.getElementById('results-title-heading');
  
  let categoryText = filters.category || "All Photographers";
  if (filters.showPackages || filters.packageTiers.length > 0) {
    categoryText = filters.category ? `${filters.category} Packages` : "Photography Packages";
  } else if (filters.profileType === 'studios') {
    categoryText = filters.category ? `Premium ${filters.category} Studios` : "Premium Photography Studios";
  } else if (filters.profileType === 'individuals') {
    categoryText = filters.category ? `${filters.category} Artists` : "Individual Photography Artists";
  }
  
  const locationText = filters.locations.length > 0 ? `in ${filters.locations.join('/')}` : "in Hyderabad";
  
  if (categoryLabel) {
    categoryLabel.textContent = `${categoryText} ${locationText}`;
  }
  if (resultsHeading) {
    resultsHeading.textContent = `${categoryText} ${locationText}`;
  }
}

// Main logic to filter and sort list, then draw cards
function applyFiltersAndRender() {
  const favorites = getFavorites();
  
  let results = PHOTOGRAPHERS.filter(p => {
    // 1. Wishlist only filter
    if (filters.onlyWishlist && !favorites.includes(p.id)) {
      return false;
    }
    
    // 2. Category match
    if (filters.category && !p.categories.includes(filters.category)) {
      return false;
    }
    
    // 3. Location match
    if (filters.locations.length > 0) {
      const match = filters.locations.some(loc => {
        if (loc.toLowerCase() === 'hyderabad') return true;
        return p.location.toLowerCase() === loc.toLowerCase();
      });
      if (!match) return false;
    }
    
    // 4. Max Price check
    if (p.price > filters.maxPrice) {
      return false;
    }
    
    // 5. Min Rating check
    if (p.rating < filters.minRating) {
      return false;
    }

    // 6. Profile Type filter
    if (filters.profileType === 'studios' && !p.isStudio) {
      return false;
    }
    if (filters.profileType === 'individuals' && p.isStudio) {
      return false;
    }

    // 7. Package Tiers filter
    if (filters.packageTiers.length > 0) {
      const matchesTier = filters.packageTiers.some(tier => {
        if (tier === 'essential') return p.packages.essential.price <= 25000;
        if (tier === 'premium') return p.packages.premium.price > 25000 && p.packages.premium.price <= 50000;
        if (tier === 'luxury') return p.packages.luxury.price > 50000;
        return false;
      });
      if (!matchesTier) return false;
    }
    
    // 8. Search input text matching
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchLoc = p.location.toLowerCase().includes(query);
      const matchCat = p.categories.some(cat => cat.toLowerCase().includes(query));
      if (!matchName && !matchLoc && !matchCat) {
        return false;
      }
    }

    // 9. Availability Date check
    if (filters.date && p.bookedDates && p.bookedDates.includes(filters.date)) {
      return false;
    }
    
    return true;
  });
  
  // Sort dataset
  results.sort((a, b) => {
    if (currentSort === 'popular') {
      return b.reviews * b.rating - a.reviews * a.rating;
    } else if (currentSort === 'rating') {
      return b.rating - a.rating;
    } else if (currentSort === 'price-asc') {
      return a.price - b.price;
    } else if (currentSort === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });
  
  // Draw cards
  renderPhotographerGrid(results, favorites);
}

// Render filtered cards grid
function renderPhotographerGrid(items, favorites) {
  const grid = document.getElementById('photographers-grid-list');
  const countLabel = document.getElementById('results-count-label');
  
  if (!grid || !countLabel) return;
  
  countLabel.textContent = `${items.length.toLocaleString('en-IN')}+ ${filters.showPackages ? 'Packages' : 'Photographers'} found`;
  
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-camera-retro"></i>
        <h3>No Listings Found</h3>
        <p>Try clearing some filters or searching for another category to find listings.</p>
        <button class="btn btn-primary" onclick="clearAllFilters()">Clear All Filters</button>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = items.map(p => {
    const isFav = favorites.includes(p.id);
    const sellerBadge = p.bestSeller ? `<span class="best-seller-badge">BEST SELLER</span>` : '';
    const verifiedIcon = p.verified ? `<i class="fa-solid fa-circle-check" title="Verified Professional"></i>` : '';
    
    // Render package table overlay if packages view is active
    const showPackagesMode = filters.showPackages || filters.packageTiers.length > 0;
    const packagesHTML = showPackagesMode ? `
      <div class="card-packages-breakdown">
        <div class="package-row-item">
          <span class="row-tier">Essential</span>
          <span class="row-price">₹${p.packages.essential.price.toLocaleString('en-IN')}</span>
        </div>
        <div class="package-row-item popular">
          <span class="row-tier">Premium</span>
          <span class="row-price">₹${p.packages.premium.price.toLocaleString('en-IN')}</span>
        </div>
        <div class="package-row-item">
          <span class="row-tier">Luxury</span>
          <span class="row-price">₹${p.packages.luxury.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    ` : '';

    return `
      <div class="photographer-card" data-id="${p.id}">
        <div class="card-image-wrapper">
          <img class="card-img" src="${p.image}" alt="${p.name}">
          ${sellerBadge}
          <button class="fav-card-btn ${isFav ? 'active' : ''}" onclick="handleCardFavToggle(event, '${p.id}')">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
        
        <div class="card-body">
          <div class="card-header-info">
            ${p.isStudio ? `
              <div class="card-logo-circle" style="background-color: ${p.avatarColor};">
                ${p.avatarText}
              </div>
            ` : ''}
            <div class="card-title-verified">
              <h4 class="card-name">${p.name} ${verifiedIcon}</h4>
              <div class="card-meta-line">
                <span><i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)} (${p.reviews} Reviews)</span>
                <span>•</span>
                <span>${p.experience}+ Years</span>
              </div>
            </div>
          </div>
          
          <div class="card-specs">
            <div class="spec-item price-item">
              ${p.isStudio ? `
                <i class="fa-solid fa-tags"></i>
                <span>Starts from ₹${p.price.toLocaleString('en-IN')}</span>
              ` : `
                <i class="fa-solid fa-clock"></i>
                <span>₹${p.chargePerHour.toLocaleString('en-IN')} / hour</span>
              `}
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>${p.location}, ${p.city}</span>
            </div>
          </div>
          
          ${packagesHTML}
          
          <button class="btn btn-outline-primary card-btn" onclick="window.location.href='profile.html?id=${p.id}&tab=about'" style="margin-top: 10px;">
            View Profile
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Inline card Heart Wishlist click handler
function handleCardFavToggle(event, id) {
  event.stopPropagation();
  const btn = event.currentTarget;
  const icon = btn.querySelector('i');
  
  const isAdded = toggleFavorite(id);
  
  if (isAdded) {
    btn.classList.add('active');
    icon.className = 'fa-solid fa-heart';
  } else {
    btn.classList.remove('active');
    icon.className = 'fa-regular fa-heart';
    
    // If we are currently in "wishlist only" view, re-filter immediately to remove card
    if (filters.onlyWishlist) {
      applyFiltersAndRender();
    }
  }
}
