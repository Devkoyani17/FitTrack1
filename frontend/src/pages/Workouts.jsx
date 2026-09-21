import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { Dumbbell, Plus, Trash2, Calendar, Flame, Clock } from 'lucide-react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [formData, setFormData] = useState({
    exercise: '',
    duration: 30,
    sets: 3,
    reps: 10,
    weight: 0,
    caloriesBurned: 150,
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wRes, eRes] = await Promise.all([api.getWorkouts(), api.getExercises()]);
      if (wRes.success) setWorkouts(wRes.data);
      if (eRes.success) setExercises(eRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (workout = null) => {
    if (workout) {
      setEditingWorkout(workout);
      setFormData({
        exercise: workout.exercise?._id || workout.exercise || '',
        duration: workout.duration || 30,
        sets: workout.sets || 1,
        reps: workout.reps || 10,
        weight: workout.weight || 0,
        caloriesBurned: workout.caloriesBurned || 150,
        notes: workout.notes || ''
      });
    } else {
      setEditingWorkout(null);
      setFormData({
        exercise: exercises[0]?._id || '',
        duration: 30,
        sets: 3,
        reps: 10,
        weight: 0,
        caloriesBurned: 150,
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await api.updateWorkout(editingWorkout._id, formData);
      } else {
        await api.createWorkout(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to save workout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout log?')) {
      try {
        await api.deleteWorkout(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Fetching logged workouts..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={26} color="#10b981" /> Workout Sessions Tracker
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Log your daily training sets, duration, and calories burned.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={18} /> Log New Workout
        </button>
      </div>

      {workouts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {workouts.map((w) => (
            <div key={w._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-emerald">{w.exercise?.category || 'Strength'}</span>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> {new Date(w.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {w.exercise?.name || 'Workout Session'}
                </h3>

                <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Duration</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={14} color="#06b6d4" /> {w.duration} m
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Calories</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Flame size={14} /> {w.caloriesBurned} kcal
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sets x Reps</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                      {w.sets} × {w.reps} {w.weight ? `(${w.weight}kg)` : ''}
                    </div>
                  </div>
                </div>

                {w.notes && <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>"{w.notes}"</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => handleOpenModal(w)} className="btn btn-secondary btn-sm">Edit</button>
                <button onClick={() => handleDelete(w._id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Dumbbell}
          title="No Workouts Logged Yet"
          description="Log your first training session to start visualizing your fitness statistics."
          actionLabel="Log Workout Now"
          onAction={() => handleOpenModal()}
        />
      )}

      {/* Log/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkout ? 'Edit Workout Record' : 'Log New Workout Session'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Exercise *</label>
            <select
              className="form-select"
              value={formData.exercise}
              onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
              required
            >
              <option value="">-- Select Exercise --</option>
              {exercises.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name} ({e.category} - {e.muscleGroup})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (Minutes) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Est. Calories Burned *</label>
              <input
                type="number"
                className="form-input"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Sets</label>
              <input
                type="number"
                className="form-input"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reps per set</label>
              <input
                type="number"
                className="form-input"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-input"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Session Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Felt great, increased weight..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {editingWorkout ? 'Save Changes' : 'Log Workout'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default Workouts;
