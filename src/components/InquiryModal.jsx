import React, { useState } from 'react';
import { supabase } from '../context/supabase';

export default function InquiryModal({ isOpen, onClose, photographer }) {
  if (!isOpen || !photographer) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Wedding Photography');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          photographer_id: photographer.id,
          photographer_name: photographer.name,
          client_name: name,
          client_phone: phone,
          event_date: date,
          event_type: category,
          message: message
        }]);

      if (error) {
        console.error("Error inserting lead:", error);
        alert("Failed to submit inquiry: " + error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          // Reset and close
          setName('');
          setPhone('');
          setDate('');
          setCategory('Wedding Photography');
          setMessage('');
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed. Please check network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close inquiry modal">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 id="inquiry-modal-heading" style={{ fontSize: '20px', marginBottom: '8px' }}>
          Send Inquiry to {photographer.name}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--dark-500)', marginBottom: '24px' }}>
          Please fill in your details. The photographer will contact you within 24 hours.
        </p>
        
        <form id="inquiry-form" onSubmit={handleSubmit}>
          {/* Client Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="client-name">Your Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              id="client-name" 
              required 
              placeholder="e.g., Harish Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          {/* Phone number */}
          <div className="form-group">
            <label className="form-label" htmlFor="client-phone">Phone Number</label>
            <input 
              type="tel" 
              className="form-input" 
              id="client-phone" 
              required 
              placeholder="e.g., +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-row">
            {/* Event Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="event-date">Event Date</label>
              <input 
                type="date" 
                className="form-input" 
                id="event-date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            {/* Shoot Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="event-type">Event Category</label>
              <select 
                className="form-input" 
                id="event-type" 
                style={{ cursor: 'pointer' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Wedding Photography">Wedding Photography</option>
                <option value="Pre Wedding Shoot">Pre Wedding Shoot</option>
                <option value="Maternity Shoot">Maternity Shoot</option>
                <option value="Baby Shoot">Baby Shoot</option>
                <option value="Candid Photography">Candid Photography</option>
                <option value="Product Photography">Product Photography</option>
              </select>
            </div>
          </div>
          
          {/* Message */}
          <div className="form-group">
            <label className="form-label" htmlFor="client-msg">Details / Message</label>
            <textarea 
              className="form-input" 
              id="client-msg" 
              rows="3" 
              placeholder="Describe your shoot timeline, location venue, or custom package queries..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary form-submit-btn" 
            style={{ width: '100%', backgroundColor: success ? '#25d366' : '' }}
            disabled={submitting || success}
          >
            {submitting && <><i className="fa-solid fa-circle-notch fa-spin"></i> Submitting...</>}
            {success && <><i className="fa-solid fa-circle-check"></i> Inquiry Sent Successfully!</>}
            {!submitting && !success && 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
