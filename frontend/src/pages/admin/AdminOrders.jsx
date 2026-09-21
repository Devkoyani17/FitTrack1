import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, PackageCheck } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrdersAdmin();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatusAdmin(orderId, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching master order records..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={26} color="#06b6d4" /> Admin Order Fulfilment Portal
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Manage customer store orders, update shipping status, and verify payment states.</p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Order ID</th>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Date</th>
              <th style={{ padding: '0.75rem' }}>Total</th>
              <th style={{ padding: '0.75rem' }}>Payment</th>
              <th style={{ padding: '0.75rem' }}>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>#{o._id.slice(-8).toUpperCase()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600 }}>{o.user?.name || o.shippingAddress?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{o.shippingAddress?.city}, {o.shippingAddress?.phone}</div>
                </td>
                <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: '#10b981' }}>₹{o.totalPrice}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-emerald' : 'badge-amber'}`}>
                    {o.paymentMethod} ({o.paymentStatus})
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <select
                    className="form-select"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminOrders;
