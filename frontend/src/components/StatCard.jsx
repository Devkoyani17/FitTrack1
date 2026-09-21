import React from 'react';

const StatCard = ({ title, value, unit = '', icon: Icon, trend, color = '#10b981', subtitle }) => {
  return (
    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>{title}</span>
        {Icon && (
          <div style={{
            background: `${color}20`,
            color: color,
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{value}</span>
        {unit && <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#9ca3af' }}>{unit}</span>}
      </div>

      {subtitle && <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>{subtitle}</p>}
      {trend && (
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: trend.startsWith('+') ? '#10b981' : '#ef4444',
          marginTop: '0.3rem',
          display: 'inline-block'
        }}>
          {trend}
        </span>
      )}
    </div>
  );
};

export default StatCard;
