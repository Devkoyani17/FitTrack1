import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Activity,
  Dumbbell,
  Utensils,
  Droplets,
  Scale,
  Target,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#fff' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#10b981',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> Complete Fitness Management & E-Commerce Platform
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Track. Train. Transform. <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shop.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#9ca3af',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}>
            FitTrack brings workout routines, macro nutrition, hydration, body weight progress, and premium fitness supplements into a single seamless, high-performance platform.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free Today <ChevronRight size={18} />
            </Link>
            <Link to="/store" className="btn btn-secondary btn-lg">
              Explore FitTrack Store <ShoppingBag size={18} />
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Everything You Need To Achieve Your Goals</h2>
            <p style={{ color: '#9ca3af', marginTop: '0.4rem' }}>Engineered for athletes, lifters, and everyday fitness enthusiasts.</p>
          </div>

          <div className="grid-cols-4">
            
            <div className="glass-panel">
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
                <Dumbbell size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Workout Tracking</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Log sets, reps, weight lifted, duration, and estimated calories burned across multiple exercise categories.
              </p>
            </div>

            <div className="glass-panel">
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
                <Utensils size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Macro Nutrition</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Monitor daily calories, protein, carbohydrates, and fats for breakfast, lunch, dinner, and snacks.
              </p>
            </div>

            <div className="glass-panel">
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
                <Droplets size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>Water & Weight</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Stay hydrated with daily water goal visualizers and track weight trends over time towards target goals.
              </p>
            </div>

            <div className="glass-panel">
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
                <ShoppingBag size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>FitTrack Store</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Shop 100% authentic protein supplements, pre-workouts, creatine, gym gear, and recovery products.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
