import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Dumbbell, Search, Filter, Flame } from 'lucide-react';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await api.getExercises({ search, category, muscleGroup });
      if (res.success) {
        setExercises(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [search, category, muscleGroup]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Dumbbell size={26} color="#10b981" /> Exercise Master Library
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Browse exercise routines, muscle targets, and calories burned benchmarks.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search exercises by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="HIIT">HIIT</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-select" value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
            <option value="">All Muscle Groups</option>
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Arms">Arms</option>
            <option value="Legs">Legs</option>
            <option value="Core">Core</option>
            <option value="Full Body">Full Body</option>
          </select>
        </div>

      </div>

      {/* Exercise Grid */}
      {loading ? (
        <LoadingSpinner message="Filtering exercises..." />
      ) : exercises.length > 0 ? (
        <div className="grid-cols-4">
          {exercises.map((e) => (
            <div key={e._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
              <img
                src={e.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500'}
                alt={e.name}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span className="badge badge-emerald">{e.category}</span>
                <span className="badge badge-cyan">{e.muscleGroup}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>{e.name}</h3>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.4, flex: 1, marginBottom: '0.75rem' }}>
                {e.description || 'Standard training movement.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#6b7280', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                <span>Equip: {e.equipment || 'None'}</span>
                <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Flame size={14} /> ~{e.caloriesBurned} kcal/30m
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Dumbbell}
          title="No Exercises Found"
          description="Try broadening your search criteria or resetting filters."
        />
      )}

    </div>
  );
};

export default Exercises;
