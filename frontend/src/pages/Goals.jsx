import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 80,
    currentValue: 70,
    unit: 'kg',
    deadline: '',
    status: 'active'
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getGoals();
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description || '',
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        unit: goal.unit || 'kg',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        status: goal.status
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        targetValue: 80,
        currentValue: 70,
        unit: 'kg',
        deadline: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.updateGoal(editingGoal._id, formData);
      } else {
        await api.createGoal(formData);
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      alert(err.message || 'Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this fitness goal?')) {
      try {
        await api.deleteGoal(id);
        fetchGoals();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading fitness targets..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={26} color="#10b981" /> Fitness Goals Tracker
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Set target values, track deadlines, and accomplish your fitness milestones.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={18} /> Create New Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {goals.map((g) => {
            const p = Math.min(Math.round((g.currentValue / g.targetValue) * 100), 100);
            return (
              <div key={g._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className={`badge ${g.status === 'completed' ? 'badge-emerald' : g.status === 'cancelled' ? 'badge-red' : 'badge-cyan'}`}>
                      {g.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Deadline: {new Date(g.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>{g.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {g.description || 'Custom fitness target.'}
                  </p>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      <span style={{ color: '#9ca3af' }}>Current: {g.currentValue} {g.unit}</span>
                      <span style={{ color: '#10b981' }}>Target: {g.targetValue} {g.unit}</span>
                    </div>
                    <ProgressBar progress={p} color={g.status === 'completed' ? '#10b981' : '#06b6d4'} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => handleOpenModal(g)} className="btn btn-secondary btn-sm">Edit / Update</button>
                  <button onClick={() => handleDelete(g._id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No Fitness Goals Created"
          description="Create your first fitness goal to keep yourself accountable and track milestones."
          actionLabel="Create Goal"
          onAction={() => handleOpenModal()}
        />
      )}

      {/* Goal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGoal ? 'Update Goal' : 'Create Fitness Goal'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Reach 80kg Lean Muscle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Goal details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Current Value</label>
              <input
                type="number"
                className="form-input"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Value *</label>
              <input
                type="number"
                className="form-input"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <input
                type="text"
                className="form-input"
                placeholder="kg, reps, ml"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Deadline *</label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {editingGoal ? 'Save Goal Changes' : 'Create Goal'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default Goals;
