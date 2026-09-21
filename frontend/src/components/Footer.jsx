import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0b0f19',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3rem 0 2rem 0',
      color: '#9ca3af',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Activity size={22} color="#10b981" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                FIT<span style={{ color: '#10b981' }}>TRACK</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#6b7280' }}>
              "Track. Train. Transform. Shop." <br />
              All-in-one full-stack fitness management system & nutrition e-commerce platform.
            </p>
          </div>

          {/* Column 2: Fitness Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Fitness Tracking</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="/workouts" style={{ color: '#9ca3af' }}>Workouts</a></li>
              <li><a href="/exercises" style={{ color: '#9ca3af' }}>Exercise Library</a></li>
              <li><a href="/meals" style={{ color: '#9ca3af' }}>Nutrition Logs</a></li>
              <li><a href="/water" style={{ color: '#9ca3af' }}>Water Tracker</a></li>
              <li><a href="/weight" style={{ color: '#9ca3af' }}>Weight History</a></li>
            </ul>
          </div>

          {/* Column 3: Store Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>FitTrack Store</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="/store" style={{ color: '#9ca3af' }}>Store Home</a></li>
              <li><a href="/store?category=Protein%20Supplements" style={{ color: '#9ca3af' }}>Protein Supplements</a></li>
              <li><a href="/store?category=Pre-Workout" style={{ color: '#9ca3af' }}>Pre-Workouts</a></li>
              <li><a href="/store?category=Gym%20Equipment" style={{ color: '#9ca3af' }}>Gym Equipment</a></li>
              <li><a href="/cart" style={{ color: '#9ca3af' }}>Cart & Checkout</a></li>
            </ul>
          </div>

          {/* Column 4: Security & Guarantee */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Guarantees</h4>
            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
              🔒 100% Authentic Supplements <br />
              🚚 Fast Express Shipping <br />
              💵 Cash on Delivery Available <br />
              🛡️ Verified User Data Isolation
            </p>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <p>© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
          <p style={{ color: '#6b7280' }}>Built with MongoDB, Express, React, and Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
