import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Data Found',
  description = 'There are no items recorded in this view yet.',
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      background: 'rgba(17, 24, 39, 0.4)',
      border: '1px dashed rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      margin: '1rem 0'
    }}>
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        padding: '1rem',
        borderRadius: '50%',
        marginBottom: '1rem'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '400px', marginBottom: actionLabel ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
