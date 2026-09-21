import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, ShoppingBag, PackageCheck, AlertTriangle, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminStoreStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating store analytics & inventory alerts..." />;

  const { totalProducts, totalOrders, pendingOrders, deliveredOrders, totalSales, totalCustomers, lowStockProducts, recentOrders } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={26} color="#f59e0b" /> FitTrack Store Admin Portal
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Store revenue analytics, product inventory, and customer order fulfilment.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid-cols-4">
        <StatCard title="Total Revenue" value={`₹${totalSales}`} icon={DollarSign} color="#10b981" />
        <StatCard title="Total Orders" value={totalOrders} icon={PackageCheck} color="#06b6d4" subtitle={`${pendingOrders} Pending`} />
        <StatCard title="Active Products" value={totalProducts} icon={ShoppingBag} color="#f59e0b" />
        <StatCard title="Registered Customers" value={totalCustomers} icon={Users} color="#3b82f6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Low Stock Alerts */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#f59e0b" /> Low Stock Inventory Alerts (&lt; 10 units)
          </h3>
          {lowStockProducts && lowStockProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStockProducts.map((p) => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{p.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '0.5rem' }}>({p.category})</span>
                  </div>
                  <span className="badge badge-amber">{p.stock} units left</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>All active product inventories are healthy!</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackageCheck size={18} color="#06b6d4" /> Recent Customer Orders
          </h3>
          {recentOrders && recentOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentOrders.map((o) => (
                <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{o.user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>₹{o.totalPrice} • {new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge ${o.orderStatus === 'Delivered' ? 'badge-emerald' : 'badge-cyan'}`}>{o.orderStatus}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No recent orders.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
