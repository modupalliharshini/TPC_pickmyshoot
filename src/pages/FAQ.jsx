import React, { useState } from 'react';

const FAQ_DATA = [
  {
    id: 1,
    category: 'general',
    question: 'What is pickmyshoot?',
    answer: 'pickmyshoot is a direct connection platform that brings together verified photographers and customers across India. We list top-tier professional artists, allowing you to browse their portfolios and packages, and book them directly without any middlemen or platform booking commissions.'
  },
  {
    id: 2,
    category: 'general',
    question: 'Is pickmyshoot free to use?',
    answer: 'Yes! Searching, browsing, and contacting photographers is completely free for customers. We do not charge booking fees, processing fees, or commissions. You settle the payments directly with the photographer according to your agreed terms.'
  },
  {
    id: 3,
    category: 'customer',
    question: 'How do I book a photographer?',
    answer: 'Simply browse our listings, filter by style, location, budget, and availability. Review detailed profiles, evaluate package pricing, and use the direct contact features (such as WhatsApp chat or direct call options) to finalize details and book.'
  },
  {
    id: 4,
    category: 'customer',
    question: 'Are the photographers on the platform verified?',
    answer: 'Yes, absolutely. We run multi-stage checks on all registered photographers, verifying their identity, business location, portfolio authenticity, and customer track record to ensure a high-quality and safe booking experience.'
  },
  {
    id: 5,
    category: 'customer',
    question: 'How do payments work?',
    answer: 'Payments are made directly to the photographer according to their customized terms (e.g., an advance booking deposit and final payment upon delivering the photos). We recommend signing a basic service agreement directly with the photographer for your peace of mind.'
  },
  {
    id: 6,
    category: 'photographer',
    question: 'How can I get listed on pickmyshoot?',
    answer: 'We accept applications from professional photographers with a verified portfolio. Please write to us at partner@pickmyshoot.com with details of your work, location, and equipment list, and our onboarding team will guide you through verification.'
  },
  {
    id: 7,
    category: 'photographer',
    question: 'Does pickmyshoot take a cut of my earnings?',
    answer: 'No, we do not take any commission or percentage of bookings. 100% of the booking value goes directly to you. We believe in empowering creators without taxing their hard work.'
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = activeCategory === 'all' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(faq => faq.category === activeCategory);

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-header">
          <h1 className="static-title">FAQ & Support</h1>
          <p className="static-subtitle">
            Have questions about how pickmyshoot works? Find quick answers here or reach out to our dedicated support team.
          </p>
        </div>

        <div className="faq-categories">
          <button 
            className={`faq-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); setOpenId(null); }}
          >
            All Questions
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'general' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('general'); setOpenId(null); }}
          >
            General Info
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'customer' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('customer'); setOpenId(null); }}
          >
            For Customers
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'photographer' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('photographer'); setOpenId(null); }}
          >
            For Photographers
          </button>
        </div>

        <div className="static-container">
          <div className="faq-list">
            {filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`faq-item ${openId === faq.id ? 'active' : ''}`}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={openId === faq.id}
                >
                  <span>{faq.question}</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="support-section">
            <h3>Still need help?</h3>
            <p>Our customer happiness team is available to assist you with bookings, verification, or general questions.</p>
            <div className="support-buttons">
              <a href="mailto:support@pickmyshoot.com" className="support-btn-primary">
                <i className="fa-solid fa-envelope"></i> Email Support
              </a>
              <a href="tel:+919876543210" className="support-btn-secondary">
                <i className="fa-solid fa-phone"></i> Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
