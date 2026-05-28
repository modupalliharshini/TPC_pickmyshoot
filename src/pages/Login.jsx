import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/main.css';
import '../css/login.css';

export default function Login() {
  const { currentUserRole, login, signUp } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSignUpMode(false);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUpMode) {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your full name.");
          setLoading(false);
          return;
        }
        const res = await signUp(fullName, email, password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.message);
        } else if (res.message) {
          // Registration succeeded but requires email verification
          setSuccessMsg(res.message);
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src="/assets/logo_white.png" alt="pickmyshoot Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
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
          {/* Sub-tabs Selector for Log In vs Create Account */}
          <div style={{ 
            display: 'flex', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '4px', 
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button 
              type="button" 
              style={{ 
                flex: 1, 
                border: 'none', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 700, 
                background: !isSignUpMode ? '#ffffff' : 'transparent', 
                color: !isSignUpMode ? 'var(--primary)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: !isSignUpMode ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => {
                setIsSignUpMode(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            >
              <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '6px' }}></i> Log In
            </button>
            <button 
              type="button" 
              style={{ 
                flex: 1, 
                border: 'none', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 700, 
                background: isSignUpMode ? '#ffffff' : 'transparent', 
                color: isSignUpMode ? 'var(--primary)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isSignUpMode ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => {
                setIsSignUpMode(true);
                setErrorMsg(null);
                setSuccessMsg(null);
                setFullName('');
              }}
            >
              <i className="fa-solid fa-user-plus" style={{ marginRight: '6px' }}></i> Create Account
            </button>
          </div>

          {successMsg ? (
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              padding: '32px 24px', 
              borderRadius: '12px', 
              marginTop: '16px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(255, 255, 255, 0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 20px auto',
                fontSize: '28px',
                color: '#ffffff'
              }}>
                <i className="fa-solid fa-envelope-circle-check"></i>
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Verify Your Email</h4>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6', marginBottom: '24px' }}>
                {successMsg}
              </p>
              <button 
                type="button" 
                className="btn btn-secondary"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => {
                  setSuccessMsg(null);
                  setIsSignUpMode(false);
                }}
              >
                <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Return to Login
              </button>
            </div>
          ) : (
            <>
              <h3 id="form-heading" style={{ fontSize: '18px', marginBottom: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' }}>
                {isSignUpMode 
                  ? (selectedRole === 'user' ? 'Register Customer Account' : 'Register Professional Studio')
                  : (selectedRole === 'user' ? 'Login as Customer User' : 'Login as Professional Photographer')
                }
              </h3>

              {/* Dynamic Error Alerts */}
              {errorMsg && (
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                  borderLeft: '4px solid #fff', 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  marginBottom: '20px', 
                  fontSize: '13px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: 600 }}>⚠️ {errorMsg}</span>
                  {errorMsg.includes("Account not found") && (
                    <button 
                      type="button" 
                      style={{ 
                        background: '#ffffff', 
                        color: 'var(--primary)', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        setIsSignUpMode(true);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        setFullName('');
                      }}
                    >
                      Create Account Now
                    </button>
                  )}
                </div>
              )}

              <form id="login-form" onSubmit={handleLoginSubmit}>
                {/* Dynamic Full Name Input */}
                {isSignUpMode && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name / Brand Name</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      id="fullName" 
                      required 
                      placeholder="e.g., Harish Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )}

                {/* Email Field */}
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
                
                {/* Password Field */}
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
                
                <button type="submit" className="btn btn-secondary form-submit-btn" disabled={loading} style={{ width: '100%' }}>
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                  ) : (
                    isSignUpMode ? 'Register & Sign In' : 'Log In'
                  )}
                  {!loading && <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>}
                </button>

                {/* Mode Switch Toggle */}
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                  {isSignUpMode ? (
                    <span>
                      Already have an account?{' '}
                      <span 
                        style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => {
                          setIsSignUpMode(false);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                      >
                        Log In here
                      </span>
                    </span>
                  ) : (
                    <span>
                      Don't have an account?{' '}
                      <span 
                        style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => {
                          setIsSignUpMode(true);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                          setFullName('');
                        }}
                      >
                        Sign Up here
                      </span>
                    </span>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
