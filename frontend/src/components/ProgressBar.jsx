import React from 'react';

const ProgressBar = ({ progress = 0, color = '#10b981', height = '8px', showLabel = true }) => {
  const percentage = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ color: '#9ca3af' }}>Progress</span>
          <span style={{ color: '#fff' }}>{percentage}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height,
        background: '#1f2937',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '9999px',
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
