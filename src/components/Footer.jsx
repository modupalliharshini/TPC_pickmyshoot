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
          <h4 className="footer-title">For Customers</h4>
          <ul className="footer-links">
            <li><Link to="/search">Search Photographers</Link></li>
            <li><Link to="/search?packages=true">Photography Packages</Link></li>
            <li><Link to="/search?studios=true">Premium Studios</Link></li>
            <li><a href="#">FAQ & Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-title">For Photographers</h4>
          <ul className="footer-links">
            <li><Link to="/login">Join pickmyshoot</Link></li>
            <li><Link to="/dashboard">Photographer Dashboard</Link></li>
            <li><a href="#">Advertising</a></li>
            <li><a href="#">Terms of Service</a></li>
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
        <div>&copy; 2026 pickmyshoot. All rights reserved. Built with love in Hyderabad.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
