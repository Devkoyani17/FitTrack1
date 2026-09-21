import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.getWishlist();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (productId, isWishlisted) => {
    if (!isWishlisted) {
      setProducts(products.filter(p => p._id !== productId));
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your wishlist..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={26} color="#ef4444" fill="#ef4444" /> My Saved Wishlist
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Keep track of your favorite supplements and equipment.</p>
      </div>

      {products.length > 0 ? (
        <div className="grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} inWishlist={true} onWishlistToggle={handleWishlistToggle} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Click the heart icon on any store product card to save it for later."
          actionLabel="Explore FitTrack Store"
          onAction={() => window.location.href = '/store'}
        />
      )}

    </div>
  );
};

export default Wishlist;
