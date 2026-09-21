import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ShoppingBag, Search, Filter, Sparkles, Tag } from 'lucide-react';

const categoriesList = [
  'All Products',
  'Protein Supplements',
  'Vitamins & Supplements',
  'Pre-Workout',
  'Creatine',
  'Protein Bars',
  'Healthy Foods',
  'Gym Equipment',
  'Workout Accessories',
  'Shakers & Bottles',
  'Fitness Wear',
  'Yoga Products',
  'Recovery Products'
];

const StoreHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All Products') params.category = category;
      if (sortBy) params.sortBy = sortBy;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.getProducts(params);
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
    fetchProducts();
  }, [category, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      
      {/* Store Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> Official FitTrack Store
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Fuel Your Fitness Journey
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          100% Authentic Supplements, High Performance Gym Gear, and Nutrition Products.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', background: '#0b0f19' }}
              placeholder="Search whey, creatine, dumbbells, shakers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Category Pills Bar */}
      <div>
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categoriesList.map((cat) => {
            const selected = (category === '' && cat === 'All Products') || category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All Products' ? '' : cat)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: selected ? 700 : 500,
                  color: selected ? '#fff' : '#9ca3af',
                  background: selected ? '#10b981' : '#1f2937',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Showing <strong style={{ color: '#fff' }}>{products.length}</strong> product(s)
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Sort By:</span>
          <select
            className="form-select"
            style={{ width: '180px', padding: '0.45rem 0.75rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching products from store database..." />
      ) : products.length > 0 ? (
        <div className="grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Products Match Your Search"
          description="Try resetting category filters or search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('');
            setSortBy('newest');
            fetchProducts();
          }}
        />
      )}

    </div>
  );
};

export default StoreHome;
