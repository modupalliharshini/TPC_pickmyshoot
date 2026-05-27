/* pickmyshoot - Common Utilities, State & Database */

// Mock Database of Photographers
const PHOTOGRAPHERS = [
  {
    id: "the-wedding-story",
    name: "The Wedding Story",
    rating: 4.9,
    reviews: 320,
    experience: 8,
    price: 25000,
    location: "Banjara Hills",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Pre Wedding Shoot", "Candid Photography"],
    image: "assets/wedding_hero.png",
    gallery: [
      "assets/wedding_hero.png",
      "assets/prewedding_shoot.png",
      "assets/candid_shoot.png",
      "assets/maternity_shoot.png",
      "assets/baby_shoot.png"
    ],
    avatarColor: "#000000",
    avatarText: "TWS",
    verified: true,
    bestSeller: true,
    isStudio: true,
    bookedDates: ["2026-05-28", "2026-06-01", "2026-06-15"],
    about: "We are a team of passionate photographers who believe in capturing real emotions and candid moments. We specialize in wedding, pre-wedding and cinematic films.",
    bullets: [
      "500+ Weddings Shoots",
      "8+ Years Experience",
      "Expert Team",
      "Premium Equipment"
    ],
    packages: {
      essential: { price: 25000, hours: 6, photographers: 1 },
      premium: { price: 45000, hours: 12, photographers: 2, popular: true },
      luxury: { price: 75000, hours: 16, photographers: 3 }
    }
  },
  {
    id: "clicks-by-karthik",
    name: "Karthik Rao (Clicks by Karthik)",
    rating: 4.8,
    reviews: 210,
    experience: 6,
    price: 18000,
    location: "Jubilee Hills",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Pre Wedding Shoot", "Candid Photography"],
    image: "assets/karthik_profile.png",
    gallery: [
      "assets/prewedding_shoot.png",
      "assets/wedding_hero.png",
      "assets/candid_shoot.png",
      "assets/maternity_shoot.png"
    ],
    avatarColor: "#ff9800",
    avatarText: "KR",
    verified: false,
    bestSeller: false,
    isStudio: false,
    bookedDates: ["2026-05-30", "2026-06-05", "2026-06-12"],
    age: 29,
    chargePerHour: 2500,
    about: "I am Karthik Rao, capturing the art of weddings through creative cinematic lenses. Based in Hyderabad, I travel globally to frame your precious moments.",
    bullets: [
      "250+ Events Covered",
      "6+ Years Experience",
      "Creative Drone Shoots",
      "Fast Delivery"
    ],
    packages: {
      essential: { price: 18000, hours: 6, photographers: 1 },
      premium: { price: 32000, hours: 10, photographers: 2, popular: true },
      luxury: { price: 55000, hours: 14, photographers: 3 }
    }
  },
  {
    id: "rahul-verma",
    name: "Rahul Verma",
    rating: 4.9,
    reviews: 180,
    experience: 7,
    price: 22000,
    location: "Madhapur",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Pre Wedding Shoot", "Candid Photography"],
    image: "assets/rahul_profile.png",
    gallery: [
      "assets/candid_shoot.png",
      "assets/wedding_hero.png",
      "assets/prewedding_shoot.png",
      "assets/baby_shoot.png"
    ],
    avatarColor: "#2196f3",
    avatarText: "RV",
    verified: true,
    bestSeller: false,
    isStudio: false,
    bookedDates: ["2026-05-31", "2026-06-06", "2026-06-18"],
    age: 28,
    chargePerHour: 2200,
    about: "I am Rahul Verma. Shutter tales and visual experience are my passions. I make sure that every picture tells a deep emotional tale that you will cherish forever.",
    bullets: [
      "300+ Weddings Shoots",
      "7+ Years Experience",
      "Narrative Photo Book",
      "Premium Color Grading"
    ],
    packages: {
      essential: { price: 22000, hours: 6, photographers: 1 },
      premium: { price: 40000, hours: 12, photographers: 2, popular: true },
      luxury: { price: 68000, hours: 15, photographers: 3 }
    }
  },
  {
    id: "akhil-reddy",
    name: "Akhil Reddy",
    rating: 4.8,
    reviews: 160,
    experience: 6,
    price: 20000,
    location: "Gachibowli",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Maternity Shoot", "Candid Photography"],
    image: "assets/akhil_profile.png",
    gallery: [
      "assets/maternity_shoot.png",
      "assets/wedding_hero.png",
      "assets/baby_shoot.png"
    ],
    avatarColor: "#e91e63",
    avatarText: "AR",
    verified: true,
    bestSeller: false,
    isStudio: false,
    bookedDates: ["2026-05-30", "2026-06-02", "2026-06-20"],
    age: 26,
    chargePerHour: 2000,
    about: "I am Akhil Reddy, renowned for fine-art maternity and grand wedding celebrations. I turn normal settings into magical visual highlights.",
    bullets: [
      "150+ Maternity Shoots",
      "6+ Years Experience",
      "Dedicated Studio Setup",
      "Custom Outfits Available"
    ],
    packages: {
      essential: { price: 20000, hours: 5, photographers: 1 },
      premium: { price: 38000, hours: 10, photographers: 2, popular: true },
      luxury: { price: 60000, hours: 14, photographers: 3 }
    }
  },
  {
    id: "foto-perfect",
    name: "Foto Perfect Studio",
    rating: 4.7,
    reviews: 140,
    experience: 5,
    price: 15000,
    location: "Kukatpally",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Baby Shoot", "Candid Photography"],
    image: "assets/baby_shoot.png",
    gallery: [
      "assets/baby_shoot.png",
      "assets/wedding_hero.png",
      "assets/prewedding_shoot.png"
    ],
    avatarColor: "#4caf50",
    avatarText: "FP",
    verified: false,
    bestSeller: false,
    isStudio: true,
    bookedDates: ["2026-06-01", "2026-06-03", "2026-06-25"],
    about: "Foto Perfect Studio specializes in capturing the pure innocence of babies and the grand warmth of family occasions. Affordable packages with absolute perfection.",
    bullets: [
      "200+ Baby & Kids Shoots",
      "5+ Years Experience",
      "Baby Props Provided",
      "Warm Sanitized Studio"
    ],
    packages: {
      essential: { price: 15000, hours: 4, photographers: 1 },
      premium: { price: 28000, hours: 8, photographers: 2, popular: true },
      luxury: { price: 45000, hours: 12, photographers: 2 }
    }
  },
  {
    id: "pixel-capture",
    name: "Pixel Capture Studio",
    rating: 4.8,
    reviews: 110,
    experience: 6,
    price: 19000,
    location: "Ameerpet",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Product Photography", "Candid Photography"],
    image: "assets/product_shoot.png",
    gallery: [
      "assets/product_shoot.png",
      "assets/wedding_hero.png",
      "assets/candid_shoot.png"
    ],
    avatarColor: "#9c27b0",
    avatarText: "PC",
    verified: false,
    bestSeller: false,
    isStudio: true,
    bookedDates: ["2026-05-28", "2026-06-04", "2026-06-30"],
    about: "Pixel Capture Studio delivers premium product commercial photos and grand wedding shoots. Clean aesthetics, modern lighting setups, and stellar details.",
    bullets: [
      "100+ Commercial Brands",
      "6+ Years Experience",
      "High Res Cameras",
      "Product Styling Support"
    ],
    packages: {
      essential: { price: 19000, hours: 6, photographers: 1 },
      premium: { price: 35000, hours: 12, photographers: 2, popular: true },
      luxury: { price: 58000, hours: 16, photographers: 3 }
    }
  }
];

// Session Management (Auth Middleware)
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const loggedInUser = localStorage.getItem('currentUserRole'); // 'user' or 'photographer'
  
  const isLoginPage = filename === 'login.html';
  
  if (!isLoginPage && !loggedInUser) {
    // Redirect to login if not logged in
    window.location.href = 'login.html';
    return;
  }
  
  if (isLoginPage && loggedInUser) {
    // Redirect if already logged in
    if (loggedInUser === 'user') {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'photographer_dashboard.html';
    }
    return;
  }
  
  // Render user navigation states if logged in (for other pages)
  if (loggedInUser && !isLoginPage) {
    setupNavbarUserDropdown(loggedInUser);
  }
  
  // Set active class on navbar links dynamically
  if (!isLoginPage) {
    const navLinks = document.querySelectorAll('.nav-links li');
    const urlParams = new URLSearchParams(window.location.search);
    const isStudios = urlParams.get('studios') === 'true';
    const isPackages = urlParams.get('packages') === 'true';
    const isIndividuals = urlParams.get('individuals') === 'true';
    
    navLinks.forEach(li => {
      li.classList.remove('active');
      const a = li.querySelector('a');
      if (!a) return;
      const href = a.getAttribute('href');
      
      if (filename === 'index.html' || filename === '') {
        if (href === 'index.html') li.classList.add('active');
      } else if (filename === 'search.html') {
        if (isStudios && href.includes('studios=true')) {
          li.classList.add('active');
        } else if (isPackages && href.includes('packages=true')) {
          li.classList.add('active');
        } else if (isIndividuals && href.includes('individuals=true')) {
          li.classList.add('active');
        } else if (!isStudios && !isPackages && !isIndividuals && href.includes('search.html')) {
          li.classList.add('active');
        }
      } else if (filename === 'profile.html') {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const photographer = PHOTOGRAPHERS.find(p => p.id === id);
        if (photographer) {
          if (photographer.isStudio && href.includes('studios=true')) {
            li.classList.add('active');
          } else if (!photographer.isStudio && href.includes('individuals=true')) {
            li.classList.add('active');
          }
        } else if (href.includes('individuals=true')) {
          li.classList.add('active');
        }
      }
    });
  }
});

// Logout utility
function logout() {
  localStorage.removeItem('currentUserRole');
  window.location.href = 'login.html';
}

// Setup navbar dropdown logic
function setupNavbarUserDropdown(role) {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;
  
  // Replace Login button with User avatar dropdown
  const initials = role === 'user' ? 'U' : 'P';
  const roleTitle = role === 'user' ? 'Customer User' : 'Photographer';
  
  navRight.innerHTML = `
    <button class="wishlist-btn" title="View Wishlist" onclick="window.location.href='search.html?wishlist=true'">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
      </svg>
    </button>
    <div class="user-widget" id="user-profile-widget">
      <div class="user-avatar">${initials}</div>
      <div class="user-dropdown" id="user-dropdown-menu">
        <div class="user-dropdown-item" style="font-weight: 700; color: var(--dark-900); pointer-events: none;">
          ${roleTitle}
        </div>
        <div class="user-dropdown-divider"></div>
        ${role === 'user' ? `<a href="index.html" class="user-dropdown-item">Homepage</a>` : ''}
        ${role === 'user' ? `<a href="search.html" class="user-dropdown-item">Search Photographers</a>` : ''}
        ${role === 'photographer' ? `<a href="photographer_dashboard.html" class="user-dropdown-item">My Dashboard</a>` : ''}
        <div class="user-dropdown-divider"></div>
        <a href="#" class="user-dropdown-item" id="logout-menu-item" onclick="logout(); return false;">Log Out</a>
      </div>
    </div>
  `;
  
  // Dropdown toggle logic
  const widget = document.getElementById('user-profile-widget');
  const menu = document.getElementById('user-dropdown-menu');
  
  if (widget && menu) {
    widget.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  }
}

// Persist favorites array in LocalStorage
function getFavorites() {
  const favs = localStorage.getItem('pickmyshoot_favorites');
  return favs ? JSON.parse(favs) : [];
}

function toggleFavorite(id) {
  let favs = getFavorites();
  const index = favs.indexOf(id);
  if (index === -1) {
    favs.push(id);
  } else {
    favs.splice(index, 1);
  }
  localStorage.setItem('pickmyshoot_favorites', JSON.stringify(favs));
  return index === -1; // returns true if added, false if removed
}

// Custom Dropdown & Calendar Logic
function toggleCustomDropdown(dropdownId) {
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    if (dropdown.id !== dropdownId) dropdown.classList.remove('show');
  });
  document.querySelectorAll('.custom-calendar-picker').forEach(cal => {
    cal.classList.remove('show');
  });
  
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) dropdown.classList.toggle('show');
}

function selectCustomDropdownOption(optionElement, dropdownId, hiddenInputId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  
  dropdown.querySelectorAll('.custom-dropdown-menu li').forEach(li => {
    li.classList.remove('selected');
  });
  optionElement.classList.add('selected');
  
  const selectedText = optionElement.textContent;
  dropdown.querySelector('.dropdown-selected-value').textContent = selectedText;
  
  const val = optionElement.dataset.value;
  const hiddenInput = document.getElementById(hiddenInputId);
  if (hiddenInput) {
    hiddenInput.value = val;
    // Dispatch change event
    const event = new Event('change', { bubbles: true });
    hiddenInput.dispatchEvent(event);
  }
  
  dropdown.classList.remove('show');
}

function toggleCustomCalendar(calendarId) {
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    dropdown.classList.remove('show');
  });
  document.querySelectorAll('.custom-calendar-picker').forEach(cal => {
    if (cal.id !== calendarId) cal.classList.remove('show');
  });
  
  const calendar = document.getElementById(calendarId);
  if (calendar) {
    calendar.classList.toggle('show');
    if (calendar.classList.contains('show')) {
      renderCustomCalendar(calendarId);
    }
  }
}

function changeCustomMonth(event, direction, calendarId) {
  event.stopPropagation();
  const calendar = document.getElementById(calendarId);
  if (!calendar) return;
  
  let currentMonth = parseInt(calendar.dataset.currentMonth);
  let currentYear = parseInt(calendar.dataset.currentYear);
  
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  
  calendar.dataset.currentMonth = currentMonth;
  calendar.dataset.currentYear = currentYear;
  renderCustomCalendar(calendarId);
}

function selectCalendarDate(day, month, year, calendarId) {
  const calendar = document.getElementById(calendarId);
  if (!calendar) return;
  
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  calendar.dataset.selectedDate = dateStr;
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  calendar.querySelector('.calendar-selected-value').textContent = `${monthNames[month]} ${day}, ${year}`;
  
  const hiddenInput = calendar.querySelector('input[type="hidden"]');
  if (hiddenInput) {
    hiddenInput.value = dateStr;
    // Trigger change event to notify other scripts
    const event = new Event('change', { bubbles: true });
    hiddenInput.dispatchEvent(event);
  }
  calendar.classList.remove('show');
}

function renderCustomCalendar(calendarId) {
  const container = document.getElementById(calendarId);
  if (!container) return;
  
  if (!container.dataset.currentMonth) {
    const today = new Date();
    container.dataset.currentMonth = today.getMonth();
    container.dataset.currentYear = today.getFullYear();
  }
  
  const currentMonth = parseInt(container.dataset.currentMonth);
  const currentYear = parseInt(container.dataset.currentYear);
  const selectedDateStr = container.dataset.selectedDate || '';
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const headerText = container.querySelector('.calendar-month-year');
  if (headerText) headerText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
  const daysContainer = container.querySelector('.calendar-days');
  if (!daysContainer) return;
  daysContainer.innerHTML = '';
  
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    daysContainer.appendChild(emptyCell);
  }
  
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.textContent = day;
    
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (selectedDateStr === dateStr) dayCell.classList.add('selected');
    if (day === todayDate && currentMonth === todayMonth && currentYear === todayYear) dayCell.classList.add('today');
    
    const cellDate = new Date(currentYear, currentMonth, day);
    const comparisonToday = new Date(todayYear, todayMonth, todayDate);
    if (cellDate < comparisonToday) {
      dayCell.classList.add('disabled');
    } else {
      dayCell.onclick = (e) => {
        e.stopPropagation();
        selectCalendarDate(day, currentMonth, currentYear, calendarId);
      };
    }
    daysContainer.appendChild(dayCell);
  }
}

// Click outside handler for custom controls
window.addEventListener('click', (e) => {
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('show');
  });
  document.querySelectorAll('.custom-calendar-picker').forEach(cal => {
    if (!cal.contains(e.target)) cal.classList.remove('show');
  });
  
  // Close mobile menu when clicking outside navbar
  const navLinks = document.querySelector('.nav-links');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (navLinks && navLinks.classList.contains('show') && !navLinks.contains(e.target) && (!menuBtn || !menuBtn.contains(e.target))) {
    navLinks.classList.remove('show');
  }
});

// Toggle Mobile Responsive Navigation Drawer
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}


