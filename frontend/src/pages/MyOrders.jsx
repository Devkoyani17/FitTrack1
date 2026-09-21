import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { PackageCheck, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching order status & tracking details..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageCheck size={26} color="#10b981" /> My Purchase Orders
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Track package delivery timeline and review order invoices.</p>
      </div>

      {orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel">
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                    Order ID: #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>₹{order.totalPrice}</span>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{order.paymentMethod}</div>
                </div>
              </div>

              {/* Order Timeline visualizer */}
              <OrderTimeline currentStatus={order.orderStatus} />

              {/* Items Preview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  {order.orderItems.length} product(s) ordered
                </span>

                <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                  View Order Details <ChevronRight size={16} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageCheck}
          title="No Orders Placed Yet"
          description="You haven't placed any supplement or gear orders yet."
          actionLabel="Visit FitTrack Store"
          onAction={() => window.location.href = '/store'}
        />
      )}

    </div>
  );
};

export default MyOrders;
