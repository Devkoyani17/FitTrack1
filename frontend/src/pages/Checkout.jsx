import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { PackageCheck, ShieldCheck, Truck, CreditCard, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, summary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    if (items.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        orderItems: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
          image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''
        })),
        shippingAddress,
        paymentMethod
      };

      const res = await api.createOrder(orderData);
      if (res.success) {
        alert('Order placed successfully!');
        navigate(`/orders/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Securing stock & processing your order..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageCheck size={26} color="#10b981" /> Order Checkout
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Enter delivery address and confirm payment method.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* Left Form Column */}
        <form onSubmit={handlePlaceOrder} className="glass-panel">
          
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            1. Customer & Delivery Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Recipient Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={shippingAddress.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="+91 9876543210"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Flat / Building / Street area"
              value={shippingAddress.address}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={shippingAddress.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-input"
                value={shippingAddress.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                className="form-input"
                value={shippingAddress.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '1.5rem', marginBottom: '1rem' }}>
            2. Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: paymentMethod === 'Cash on Delivery' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <strong style={{ color: '#fff' }}>Cash on Delivery (COD)</strong>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pay cash when package is delivered to your doorstep</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: paymentMethod === 'Online Payment' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <strong style={{ color: '#fff' }}>Online Payment / UPI / Card</strong>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Simulated sandbox checkout for development</p>
              </div>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '2rem' }}>
            Confirm & Place Order
          </button>
        </form>

        {/* Right Summary Column */}
        <div>
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Order Products ({items.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <img src={item.product.images && item.product.images[0]} alt={item.product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{item.product.name}</div>
                    <div style={{ color: '#9ca3af' }}>{item.quantity} x ₹{item.product.discountPrice || item.product.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>Total</span>
              <span style={{ color: '#10b981' }}>₹{summary.totalPrice}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
