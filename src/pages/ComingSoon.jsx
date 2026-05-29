import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div className="static-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 115px - 340px)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="static-container" style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', color: 'var(--primary)', marginBottom: '24px' }}>
            <i className="fa-solid fa-rocket"></i>
          </div>
          <h1 className="static-title" style={{ fontSize: '36px', marginBottom: '16px' }}>Coming Soon</h1>
          <p style={{ fontSize: '16px', color: 'var(--dark-500)', lineHeight: '1.7', marginBottom: '32px' }}>
            We are working hard to bring you our advertising platform. Soon, photographers and studios will be able to promote their listings and boost their visibility on Pick My Shoot.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
