import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Sparkles,
  Utensils,
  Droplets,
  Scale,
  Target,
  ShoppingBag,
  PackageCheck,
  Heart,
  User,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workouts', label: 'Workouts', icon: Dumbbell },
    { to: '/exercises', label: 'Exercises', icon: Sparkles },
    { to: '/meals', label: 'Nutrition', icon: Utensils },
    { to: '/water', label: 'Water Tracker', icon: Droplets },
    { to: '/weight', label: 'Weight Progress', icon: Scale },
    { to: '/goals', label: 'Fitness Goals', icon: Target },
    { to: '/store', label: 'FitTrack Store', icon: ShoppingBag },
    { to: '/orders', label: 'My Orders', icon: PackageCheck },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/profile', label: 'Profile Settings', icon: User }
  ];

  if (isAdmin) {
    links.push(
      { to: '/admin/products', label: 'Admin Products', icon: ShieldCheck },
      { to: '/admin/orders', label: 'Admin Orders', icon: ShieldCheck }
    );
  }

  return (
    <aside style={{
      width: '240px',
      background: '#111827',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      minHeight: 'calc(100vh - 70px)',
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem'
    }}>
      <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation Menu
        </span>
      </div>

      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#fff' : '#9ca3af',
              background: isActive
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)'
                : 'transparent',
              borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <Icon size={18} />
            {link.label}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
