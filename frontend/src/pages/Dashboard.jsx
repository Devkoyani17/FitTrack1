import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Flame,
  Utensils,
  Clock,
  Droplets,
  Scale,
  Dumbbell,
  Target,
  ShoppingBag,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating fitness metrics & store updates..." />;
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>Error: {error}</div>;

  const { user, today, workouts, nutrition, weight, goals, recommendedProducts } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user.fitnessGoal} Focus
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
            Welcome back, {user.name.split(' ')[0]}! 💪
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Here is your daily health, training, and nutrition breakdown for today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/workouts" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Log Workout
          </Link>
          <Link to="/meals" className="btn btn-cyan btn-sm">
            <PlusCircle size={16} /> Log Meal
          </Link>
        </div>
      </div>

      {/* TODAY SUMMARY STATS */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#10b981" /> Today's Summary
        </h2>

        <div className="grid-cols-4">
          <StatCard
            title="Calories Burned"
            value={today.caloriesBurned}
            unit="kcal"
            icon={Flame}
            color="#ef4444"
            subtitle="Target: ~500 kcal"
          />
          <StatCard
            title="Calories Consumed"
            value={today.caloriesConsumed}
            unit="kcal"
            icon={Utensils}
            color="#06b6d4"
            subtitle="Target: ~2200 kcal"
          />
          <StatCard
            title="Workout Duration"
            value={today.workoutDuration}
            unit="mins"
            icon={Dumbbell}
            color="#10b981"
            subtitle={`${workouts.todayCount} session(s) logged`}
          />
          <StatCard
            title="Water Consumed"
            value={today.water}
            unit="ml"
            icon={Droplets}
            color="#3b82f6"
            subtitle={`Goal: ${today.waterTarget} ml (${today.waterPercentage}%)`}
          />
        </div>
      </div>

      {/* MID SECTION: NUTRITION & WATER & WEIGHT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Nutrition Macro breakdown */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={18} color="#06b6d4" /> Macro Breakdown
            </h3>
            <Link to="/meals" style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600 }}>View Details</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#9ca3af' }}>Protein</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{nutrition.protein}g</span>
              </div>
              <ProgressBar progress={(nutrition.protein / 150) * 100} color="#10b981" showLabel={false} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#9ca3af' }}>Carbohydrates</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{nutrition.carbs}g</span>
              </div>
              <ProgressBar progress={(nutrition.carbs / 250) * 100} color="#06b6d4" showLabel={false} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#9ca3af' }}>Healthy Fats</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{nutrition.fats}g</span>
              </div>
              <ProgressBar progress={(nutrition.fats / 70) * 100} color="#f59e0b" showLabel={false} />
            </div>
          </div>
        </div>

        {/* Water Hydration Visualizer */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={18} color="#3b82f6" /> Daily Hydration
            </h3>
            <Link to="/water" style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 }}>Add Water</Link>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>{today.water}</span>
            <span style={{ color: '#9ca3af', fontSize: '1.1rem', marginLeft: '0.2rem' }}>/ {today.waterTarget} ml</span>
            <div style={{ marginTop: '1rem' }}>
              <ProgressBar progress={today.waterPercentage} color="#3b82f6" height="12px" />
            </div>
          </div>
        </div>

        {/* Weight Tracker summary */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="#f59e0b" /> Body Weight Status
            </h3>
            <Link to="/weight" style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>Log Weight</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Current</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{weight.current} kg</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Goal</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>{weight.goal} kg</div>
            </div>
          </div>
        </div>

      </div>

      {/* ACTIVE FITNESS GOALS */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="#10b981" /> Active Fitness Goals ({goals.activeCount})
          </h3>
          <Link to="/goals" className="btn btn-secondary btn-sm">
            Manage Goals
          </Link>
        </div>

        {goals.list && goals.list.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {goals.list.map((goal) => {
              const p = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
              return (
                <div key={goal._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{goal.title}</span>
                    <span className="badge badge-emerald">{goal.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>{goal.description || 'Target fitness goal'}</p>
                  <ProgressBar progress={p} color="#10b981" />
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No active goals set yet. Add a fitness goal to start tracking!</p>
        )}
      </div>

      {/* STORE RECOMMENDATIONS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={22} color="#06b6d4" /> Recommended For Your {user.fitnessGoal} Journey
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Hand-picked products based on your user profile and active fitness target.
            </p>
          </div>

          <Link to="/store" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#06b6d4', fontWeight: 700, fontSize: '0.9rem' }}>
            Visit Store <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cols-4">
          {recommendedProducts && recommendedProducts.length > 0 ? (
            recommendedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <p style={{ color: '#9ca3af' }}>Loading recommendations...</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
