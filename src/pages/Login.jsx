import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/main.css';
import '../css/login.css';

export default function Login() {
  const { currentUserRole, login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUserRole) {
      if (currentUserRole === 'user') {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUserRole, navigate]);

  const selectRole = (role) => {
    setSelectedRole(role);
    setShowForm(true);

    if (role === 'user') {
      setEmail('customer@pickmyshoot.com');
      setPassword('password123');
    } else {
      setEmail('photographer@pickmyshoot.com');
      setPassword('password123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    login(selectedRole);
    // Redirect will be handled by the useEffect above
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src="/assets/logo.png" alt="pickmyshoot Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div className="login-subtitle">
          Find the perfect photographer for every moment or showcase your portfolio to receive premium customer leads.
        </div>
        
        {/* Role Selection Cards */}
        <div className="role-cards-wrapper">
          {/* User Card */}
          <div 
            className={`role-card ${selectedRole === 'user' ? 'active' : ''}`}
            id="user-role-card" 
            onClick={() => selectRole('user')}
          >
            <div className="role-icon">
              <i className="fa-solid fa-camera"></i>
            </div>
            <div className="role-title">Login as User</div>
            <div className="role-desc">
              Browse photographers, customize packages, compare prices and send booking inquiries.
            </div>
          </div>
          
          {/* Photographer Card */}
          <div 
            className={`role-card ${selectedRole === 'photographer' ? 'active' : ''}`}
            id="photographer-role-card" 
            onClick={() => selectRole('photographer')}
          >
            <div className="role-icon">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <div className="role-title">Login as Photographer</div>
            <div className="role-desc">
              List your studio, manage pricing catalogs, and receive direct customer leads.
            </div>
          </div>
        </div>
        
        {/* Login Form (Fades and slides in when a role is selected) */}
        <div className={`login-form-wrapper ${showForm ? 'show' : ''}`} id="login-form-wrapper">
          <h3 id="form-heading" style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 700 }}>
            {selectedRole === 'user' ? 'Login as Customer User' : 'Login as Professional Photographer'}
          </h3>
          <form id="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                className="form-input" 
                type="email" 
                id="email" 
                required 
                placeholder="e.g., example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                className="form-input" 
                type="password" 
                id="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary form-submit-btn">
              Log In <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
