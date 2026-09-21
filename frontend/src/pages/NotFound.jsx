import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.25rem', borderRadius: '50%', marginBottom: '1rem' }}>
        <AlertTriangle size={48} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>404 Not Found</h1>
      <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: '460px', marginBottom: '2rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary btn-lg">
        <Home size={18} /> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
