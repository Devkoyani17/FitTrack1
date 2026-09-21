import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import { Utensils, Plus, Trash2, Calendar } from 'lucide-react';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbohydrates: 0, fats: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mealType: 'Breakfast',
    calories: 450,
    protein: 30,
    carbohydrates: 50,
    fats: 10,
    notes: ''
  });

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await api.getMeals();
      if (res.success) {
        setMeals(res.data);
        setTotals(res.totals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.createMeal(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        mealType: 'Breakfast',
        calories: 450,
        protein: 30,
        carbohydrates: 50,
        fats: 10,
        notes: ''
      });
      fetchMeals();
    } catch (err) {
      alert(err.message || 'Failed to log meal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meal record?')) {
      try {
        await api.deleteMeal(id);
        fetchMeals();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Calculating nutrition breakdown..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={26} color="#06b6d4" /> Nutrition & Meal Tracker
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Monitor your daily caloric intake and macro balance.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-cyan">
          <Plus size={18} /> Record New Meal
        </button>
      </div>

      {/* Totals Summary Banner */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', textAlign: 'center' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Total Calories</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{totals.calories} kcal</div>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Total Protein</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{totals.protein}g</div>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Carbohydrates</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06b6d4' }}>{totals.carbohydrates}g</div>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Fats</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{totals.fats}g</div>
        </div>
      </div>

      {/* Meals Grid */}
      {meals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {meals.map((m) => (
            <div key={m._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-cyan">{m.mealType}</span>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> {new Date(m.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{m.name}</h3>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Cals</span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{m.calories}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Prot</span>
                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>{m.protein}g</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Carb</span>
                    <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.9rem' }}>{m.carbohydrates}g</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Fat</span>
                    <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>{m.fats}g</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => handleDelete(m._id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Utensils}
          title="No Meals Recorded Today"
          description="Log your breakfast, lunch, dinner or snacks to calculate macro nutrients."
          actionLabel="Record Meal"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Add Meal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Meal">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Meal Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oatmeal with Whey Protein"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meal Type *</label>
            <select
              className="form-select"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Calories (kcal) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="form-input"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Carbohydrates (g)</label>
              <input
                type="number"
                className="form-input"
                value={formData.carbohydrates}
                onChange={(e) => setFormData({ ...formData, carbohydrates: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fats (g)</label>
              <input
                type="number"
                className="form-input"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: Number(e.target.value) })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-cyan" style={{ width: '100%', marginTop: '0.5rem' }}>
            Record Meal
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default Meals;
