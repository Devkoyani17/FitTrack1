import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

const Cart = () => {
  const { cart, summary, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner message="Updating shopping cart items..." />;

  const items = cart?.items || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={26} color="#10b981" /> Shopping Cart
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Review your selected fitness supplements and equipment.</p>
      </div>

      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          
          {/* Cart Items List */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Item Details</span>
              <button onClick={clearCart} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer' }}>
                Clear Cart
              </button>
            </div>

            {items.map((item) => {
              const p = item.product;
              if (!p) return null;

              const price = p.discountPrice > 0 ? p.discountPrice : p.price;

              return (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '220px' }}>
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'}
                      alt={p.name}
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <div>
                      <Link to={`/store/product/${p._id}`} style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                        {p.name}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                        Brand: {p.brand}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>
                        ₹{price}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#1f2937', borderRadius: '8px' }}>
                    <button
                      onClick={() => updateQuantity(p._id, item.quantity - 1)}
                      style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 0.75rem', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(p._id, item.quantity + 1)}
                      style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                      ₹{price * item.quantity}
                    </span>
                    <button onClick={() => removeFromCart(p._id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Order Summary Column */}
          <div>
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹{summary.subtotal}</span>
                </div>
                {summary.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Store Discount</span>
                    <span>- ₹{summary.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Shipping</span>
                  <span style={{ color: summary.totalPrice > 1500 ? '#10b981' : '#fff' }}>
                    {summary.totalPrice > 1500 ? 'FREE' : '₹99'}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Total Amount</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>₹{summary.totalPrice}</span>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%' }}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <Link to="/store" style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600 }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore our store catalog to add supplements, gym equipment, or shaker bottles."
          actionLabel="Go to FitTrack Store"
          onAction={() => navigate('/store')}
        />
      )}

    </div>
  );
};

export default Cart;
