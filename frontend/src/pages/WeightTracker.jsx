import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Scale, Plus, Trash2, Calendar, TrendingDown, TrendingUp } from 'lucide-react';

const WeightTracker = () => {
  const [summary, setSummary] = useState({ currentWeight: 70, previousWeight: 70, weightDifference: 0, startingWeight: 70, totalWeightChange: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');

  const fetchWeight = async () => {
    try {
      setLoading(true);
      const res = await api.getWeightHistory();
      if (res.success) {
        setSummary(res.summary);
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeight();
  }, []);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!newWeight || Number(newWeight) <= 0) return;

    try {
      await api.addWeight({ weight: Number(newWeight) });
      setNewWeight('');
      fetchWeight();
    } catch (err) {
      alert(err.message || 'Failed to log weight');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete weight entry?')) {
      try {
        await api.deleteWeight(id);
        fetchWeight();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Calculating weight history trends..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={26} color="#f59e0b" /> Body Weight Tracker & Progress
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Log weight weigh-ins and track total changes over time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-cols-4">
        <StatCard
          title="Current Weight"
          value={summary.currentWeight}
          unit="kg"
          icon={Scale}
          color="#f59e0b"
        />
        <StatCard
          title="Previous Weight"
          value={summary.previousWeight}
          unit="kg"
          icon={Scale}
          color="#9ca3af"
        />
        <StatCard
          title="Recent Change"
          value={summary.weightDifference > 0 ? `+${summary.weightDifference}` : summary.weightDifference}
          unit="kg"
          icon={summary.weightDifference <= 0 ? TrendingDown : TrendingUp}
          color={summary.weightDifference <= 0 ? '#10b981' : '#ef4444'}
        />
        <StatCard
          title="Total Change"
          value={summary.totalWeightChange > 0 ? `+${summary.totalWeightChange}` : summary.totalWeightChange}
          unit="kg"
          icon={Scale}
          color="#06b6d4"
          subtitle={`Started at ${summary.startingWeight} kg`}
        />
      </div>

      {/* Log Form */}
      <div className="glass-panel" style={{ maxWidth: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Log New Weigh-In</h3>
        <form onSubmit={handleAddWeight} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="number"
            step="0.1"
            className="form-input"
            placeholder="Weight in kg (e.g. 74.5)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} /> Record
          </button>
        </form>
      </div>

      {/* History List */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Weigh-In History</h3>
        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map((h) => (
              <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} color="#9ca3af" />
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{new Date(h.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{h.weight} kg</span>
                  <button onClick={() => handleDelete(h._id)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Scale}
            title="No Weight Records Found"
            description="Log your first weigh-in above to begin tracking weight progress."
          />
        )}
      </div>

    </div>
  );
};

export default WeightTracker;
