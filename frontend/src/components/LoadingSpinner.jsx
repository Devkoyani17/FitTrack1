import React from 'react';
import { Activity } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        color: '#10b981'
      }}>
        <Activity size={36} />
      </div>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0b0f19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
