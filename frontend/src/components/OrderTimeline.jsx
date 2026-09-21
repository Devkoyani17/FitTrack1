import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

const steps = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Processing', label: 'Processing', icon: Clock },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck }
];

const OrderTimeline = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#ef4444'
      }}>
        <AlertCircle size={22} />
        <span style={{ fontWeight: 700 }}>This order has been cancelled.</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Progress connecting line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '5%',
          right: '5%',
          height: '4px',
          background: '#374151',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '5%',
          width: `${(activeIndex / (steps.length - 1)) * 90}%`,
          height: '4px',
          background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
          zIndex: 1,
          transition: 'width 0.4s ease'
        }} />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isCompleted ? '#10b981' : '#1f2937',
                color: isCompleted ? '#fff' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isCurrent ? '3px solid #06b6d4' : '2px solid rgba(255,255,255,0.1)',
                boxShadow: isCurrent ? '0 0 16px rgba(6, 182, 212, 0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <Icon size={20} />
              </div>
              <span style={{
                marginTop: '0.6rem',
                fontSize: '0.8rem',
                fontWeight: isCompleted ? 700 : 500,
                color: isCompleted ? '#fff' : '#6b7280'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
