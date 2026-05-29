import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../context/supabase';
import EditProfileModal from '../components/EditProfileModal';
import '../css/main.css';

// Helper to map Supabase database fields (snake_case) to Frontend properties (camelCase)
const mapDbPhotographer = (dbRecord) => {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    rating: Number(dbRecord.rating),
    reviews: Number(dbRecord.reviews),
    experience: Number(dbRecord.experience),
    price: Number(dbRecord.price),
    location: dbRecord.location,
    city: dbRecord.city,
    categories: dbRecord.categories,
    image: dbRecord.image,
    gallery: dbRecord.gallery,
    avatarColor: dbRecord.avatar_color,
    avatarText: dbRecord.avatar_text,
    verified: dbRecord.verified,
    bestSeller: dbRecord.best_seller,
    isStudio: dbRecord.is_studio,
    bookedDates: dbRecord.booked_dates,
    about: dbRecord.about,
    bullets: dbRecord.bullets,
    packages: dbRecord.packages,
    languages: dbRecord.languages,
    travelOutsideCity: dbRecord.travel_outside_city,
    age: dbRecord.age,
    chargePerHour: dbRecord.charge_per_hour
  };
};

const mapFrontendToDbPhotographer = (fRecord) => {
  return {
    name: fRecord.name,
    rating: fRecord.rating,
    reviews: fRecord.reviews,
    experience: fRecord.experience,
    price: fRecord.price,
    location: fRecord.location,
    city: fRecord.city,
    categories: fRecord.categories,
    image: fRecord.image,
    gallery: fRecord.gallery,
    avatar_color: fRecord.avatarColor,
    avatar_text: fRecord.avatarText,
    verified: fRecord.verified,
    best_seller: fRecord.bestSeller,
    is_studio: fRecord.isStudio,
    booked_dates: fRecord.bookedDates,
    about: fRecord.about,
    bullets: fRecord.bullets,
    packages: fRecord.packages,
    languages: fRecord.languages,
    travel_outside_city: fRecord.travelOutsideCity,
    age: fRecord.age,
    charge_per_hour: fRecord.chargePerHour
  };
};

const mapDbLead = (dbRecord) => {
  return {
    photographerId: dbRecord.photographer_id,
    photographerName: dbRecord.photographer_name,
    clientName: dbRecord.client_name,
    clientPhone: dbRecord.client_phone,
    eventDate: dbRecord.event_date,
    eventType: dbRecord.event_type,
    message: dbRecord.message,
    timestamp: dbRecord.created_at
  };
};

export default function Dashboard() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [photographer, setPhotographer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dynamic photographer mapping matching AuthContext
  const getPhotographerId = () => {
    if (!currentUser) return 'the-wedding-story';
    if (currentUser.email === 'photographer@pickmyshoot.com') {
      return 'the-wedding-story';
    }
    return currentUser.email.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const loadLeads = async () => {
    try {
      const pId = getPhotographerId();
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('photographer_id', pId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error loading leads from Supabase:", error);
      } else if (data) {
        setLeads(data.map(mapDbLead));
      }
    } catch (err) {
      console.error("Error connecting to Supabase leads:", err);
    }
  };

  const loadPhotographer = async () => {
    try {
      const pId = getPhotographerId();
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .eq('id', pId)
        .single();
      
      if (error) {
        console.error("Error loading photographer profile from Supabase:", error);
      } else if (data) {
        setPhotographer(mapDbPhotographer(data));
      }
    } catch (err) {
      console.error("Error connecting to Supabase photographer:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadLeads();
      loadPhotographer();
    }
  }, [currentUser]);

  const handleClearLeads = async () => {
    if (!photographer) return;
    if (window.confirm("Are you sure you want to clear your inquiries from Supabase?")) {
      try {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('photographer_id', photographer.id);
        
        if (error) {
          console.error("Error clearing leads from Supabase:", error);
          alert("Failed to clear leads: " + error.message);
        } else {
          setLeads([]);
          alert("Your inquiries cleared successfully from Supabase!");
        }
      } catch (err) {
        console.error("Clear leads connection failed:", err);
      }
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
              <span className="stat-value">
                {photographer ? Math.round((photographer.reviews * 5.4) + 24).toLocaleString('en-IN') : '0'}
              </span>
              <span className="stat-label">Profile Views</span>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#ffb400' }}><i className="fa-solid fa-star"></i></div>
            <div className="stat-info">
              <span className="stat-value">
                {photographer ? photographer.rating.toFixed(1) : '0.0'}
              </span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f0f7ff', color: '#2196f3' }}><i className="fa-solid fa-calendar-days"></i></div>
            <div className="stat-info">
              <span className="stat-value">
                {photographer?.bookedDates ? photographer.bookedDates.length : 0}
              </span>
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
          onSave={async (updated) => {
            try {
              const dbPayload = mapFrontendToDbPhotographer(updated);
              const { error } = await supabase
                .from('photographers')
                .update(dbPayload)
                .eq('id', photographer.id);
              
              if (error) {
                console.error("Error updating photographer profile on Supabase:", error);
                alert("Failed to update profile: " + error.message);
              } else {
                setPhotographer({ ...updated });
                setIsEditModalOpen(false);
                alert("Profile details updated successfully on Supabase database!");
              }
            } catch (err) {
              console.error("Profile save connection failed:", err);
            }
          }}
        />
      )}
    </div>
  );
}
