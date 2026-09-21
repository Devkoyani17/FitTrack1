import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Activity,
  Dumbbell,
  Utensils,
  Droplets,
  Scale,
  Target,
  ShoppingBag,
  Heart,
  PackageCheck,
  User,
  LogOut,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: Activity },
        { path: '/workouts', label: 'Workouts', icon: Dumbbell },
        { path: '/exercises', label: 'Exercises', icon: Dumbbell },
        { path: '/meals', label: 'Nutrition', icon: Utensils },
        { path: '/water', label: 'Water', icon: Droplets },
        { path: '/weight', label: 'Weight', icon: Scale },
        { path: '/goals', label: 'Goals', icon: Target },
        { path: '/store', label: 'Store', icon: ShoppingBag },
        { path: '/orders', label: 'Orders', icon: PackageCheck }
      ]
    : [
        { path: '/', label: 'Home', icon: Activity },
        { path: '/store', label: 'Store', icon: ShoppingBag }
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
          }}>
            <Activity size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              FIT<span style={{ color: '#10b981' }}>TRACK</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#10b981' : '#9ca3af',
                  background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {/* Wishlist Icon if Auth */}
          {isAuthenticated && (
            <Link to="/wishlist" style={{ position: 'relative', padding: '0.5rem', color: '#9ca3af', borderRadius: '8px' }} title="Wishlist">
              <Heart size={20} />
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', padding: '0.5rem', color: '#9ca3af', borderRadius: '8px' }} title="Shopping Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#10b981',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {/* Admin Dashboard Quick Link */}
          {isAdmin && (
            <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
              <ShieldAlert size={15} />
              Admin
            </Link>
          )}

          {/* Auth Menu */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.65rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
                <User size={16} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem', background: '#111827', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    color: isActive(item.path) ? '#10b981' : '#9ca3af',
                    background: isActive(item.path) ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
