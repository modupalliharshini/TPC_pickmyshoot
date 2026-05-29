import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img src="/assets/logo_white.png" alt="pickmyshoot Logo" style={{ height: '75px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <p className="footer-desc">Find the perfect verified photographers for weddings, pre-weddings, baby shoots and events in India.</p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <a href="#" style={{ color: 'inherit' }}><i className="fa-brands fa-facebook"></i></a>
            <a href="#" style={{ color: 'inherit' }}><i className="fa-brands fa-instagram"></i></a>
            <a href="#" style={{ color: 'inherit' }}><i className="fa-brands fa-twitter"></i></a>
            <a href="#" style={{ color: 'inherit' }}><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div>
          <ul className="footer-links" style={{ marginTop: '38px' }}>
            <li><Link to="/search?individuals=true">Search Photographers</Link></li>
            <li><Link to="/search?packages=true">Photography Packages</Link></li>
            <li><Link to="/search?studios=true">Premium Studios</Link></li>
          </ul>
        </div>
        <div>
          <ul className="footer-links" style={{ marginTop: '38px' }}>
            <li><Link to="/coming-soon">Advertising</Link></li>
            <li><Link to="/terms-conditions">Terms of Service</Link></li>
            <li><Link to="/faq">FAQ & Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact">
            <li><i className="fa-solid fa-location-dot"></i> Banjara Hills, Hyderabad, India</li>
            <li><i className="fa-solid fa-phone"></i> +91 98765 43210</li>
            <li><i className="fa-solid fa-envelope"></i> contact@pickmyshoot.com</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <div>&copy; 2026 Pick My Shoot. All rights reserved. Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>Patterns Infotech Pvt Ltd.</a></div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
