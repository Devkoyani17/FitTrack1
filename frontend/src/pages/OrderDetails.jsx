import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import { PackageCheck, ArrowLeft, Truck, CreditCard, ShieldAlert } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setCancelling(true);
        const res = await api.cancelOrder(id);
        if (res.success) {
          alert('Order cancelled.');
          fetchOrder();
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel order');
      } finally {
        setCancelling(false);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching order invoice details..." />;
  if (!order) return <div style={{ color: '#ef4444', padding: '2rem' }}>Order not found.</div>;

  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to My Orders
        </Link>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Order ID: #{order._id.toUpperCase()}</span>
      </div>

      {/* Visual Timeline Tracker */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Order Delivery Status</h3>
        <OrderTimeline currentStatus={order.orderStatus} />
      </div>

      {/* Order Products List */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Ordered Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.orderItems.map((item) => (
            <div key={item.product} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.image || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                </div>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel">
          <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={18} color="#06b6d4" /> Shipping Address
          </h4>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>{order.shippingAddress.name}</strong> <br />
            {order.shippingAddress.address} <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode} <br />
            Phone: {order.shippingAddress.phone}
          </p>
        </div>

        <div className="glass-panel">
          <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CreditCard size={18} color="#10b981" /> Payment Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: '#9ca3af' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span style={{ color: '#fff' }}>₹{order.subtotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping:</span><span style={{ color: '#fff' }}>₹{order.shippingPrice}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>
              <span>Total Paid:</span><span>₹{order.totalPrice}</span>
            </div>
            <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Method: {order.paymentMethod} ({order.paymentStatus})
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Action if Eligible */}
      {canCancel && (
        <div style={{ textAlign: 'right' }}>
          <button onClick={handleCancelOrder} disabled={cancelling} className="btn btn-danger btn-sm">
            {cancelling ? 'Cancelling Order...' : 'Cancel Order'}
          </button>
        </div>
      )}

    </div>
  );
};

export default OrderDetails;
