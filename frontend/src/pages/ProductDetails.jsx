import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Heart, Plus, Minus, MessageSquare } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [pRes, rRes] = await Promise.all([
        api.getProductById(id),
        api.getProductReviews(id)
      ]);
      if (pRes.success) setProduct(pRes.data);
      if (rRes.success) setReviews(rRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      alert('Product added to cart!');
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (err) {
      alert(err.message || 'Failed to proceed to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage('');
    try {
      setSubmittingReview(true);
      const res = await api.addProductReview(id, { rating: newRating, comment: newComment });
      if (res.success) {
        setReviewMessage('Review submitted successfully!');
        setNewComment('');
        fetchProductDetails();
      }
    } catch (err) {
      setReviewMessage(`Error: ${err.message || 'Only verified buyers can leave a review'}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product information..." />;
  if (error || !product) return <div style={{ color: '#ef4444', padding: '2rem' }}>Product not found.</div>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
      
      {/* Product Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Left Column: Image */}
        <div>
          <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'}
              alt={product.name}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
        </div>

        {/* Right Column: Information & Buying Actions */}
        <div>
          <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand} • {product.category}
          </span>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.3rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  color="#f59e0b"
                  fill={star <= Math.round(product.rating || 5) ? '#f59e0b' : 'none'}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, color: '#fff' }}>{product.rating || 4.5}</span>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>({product.numReviews} ratings)</span>
          </div>

          {/* Pricing Banner */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            {hasDiscount ? (
              <>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>₹{product.discountPrice}</span>
                <span style={{ fontSize: '1.2rem', color: '#6b7280', textDecoration: 'line-through' }}>₹{product.price}</span>
                <span className="badge badge-emerald">{discountPercent}% OFF</span>
              </>
            ) : (
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>₹{product.price}</span>
            )}
          </div>

          <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Specs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {product.weight && (
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#9ca3af' }}>Weight:</span> <strong style={{ color: '#fff' }}>{product.weight}</strong>
              </div>
            )}
            {product.flavor && (
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#9ca3af' }}>Flavor:</span> <strong style={{ color: '#fff' }}>{product.flavor}</strong>
              </div>
            )}
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#9ca3af' }}>Stock:</span>{' '}
              <strong style={{ color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
              </strong>
            </div>
          </div>

          {/* Quantity selector & Actions */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#1f2937', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.6rem 0.8rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ padding: '0 1rem', fontWeight: 800, color: '#fff' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ padding: '0.6rem 0.8rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg">
                <ShoppingBag size={20} /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>

              <button onClick={handleBuyNow} className="btn btn-cyan btn-lg">
                Buy Now
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#9ca3af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={16} color="#10b981" /> 100% Authentic</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Truck size={16} color="#06b6d4" /> Express Shipping</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><RotateCcw size={16} color="#f59e0b" /> Easy Returns</div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={22} color="#10b981" /> Customer Reviews & Ratings ({reviews.length})
        </h3>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Leave a Customer Review</h4>
          
          {reviewMessage && (
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: reviewMessage.startsWith('Error') ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: reviewMessage.startsWith('Error') ? '#ef4444' : '#10b981', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {reviewMessage}
            </div>
          )}

          <div className="form-group" style={{ maxWidth: '200px' }}>
            <label className="form-label">Rating</label>
            <select className="form-select" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/5)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your Review Comment *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Share your experience with this supplement or equipment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submittingReview} className="btn btn-primary btn-sm">
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((r) => (
              <div key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{r.user?.name || 'Verified Buyer'}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} color="#f59e0b" fill={s <= r.rating ? '#f59e0b' : 'none'} />
                  ))}
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No reviews submitted yet for this product.</p>
        )}

      </div>

    </div>
  );
};

export default ProductDetails;
