import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PHOTOGRAPHERS, updatePhotographer } from '../data/database';
import EditProfileModal from '../components/EditProfileModal';
import '../css/main.css';

export default function Dashboard() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [photographer, setPhotographer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadLeads = () => {
    const storedLeads = localStorage.getItem('pickmyshoot_leads');
    setLeads(storedLeads ? JSON.parse(storedLeads) : []);
  };

  useEffect(() => {
    loadLeads();
    const p = PHOTOGRAPHERS.find(p => p.id === 'the-wedding-story');
    setPhotographer(p);
  }, []);

  const handleClearLeads = () => {
    if (window.confirm("Are you sure you want to clear all simulation leads?")) {
      localStorage.removeItem('pickmyshoot_leads');
      setLeads([]);
    }
  };

  const handleSwitchToUserView = () => {
    login('user');
    navigate('/');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-root">
      {/* Dashboard Specific Styles Injected into Head (matching static style tags) */}
      <style>{`
        .dashboard-container {
          margin-top: 40px;
          margin-bottom: 60px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .dashboard-title h2 {
          font-size: 26px;
          font-weight: 800;
        }
        
        .dashboard-title p {
          color: var(--dark-500);
          font-size: 14px;
          margin-top: 4px;
        }
        
        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .stat-card {
          background-color: var(--white);
          border: 1px solid var(--light-200);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-size: 22px;
          font-weight: 800;
          color: var(--dark-900);
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--dark-500);
          font-weight: 600;
          margin-top: 2px;
        }
        
        /* Content Sections */
        .dashboard-content-split {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 32px;
        }
        
        .dashboard-block {
          background-color: var(--white);
          border: 1px solid var(--light-200);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: var(--shadow-sm);
        }
        
        .block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1.5px solid var(--light-100);
          padding-bottom: 16px;
        }
        
        .block-title {
          font-size: 18px;
          font-weight: 800;
        }
        
        /* Leads List */
        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .lead-card {
          border: 1px solid var(--light-200);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          background-color: var(--light-50);
          position: relative;
        }
        
        .lead-badge {
          position: absolute;
          top: 16px;
          right: 20px;
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        
        .lead-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--dark-900);
          margin-bottom: 4px;
        }
        
        .lead-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: var(--dark-500);
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .lead-msg {
          font-size: 13px;
          color: var(--dark-700);
          background-color: var(--white);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--primary);
          line-height: 1.5;
        }
        
        .no-leads {
          text-align: center;
          padding: 40px 0;
          color: var(--dark-500);
          font-size: 14px;
        }
        
        .no-leads i {
          font-size: 36px;
          margin-bottom: 12px;
          color: var(--light-300);
        }
        
        /* Profile Teaser */
        .profile-teaser-info {
          text-align: center;
          padding: 20px 0;
        }
        
        .teaser-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-round);
          background-color: var(--dark-900);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 24px;
          margin: 0 auto 16px auto;
        }
        
        .teaser-name {
          font-size: 18px;
          font-weight: 800;
        }
        
        .teaser-location {
          font-size: 13px;
          color: var(--dark-500);
          margin-top: 4px;
          font-weight: 600;
        }
        
        .teaser-desc {
          font-size: 13px;
          color: var(--dark-700);
          margin: 16px 0 24px 0;
          line-height: 1.5;
        }
        
        @media (max-width: 991px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-content-split {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 560px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Dashboard Container */}
      <section className="container dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>Dashboard Overview</h2>
            <p>Manage your studio listings, track incoming customer leads and optimize pricing catalogs.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={handleSwitchToUserView}>
              <i className="fa-solid fa-eye"></i> Switch to User View
            </button>
            <button className="btn btn-outline-primary" onClick={handleLogoutClick}>
              <i className="fa-solid fa-right-from-bracket"></i> Log Out
            </button>
          </div>
        </div>
        
        {/* Stats Cards Row */}
        <div className="stats-grid">
          {/* Card 1 */}
          <div className="stat-card">
            <div className="stat-icon"><i className="fa-solid fa-bullseye"></i></div>
            <div className="stat-info">
              <span className="stat-value" id="leads-count-val">{leads.length}</span>
              <span className="stat-label">Total Leads</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e8faf0', color: '#25d366' }}><i className="fa-solid fa-eye"></i></div>
            <div className="stat-info">
              <span className="stat-value">1,420</span>
              <span className="stat-label">Profile Views</span>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#ffb400' }}><i className="fa-solid fa-star"></i></div>
            <div className="stat-info">
              <span className="stat-value">4.9</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f0f7ff', color: '#2196f3' }}><i className="fa-solid fa-calendar-days"></i></div>
            <div className="stat-info">
              <span className="stat-value">18</span>
              <span className="stat-label">Active Bookings</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard Core Split */}
        <div className="dashboard-content-split">
          {/* Left Column: Inquiries / Leads */}
          <div className="dashboard-block">
            <div className="block-header">
              <h3 className="block-title">Customer Inquiries</h3>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleClearLeads}>
                Clear Leads
              </button>
            </div>
            
            <div className="leads-list" id="dashboard-leads-container">
              {leads.map((l, i) => {
                const formattedDate = new Date(l.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const submittedTime = new Date(l.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short'
                }) + " " + new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={i} className="lead-card">
                    <span className="lead-badge">{l.eventType}</span>
                    <h4 className="lead-name">{l.clientName}</h4>
                    <div className="lead-meta">
                      <span><i className="fa-solid fa-phone"></i> {l.clientPhone}</span>
                      <span><i className="fa-solid fa-calendar-day"></i> Event: {formattedDate}</span>
                      <span><i className="fa-solid fa-clock"></i> Recd: {submittedTime}</span>
                    </div>
                    <p className="lead-msg"><strong>Message Details:</strong><br />{l.message || 'No additional details provided.'}</p>
                  </div>
                );
              })}

              {leads.length === 0 && (
                <div className="no-leads">
                  <i className="fa-solid fa-inbox"></i>
                  <p>No customer inquiries received yet.</p>
                  <p style={{ fontSize: '11px', marginTop: '6px' }}>Submit an inquiry from a photographer's profile page as a User, then log back in here to see it!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Profile Summary Teaser */}
          <div className="dashboard-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
            <div className="block-header">
              <h3 className="block-title">My Studio Profile</h3>
            </div>
            
            <div className="profile-teaser-info">
              <div className="teaser-avatar" id="teaser-logo" style={{ backgroundColor: photographer?.avatarColor || '#000000' }}>
                {photographer?.avatarText || 'TWS'}
              </div>
              <h4 className="teaser-name" id="teaser-studio-name">{photographer?.name || 'The Wedding Story'}</h4>
              <p className="teaser-location" id="teaser-studio-loc">
                <i className="fa-solid fa-location-dot"></i> {photographer?.location || 'Banjara Hills'}, {photographer?.city || 'Hyderabad'}
              </p>
              <p className="teaser-desc" id="teaser-studio-desc">
                {photographer?.about || 'We are a team of passionate photographers who believe in capturing real emotions and candid moments.'}
              </p>
              
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsEditModalOpen(true)}>
                Edit Catalog Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {photographer && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          photographer={photographer}
          onSave={(updated) => {
            updatePhotographer(updated);
            setPhotographer({ ...updated });
          }}
        />
      )}
    </div>
  );
}
