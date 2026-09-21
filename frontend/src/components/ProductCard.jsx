import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const ProductCard = ({ product, inWishlist = false, onWishlistToggle }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(inWishlist);

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await api.removeFromWishlist(product._id);
        setIsWishlisted(false);
      } else {
        await api.addToWishlist(product._id);
        setIsWishlisted(true);
      }
      if (onWishlistToggle) onWishlistToggle(product._id, !isWishlisted);
    } catch (err) {
      alert('Please login to save items to wishlist');
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1rem',
      position: 'relative'
    }}>
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '1.25rem',
        left: '1.25rem',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem'
      }}>
        {hasDiscount && (
          <span className="badge badge-emerald">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 2,
          background: 'rgba(17, 24, 39, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isWishlisted ? '#ef4444' : '#9ca3af',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}
        title="Add to Wishlist"
      >
        <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
      </button>

      {/* Product Image */}
      <Link to={`/store/product/${product._id}`} style={{ display: 'block', marginBottom: '1rem', overflow: 'hidden', borderRadius: '12px' }}>
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'}
          alt={product.name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '12px',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Product Details */}
      <div>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
          {product.brand}
        </span>
        <Link to={`/store/product/${product._id}`}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            marginTop: '0.2rem',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
            height: '2.6em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </h4>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{product.rating || 4.5}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({product.numReviews || 0})</span>
        </div>

        {/* Price & Cart button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div>
            {hasDiscount ? (
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>₹{product.discountPrice}</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>₹{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="btn btn-primary btn-sm"
          >
            <ShoppingBag size={15} />
            {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
