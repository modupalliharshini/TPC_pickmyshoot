/* pickmyshoot - Profile and Packages Interactivity */

// Current profile data reference
let photographer = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'the-wedding-story'; // Fallback to demo
  
  photographer = PHOTOGRAPHERS.find(p => p.id === id);
  
  if (!photographer) {
    alert("Photographer not found. Returning to listings.");
    window.location.href = 'search.html';
    return;
  }
  
  renderProfileUI();
  setupTabListeners();
  setupModalListeners();
  setupWhatsAppChat();
});

// Render dynamic fields on profile page
function renderProfileUI() {
  const favorites = getFavorites();
  const isFav = favorites.includes(photographer.id);
  
  // Update browser tab title
  document.title = `${photographer.name} - Profile | pickmyshoot`;
  
  // Update back button link dynamically based on profile type
  const backBtn = document.getElementById('profile-back-to-listings');
  if (backBtn) {
    if (photographer.isStudio) {
      backBtn.href = 'search.html?studios=true';
    } else {
      backBtn.href = 'search.html?individuals=true';
    }
  }
  
  // 1. Gallery Grid
  const gallery = photographer.gallery;
  const galleryGrid = document.getElementById('profile-gallery-grid');
  if (galleryGrid) {
    if (!photographer.isStudio) {
      galleryGrid.style.display = 'none';
    } else {
      galleryGrid.style.display = 'grid';
      galleryGrid.innerHTML = `
        <div class="gallery-left">
          <img src="${gallery[0] || 'assets/wedding_hero.png'}" alt="${photographer.name} Main Photo">
          <button class="gallery-fav-btn ${isFav ? 'active' : ''}" onclick="handleProfileFavToggle(this, '${photographer.id}')" title="Save to favorites">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
        <div class="gallery-right">
          <div class="gallery-thumb"><img src="${gallery[1] || 'assets/prewedding_shoot.png'}" alt="Portfolio Thumbnail 1"></div>
          <div class="gallery-thumb"><img src="${gallery[2] || 'assets/candid_shoot.png'}" alt="Portfolio Thumbnail 2"></div>
          <div class="gallery-thumb"><img src="${gallery[3] || 'assets/maternity_shoot.png'}" alt="Portfolio Thumbnail 3"></div>
          <div class="gallery-thumb">
            <img src="${gallery[4] || 'assets/baby_shoot.png'}" alt="Portfolio Thumbnail 4">
            <div class="gallery-overlay" onclick="switchTab('portfolio')">
              <span class="gallery-overlay-count">+25</span>
              <span>View Gallery</span>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  // 2. Profile Details Header
  const avatar = document.getElementById('profile-avatar');
  const name = document.getElementById('profile-name');
  const metaLine = document.getElementById('profile-meta-line');
  const locationLine = document.getElementById('profile-location-line');
  
  if (avatar) {
    if (!photographer.isStudio && photographer.image) {
      avatar.innerHTML = `<img src="${photographer.image}" alt="${photographer.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      avatar.style.backgroundColor = 'transparent';
      avatar.style.padding = '0';
      avatar.style.display = 'block';
    } else {
      avatar.textContent = photographer.avatarText;
      avatar.style.backgroundColor = photographer.avatarColor;
      avatar.innerHTML = photographer.avatarText;
    }
  }
  
  if (name) {
    name.innerHTML = `${photographer.name} ${photographer.verified ? '<i class="fa-solid fa-circle-check" title="Verified Professional"></i>' : ''}`;
  }
  
  if (metaLine) {
    if (!photographer.isStudio) {
      metaLine.innerHTML = `
        <span><i class="fa-solid fa-star"></i> ${photographer.rating.toFixed(1)} (${photographer.reviews} Reviews)</span>
        <span>•</span>
        <span>${photographer.age} Years Old</span>
        <span>•</span>
        <span>${photographer.experience}+ Years Experience</span>
        <span>•</span>
        <span class="text-accent" style="font-weight: 800;">₹${photographer.chargePerHour.toLocaleString('en-IN')}/hour</span>
      `;
    } else {
      metaLine.innerHTML = `
        <span><i class="fa-solid fa-star"></i> ${photographer.rating.toFixed(1)} (${photographer.reviews} Reviews)</span>
        <span>•</span>
        <span>${photographer.experience}+ Years Experience</span>
      `;
    }
  }
  
  if (locationLine) {
    locationLine.innerHTML = `
      <i class="fa-solid fa-location-dot"></i> ${photographer.location}, ${photographer.city}
    `;
  }
  
  // Hide or show tabs dynamically based on photographer profile type
  const packagesTab = document.querySelector('.profile-tab[data-tab="packages"]');
  const faqTab = document.querySelector('.profile-tab[data-tab="faq"]');
  const portfolioTab = document.querySelector('.profile-tab[data-tab="portfolio"]');
  
  if (!photographer.isStudio) {
    if (packagesTab) packagesTab.style.display = 'none';
    if (faqTab) faqTab.style.display = 'none';
    if (portfolioTab) portfolioTab.style.display = 'none';
  } else {
    if (packagesTab) packagesTab.style.display = '';
    if (faqTab) faqTab.style.display = '';
    if (portfolioTab) portfolioTab.style.display = '';
  }
  
  // 3. Render initial tab based on query parameters
  const tabParams = new URLSearchParams(window.location.search);
  let defaultTab = tabParams.get('tab') || 'about';
  if (!photographer.isStudio && defaultTab === 'portfolio') {
    defaultTab = 'about';
  }
  switchTab(defaultTab);
  
  // 4. Update Inquiry Modal title
  const modalHeading = document.getElementById('inquiry-modal-heading');
  if (modalHeading) {
    modalHeading.textContent = `Send Inquiry to ${photographer.name}`;
  }
}

// Render "About & Packages" tab split (stacked vertically to prevent narrow squishing)
function renderAboutTabContent() {
  const container = document.getElementById('tab-view-content');
  if (!container) return;
  
  // Bullets HTML
  const bulletsHTML = photographer.bullets.map(b => `
    <li class="about-bullet-item">
      <i class="fa-solid fa-circle-check text-accent"></i> ${b}
    </li>
  `).join('');
  
  if (!photographer.isStudio) {
    // For individual photographers: render bio and portfolio grid without packages
    container.innerHTML = `
      <div class="profile-about-layout">
        <div class="about-block-content">
          <h3 class="packages-block-title" style="margin-bottom: 16px;">About the Photographer</h3>
          <p>${photographer.about}</p>
          <ul class="about-bullet-list" style="margin-bottom: 32px;">
            ${bulletsHTML}
          </ul>
          
          <div class="works-section">
            <h3 class="works-title">Portfolio Showcase</h3>
            <div class="works-grid">
              ${photographer.gallery.map((img, i) => `
                <div class="works-item">
                  <img src="${img}" alt="Portfolio Showcase ${i + 1}">
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // For studios: render original layout with packages
    const packages = photographer.packages;
    const packagesHTML = `
      <div class="package-card">
        <span class="package-tier">Essential</span>
        <div class="package-price">₹${packages.essential.price.toLocaleString('en-IN')}</div>
        <ul class="package-features-list" style="margin-bottom: 20px;">
          <li><i class="fa-solid fa-check"></i> ${packages.essential.hours} Hours Coverage</li>
          <li><i class="fa-solid fa-check"></i> ${packages.essential.photographers} Professional Photographer</li>
          <li><i class="fa-solid fa-check"></i> 100+ Edited High-Res Images</li>
          <li><i class="fa-solid fa-check"></i> Online Private Gallery Access</li>
        </ul>
        <button class="btn btn-outline-primary" style="margin-top: auto; width: 100%;" onclick="openInquiryModal()">Book Essential</button>
      </div>
      
      <div class="package-card popular">
        <span class="popular-badge">Most Popular</span>
        <span class="package-tier">Premium</span>
        <div class="package-price" style="color: var(--primary);">₹${packages.premium.price.toLocaleString('en-IN')}</div>
        <ul class="package-features-list" style="margin-bottom: 20px;">
          <li><i class="fa-solid fa-check"></i> ${packages.premium.hours} Hours Coverage</li>
          <li><i class="fa-solid fa-check"></i> ${packages.premium.photographers} Photographers (Candid + Traditional)</li>
          <li><i class="fa-solid fa-check"></i> 250+ Edited High-Res Images</li>
          <li><i class="fa-solid fa-check"></i> Premium Handcrafted Photo Book</li>
          <li><i class="fa-solid fa-check"></i> Cinematic Teaser (2 mins)</li>
        </ul>
        <button class="btn btn-primary" style="margin-top: auto; width: 100%;" onclick="openInquiryModal()">Book Premium</button>
      </div>
      
      <div class="package-card">
        <span class="package-tier">Luxury</span>
        <div class="package-price">₹${packages.luxury.price.toLocaleString('en-IN')}</div>
        <ul class="package-features-list" style="margin-bottom: 20px;">
          <li><i class="fa-solid fa-check"></i> ${packages.luxury.hours} Hours Coverage</li>
          <li><i class="fa-solid fa-check"></i> ${packages.luxury.photographers} Photographers + Cinematographers</li>
          <li><i class="fa-solid fa-check"></i> Unlimited Edited High-Res Images</li>
          <li><i class="fa-solid fa-check"></i> Hardcover Signature Photo Book</li>
          <li><i class="fa-solid fa-check"></i> Full Cinematic Film (20 mins)</li>
          <li><i class="fa-solid fa-check"></i> Drone Videography Coverage</li>
        </ul>
        <button class="btn btn-outline-primary" style="margin-top: auto; width: 100%;" onclick="openInquiryModal()">Book Luxury</button>
      </div>
    `;

    container.innerHTML = `
      <div class="profile-about-layout">
        <!-- Top: About Details -->
        <div class="about-block-content">
          <h3 class="packages-block-title" style="margin-bottom: 16px;">About the Studio</h3>
          <p>${photographer.about}</p>
          <ul class="about-bullet-list" style="margin-bottom: 32px;">
            ${bulletsHTML}
          </ul>
        </div>
        
        <!-- Bottom: Packages Grid -->
        <div class="about-packages-section">
          <div class="packages-block-header">
            <h3 class="packages-block-title">Photography Catalog Packages</h3>
            <span class="view-all-link" style="cursor: pointer;" onclick="switchTab('packages')">View all packages <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div class="packages-block-grid">
            ${packagesHTML}
          </div>
        </div>
      </div>
    `;
  }
}

// Bind tabs click event switches
function setupTabListeners() {
  const tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

// Perform active tab UI update and draw tab contents
function switchTab(tabName) {
  if (!photographer.isStudio && tabName === 'portfolio') {
    tabName = 'about';
  }
  const tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach(t => t.classList.remove('active'));
  
  const activeTab = document.querySelector(`.profile-tab[data-tab="${tabName}"]`);
  if (activeTab) activeTab.classList.add('active');
  
  const container = document.getElementById('tab-view-content');
  if (!container) return;
  
  switch(tabName) {
    case 'about':
      renderAboutTabContent();
      break;
    case 'packages':
      renderPackagesTabContent();
      break;
    case 'portfolio':
      renderPortfolioTabContent();
      break;
    case 'reviews':
      renderReviewsTabContent();
      break;
    case 'faq':
      renderFAQTabContent();
      break;
  }
}

// Specific tab layout renders
function renderPackagesTabContent() {
  const container = document.getElementById('tab-view-content');
  const packages = photographer.packages;
  
  container.innerHTML = `
    <div class="portfolio-tab-grid" style="grid-template-columns: 1fr; margin-bottom: 50px;">
      <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 24px; text-align: center;">Choose Your Photography Catalog Package</h3>
      <div class="packages-block-grid" style="grid-template-columns: repeat(3, 1fr); max-width: 900px; margin: 0 auto;">
        <!-- Essential -->
        <div class="package-card">
          <span class="package-tier">Essential Package</span>
          <div class="package-price">₹${packages.essential.price.toLocaleString('en-IN')}</div>
          <ul class="package-features-list" style="margin-bottom: 20px;">
            <li><i class="fa-solid fa-circle-check"></i> ${packages.essential.hours} Hours Coverage</li>
            <li><i class="fa-solid fa-circle-check"></i> ${packages.essential.photographers} Photographer</li>
            <li><i class="fa-solid fa-circle-check"></i> 100+ High-Res JPEGs</li>
            <li><i class="fa-solid fa-circle-check"></i> 15 Days Delivery timeline</li>
          </ul>
          <button class="btn btn-primary" style="margin-top: auto;" onclick="openInquiryModal()">Book Essential</button>
        </div>
        
        <!-- Premium -->
        <div class="package-card popular">
          <span class="popular-badge">Most Popular</span>
          <span class="package-tier">Premium Package</span>
          <div class="package-price" style="color: var(--primary);">₹${packages.premium.price.toLocaleString('en-IN')}</div>
          <ul class="package-features-list" style="margin-bottom: 20px;">
            <li><i class="fa-solid fa-circle-check"></i> ${packages.premium.hours} Hours Coverage</li>
            <li><i class="fa-solid fa-circle-check"></i> ${packages.premium.photographers} Photographers</li>
            <li><i class="fa-solid fa-circle-check"></i> 250+ Color-graded Images</li>
            <li><i class="fa-solid fa-circle-check"></i> Signature Photo Album</li>
            <li><i class="fa-solid fa-circle-check"></i> Cinematic Short Video</li>
            <li><i class="fa-solid fa-circle-check"></i> 10 Days Delivery timeline</li>
          </ul>
          <button class="btn btn-primary" style="margin-top: auto;" onclick="openInquiryModal()">Book Premium</button>
        </div>
        
        <!-- Luxury -->
        <div class="package-card">
          <span class="package-tier">Luxury Package</span>
          <div class="package-price">₹${packages.luxury.price.toLocaleString('en-IN')}</div>
          <ul class="package-features-list" style="margin-bottom: 20px;">
            <li><i class="fa-solid fa-circle-check"></i> ${packages.luxury.hours} Hours Coverage</li>
            <li><i class="fa-solid fa-circle-check"></i> ${packages.luxury.photographers} Photographers</li>
            <li><i class="fa-solid fa-circle-check"></i> Full Raw & Edited Files</li>
            <li><i class="fa-solid fa-circle-check"></i> Premium Photo Albums (2 Sets)</li>
            <li><i class="fa-solid fa-circle-check"></i> Cinematic Video (Full length)</li>
            <li><i class="fa-solid fa-circle-check"></i> Drone Aerial Views</li>
            <li><i class="fa-solid fa-circle-check"></i> 7 Days Delivery timeline</li>
          </ul>
          <button class="btn btn-primary" style="margin-top: auto;" onclick="openInquiryModal()">Book Luxury</button>
        </div>
      </div>
    </div>
  `;
}

function renderPortfolioTabContent() {
  const container = document.getElementById('tab-view-content');
  const gallery = photographer.gallery;
  
  // Mock adding more images to show grid density
  const items = [...gallery, ...gallery, ...gallery].slice(0, 9);
  
  container.innerHTML = `
    <div class="portfolio-tab-grid">
      ${items.map((img, i) => `
        <div class="portfolio-item">
          <img src="${img}" alt="${photographer.name} Portfolio Image ${i+1}">
        </div>
      `).join('')}
    </div>
  `;
}

function renderReviewsTabContent() {
  const container = document.getElementById('tab-view-content');
  
  // Generate some premium reviews
  const reviews = [
    { name: "Sneha Reddy", rating: 5, text: "Absolutely incredible team! The Wedding Story captured our wedding so beautifully. The candid shots were extremely natural, and the video team did a fantastic job with the cinematic trailer. Everyone in our family was very impressed." },
    { name: "Rahul Verma", rating: 5, text: "Excellent experience. Very professional crew, they came on time and guided us throughout the shoot. The album print quality is premium and delivered within the promised 10 days. Highly recommend their Premium Package." },
    { name: "Amit Sharma", rating: 4, text: "Great wedding photography! The team was creative and very cooperative. The only minor thing was that the photo editing took 3 days longer than expected, but the final output was absolutely worth the wait. Great color grading!" }
  ];
  
  container.innerHTML = `
    <div class="reviews-tab-list">
      <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Customer Reviews (${photographer.reviews})</h3>
      <div style="font-size: 24px; font-weight: 800; color: var(--dark-900); display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
        ★ ${photographer.rating.toFixed(1)} <span style="font-size: 14px; color: var(--dark-500); font-weight: 600;">out of 5 stars based on customer submissions</span>
      </div>
      
      ${reviews.map(r => `
        <div class="review-item">
          <div class="review-user-line">
            <span class="review-user-name">${r.name}</span>
            <span class="review-rating-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
          </div>
          <p class="review-text">"${r.text}"</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFAQTabContent() {
  const container = document.getElementById('tab-view-content');
  
  const faqs = [
    { q: "What is your photography files delivery timeline?", a: "We usually deliver the fully color-graded and edited digital images within 10 to 15 business days. Handcrafted photo albums take another 7 to 10 days after you complete selections." },
    { q: "Do you charge extra travel fees inside Hyderabad?", a: "No extra travel fees apply for shoots situated within the Hyderabad Metropolitan Area. For locations far outside OR outstation shoots, travel and accommodation fees are billed at actual cost." },
    { q: "Do we get raw, unedited photography files?", a: "We provide raw unedited files only in our Luxury Package. For Essential and Premium packages, we provide high-resolution, color-corrected JPEGs." },
    { q: "What is your booking cancellation and refund policy?", a: "We require a 20% advance payment to lock in your date. Cancellations made at least 15 days before the event receive a full refund. Cancellations after that are non-refundable but can be adjusted to another booking date." }
  ];
  
  container.innerHTML = `
    <div class="faq-tab-list">
      <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 20px;">Frequently Asked Questions</h3>
      ${faqs.map(faq => `
        <div class="faq-item">
          <div class="faq-question">${faq.q}</div>
          <div class="faq-answer">${faq.a}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Favorite Heart button actions
function handleProfileFavToggle(btn, id) {
  const icon = btn.querySelector('i');
  const isAdded = toggleFavorite(id);
  
  if (isAdded) {
    btn.classList.add('active');
    icon.className = 'fa-solid fa-heart';
  } else {
    btn.classList.remove('active');
    icon.className = 'fa-regular fa-heart';
  }
}

// Setup Inquiry Modal handlers
function setupModalListeners() {
  const openBtns = document.querySelectorAll('.open-inquiry-modal-btn');
  const closeBtn = document.getElementById('inquiry-modal-close');
  const overlay = document.getElementById('inquiry-modal-overlay');
  const form = document.getElementById('inquiry-form');
  
  window.openInquiryModal = () => {
    overlay.classList.add('show');
  };
  
  openBtns.forEach(b => {
    b.addEventListener('click', openInquiryModal);
  });
  
  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
    });
    
    // Close on clicking outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    });
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      
      // Show loading spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...`;
      
      setTimeout(() => {
        // Success response
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Inquiry Sent Successfully!`;
        submitBtn.style.backgroundColor = '#25d366';
        
        // Log simulator lead for Photographer dashboard
        const leads = JSON.parse(localStorage.getItem('pickmyshoot_leads') || '[]');
        leads.push({
          photographerId: photographer.id,
          photographerName: photographer.name,
          clientName: document.getElementById('client-name').value,
          clientPhone: document.getElementById('client-phone').value,
          eventDate: document.getElementById('event-date').value,
          eventType: document.getElementById('event-type').value,
          message: document.getElementById('client-msg').value,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pickmyshoot_leads', JSON.stringify(leads));
        
        // Reset form & close
        setTimeout(() => {
          overlay.classList.remove('show');
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.backgroundColor = '';
        }, 1500);
      }, 1000);
    });
  }
}

// WhatsApp chat simulator setup
function setupWhatsAppChat() {
  const triggerBtn = document.getElementById('whatsapp-trigger-btn');
  const chatContainer = document.getElementById('whatsapp-chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body-messages');
  const chatInput = document.getElementById('chat-msg-input');
  const sendBtn = document.getElementById('chat-send-btn');
  
  if (!triggerBtn || !chatContainer || !chatClose || !chatBody || !chatInput || !sendBtn) return;
  
  // Open WhatsApp simulated overlay
  triggerBtn.addEventListener('click', () => {
    chatContainer.classList.add('show');
    chatInput.focus();
    
    // Add default initial message if empty
    if (chatBody.children.length === 0) {
      addIncomingMessage(`Hi! Thanks for checking out ${photographer.name}. Which date are you planning your shoot for? 😊`);
    }
  });
  
  chatClose.addEventListener('click', () => {
    chatContainer.classList.remove('show');
  });
  
  // Send message triggers
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addOutgoingMessage(text);
    chatInput.value = "";
    
    // Typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble incoming';
    typingBubble.innerHTML = `<i class="fa-solid fa-ellipsis fa-bounce"></i>`;
    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Photographer simulated reply delay
    setTimeout(() => {
      chatBody.removeChild(typingBubble);
      
      let reply = "";
      if (text.toLowerCase().includes('wedding') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
        reply = `Our starts from ₹${photographer.price.toLocaleString('en-IN')}! For custom quotes, please share details like hours, events count. I can email a quote catalog to you!`;
      } else if (text.match(/\b\d{4}\b/)) { // looks like a year/date
        reply = `That date is currently open for booking, but we've received other inquiries for the same weekend. Would you like me to send a lock-in slot estimate?`;
      } else {
        reply = `Perfect! We have customized packages for that. Would you like to schedule a quick phone call to align on details? Let me know your phone number.`;
      }
      addIncomingMessage(reply);
    }, 1200);
  }
  
  function addIncomingMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble incoming';
    bubble.innerHTML = `${text} <span class="chat-time">${time}</span>`;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function addOutgoingMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble outgoing';
    bubble.innerHTML = `${text} <span class="chat-time">${time}</span>`;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}
