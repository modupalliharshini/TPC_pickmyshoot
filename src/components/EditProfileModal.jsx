import React, { useState, useEffect } from 'react';

export default function EditProfileModal({ isOpen, onClose, photographer, onSave }) {
  if (!isOpen || !photographer) return null;

  const [name, setName] = useState(photographer.name || '');
  const [location, setLocation] = useState(photographer.location || '');
  const [city, setCity] = useState(photographer.city || '');
  const [price, setPrice] = useState(photographer.price || 0);
  const [experience, setExperience] = useState(photographer.experience || 0);
  const [about, setAbout] = useState(photographer.about || '');
  const [categoriesStr, setCategoriesStr] = useState(
    photographer.categories ? photographer.categories.join(', ') : ''
  );
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Keep state in sync with photographer prop when it changes
  useEffect(() => {
    setName(photographer.name || '');
    setLocation(photographer.location || '');
    setCity(photographer.city || '');
    setPrice(photographer.price || 0);
    setExperience(photographer.experience || 0);
    setAbout(photographer.about || '');
    setCategoriesStr(photographer.categories ? photographer.categories.join(', ') : '');
  }, [photographer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      // Split the categories string into an array, trimmed
      const categoriesArray = categoriesStr
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      // Generate dynamic avatar text from the first letters
      const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);

      const updatedPhotographer = {
        ...photographer,
        name,
        location,
        city,
        price: Number(price),
        experience: Number(experience),
        about,
        categories: categoriesArray,
        avatarText: initials || photographer.avatarText
      };

      onSave(updatedPhotographer);
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close edit profile modal">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 id="edit-profile-heading" style={{ fontSize: '20px', marginBottom: '8px' }}>
          Edit Catalog Profile
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--dark-500)', marginBottom: '24px' }}>
          Update your studio description, packages pricing, and basic details displayed on your profile.
        </p>

        <form id="edit-profile-form" onSubmit={handleSubmit}>
          {/* Studio Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="studio-name">Studio / Photographer Name</label>
            <input
              type="text"
              className="form-input"
              id="studio-name"
              required
              placeholder="e.g., The Wedding Story"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            {/* Location Area */}
            <div className="form-group">
              <label className="form-label" htmlFor="studio-location">Area / Neighborhood</label>
              <input
                type="text"
                className="form-input"
                id="studio-location"
                required
                placeholder="e.g., Banjara Hills"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label" htmlFor="studio-city">City</label>
              <input
                type="text"
                className="form-input"
                id="studio-city"
                required
                placeholder="e.g., Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            {/* Price */}
            <div className="form-group">
              <label className="form-label" htmlFor="studio-price">Starting Price (₹)</label>
              <input
                type="number"
                className="form-input"
                id="studio-price"
                required
                min="0"
                placeholder="e.g., 25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label" htmlFor="studio-exp">Experience (Years)</label>
              <input
                type="number"
                className="form-input"
                id="studio-exp"
                required
                min="0"
                placeholder="e.g., 8"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="form-group">
            <label className="form-label" htmlFor="studio-categories">Categories (Comma separated)</label>
            <input
              type="text"
              className="form-input"
              id="studio-categories"
              required
              placeholder="e.g., Wedding Photography, Pre Wedding Shoot, Candid Photography"
              value={categoriesStr}
              onChange={(e) => setCategoriesStr(e.target.value)}
            />
          </div>

          {/* About */}
          <div className="form-group">
            <label className="form-label" htmlFor="studio-about">About Studio / Description</label>
            <textarea
              className="form-input"
              id="studio-about"
              rows="4"
              required
              placeholder="Describe your studio history, photo styles, equipment, etc..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit-btn"
              style={{ flex: 2, margin: 0, backgroundColor: success ? '#25d366' : '' }}
              disabled={submitting || success}
            >
              {submitting && <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</>}
              {success && <><i className="fa-solid fa-circle-check"></i> Changes Saved!</>}
              {!submitting && !success && 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
