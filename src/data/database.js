// Mock Database of Photographers
export const PHOTOGRAPHERS = [
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
    image: "/assets/wedding_hero.png",
    gallery: [
      "/assets/wedding_hero.png",
      "/assets/prewedding_shoot.png",
      "/assets/candid_shoot.png",
      "/assets/maternity_shoot.png",
      "/assets/baby_shoot.png"
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
    },
    languages: ["English", "Hindi"],
    travelOutsideCity: true
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
    categories: ["Wedding Photography", "Pre Wedding Shoot", "Candid Photography", "Product Photography"],
    image: "/assets/karthik_profile.png",
    gallery: [
      "/assets/prewedding_shoot.png",
      "/assets/wedding_hero.png",
      "/assets/candid_shoot.png",
      "/assets/maternity_shoot.png"
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
    },
    languages: ["English", "Telugu", "Hindi"],
    travelOutsideCity: true
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
    categories: ["Wedding Photography", "Pre Wedding Shoot", "Candid Photography", "Baby Shoot"],
    image: "/assets/rahul_profile.png",
    gallery: [
      "/assets/candid_shoot.png",
      "/assets/wedding_hero.png",
      "/assets/prewedding_shoot.png",
      "/assets/baby_shoot.png"
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
    },
    languages: ["English", "Hindi"],
    travelOutsideCity: false
  },
  {
    id: "akhil-reddy",
    name: "Akhil Reddy",
    rating: 4.8,
    reviews: 160,
    experience: 2, // Modified to test the 1-3 years filter!
    price: 20000,
    location: "Gachibowli",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Maternity Shoot", "Candid Photography", "Corporate"],
    image: "/assets/akhil_profile.png",
    gallery: [
      "/assets/maternity_shoot.png",
      "/assets/wedding_hero.png",
      "/assets/baby_shoot.png"
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
      "2+ Years Experience",
      "Dedicated Studio Setup",
      "Custom Outfits Available"
    ],
    packages: {
      essential: { price: 20000, hours: 5, photographers: 1 },
      premium: { price: 38000, hours: 10, photographers: 2, popular: true },
      luxury: { price: 60000, hours: 14, photographers: 3 }
    },
    languages: ["Telugu", "Hindi"],
    travelOutsideCity: true
  },
  {
    id: "foto-perfect",
    name: "Foto Perfect Studio",
    rating: 4.7,
    reviews: 140,
    experience: 4, // Fits 3-5 years filter!
    price: 15000,
    location: "Kukatpally",
    city: "Hyderabad",
    categories: ["Wedding Photography", "Baby Shoot", "Candid Photography"],
    image: "/assets/baby_shoot.png",
    gallery: [
      "/assets/baby_shoot.png",
      "/assets/wedding_hero.png",
      "/assets/prewedding_shoot.png"
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
      "4+ Years Experience",
      "Baby Props Provided",
      "Warm Sanitized Studio"
    ],
    packages: {
      essential: { price: 15000, hours: 4, photographers: 1 },
      premium: { price: 28000, hours: 8, photographers: 2, popular: true },
      luxury: { price: 45000, hours: 12, photographers: 2 }
    },
    languages: ["English", "Telugu"],
    travelOutsideCity: false
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
    image: "/assets/product_shoot.png",
    gallery: [
      "/assets/product_shoot.png",
      "/assets/wedding_hero.png",
      "/assets/candid_shoot.png"
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
    },
    languages: ["English", "Hindi"],
    travelOutsideCity: true
  }
];
