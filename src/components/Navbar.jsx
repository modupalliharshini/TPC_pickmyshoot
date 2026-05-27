import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUserRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdowns and menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  const isHomeActive = location.pathname === '/' || location.pathname === '/index.html';
  const isSearchActive = location.pathname === '/search';
  const isPhotographersActive = isSearchActive && getQueryParam('individuals') === 'true';
  const isStudiosActive = isSearchActive && getQueryParam('studios') === 'true';
  const isPackagesActive = isSearchActive && getQueryParam('packages') === 'true';
  const isBlogActive = location.pathname === '/blog';

  const userInitials = currentUserRole === 'user' ? 'U' : 'P';
  const userTitle = currentUserRole === 'user' ? 'Customer User' : 'Photographer';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="nav-left">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo.png" alt="pickmyshoot Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div className="location-selector">
            <i className="fa-solid fa-location-dot"></i>
            <span>Hyderabad</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
          </div>
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
          <li className={isHomeActive ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={isPhotographersActive ? 'active' : ''}>
            <Link to="/search?individuals=true">Photographers</Link>
          </li>
          <li className={isStudiosActive ? 'active' : ''}>
            <Link to="/search?studios=true">Studios</Link>
          </li>
          <li className={isPackagesActive ? 'active' : ''}>
            <Link to="/search?packages=true">Packages</Link>
          </li>
          <li className={isBlogActive ? 'active' : ''}>
            <Link to="/blog">Blog</Link>
          </li>
        </ul>

        <div className="nav-right" id="navbar-auth-section">
          {currentUserRole ? (
            <>
              <button 
                className="wishlist-btn" 
                title="View Wishlist" 
                onClick={() => navigate('/search?wishlist=true')}
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </button>
              <div 
                className="user-widget" 
                id="user-profile-widget"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <div className="user-avatar">{userInitials}</div>
                <div className={`user-dropdown ${dropdownOpen ? 'show' : ''}`} id="user-dropdown-menu">
                  <div className="user-dropdown-item" style={{ fontWeight: 700, color: 'var(--dark-900)', pointerEvents: 'none' }}>
                    {userTitle}
                  </div>
                  <div className="user-dropdown-divider"></div>
                  {currentUserRole === 'user' && (
                    <>
                      <Link to="/" className="user-dropdown-item">Homepage</Link>
                      <Link to="/search" className="user-dropdown-item">Search Photographers</Link>
                    </>
                  )}
                  {currentUserRole === 'photographer' && (
                    <Link to="/dashboard" className="user-dropdown-item">My Dashboard</Link>
                  )}
                  <div className="user-dropdown-divider"></div>
                  <a href="#" className="user-dropdown-item" id="logout-menu-item" onClick={handleLogout}>
                    Log Out
                  </a>
                </div>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login / Sign Up
            </button>
          )}
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </nav>
  );
}
