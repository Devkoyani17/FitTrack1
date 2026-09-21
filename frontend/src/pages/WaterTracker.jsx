import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Droplets, Plus, Trash2 } from 'lucide-react';

const WaterTracker = () => {
  const [summary, setSummary] = useState({ totalConsumed: 0, goalAmount: 3000, progressPercentage: 0, remaining: 3000 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState(250);

  const fetchWater = async () => {
    try {
      setLoading(true);
      const res = await api.getWater();
      if (res.success) {
        setSummary(res.summary);
        setLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWater();
  }, []);

  const handleAddWater = async (amount) => {
    try {
      await api.addWater({ amount });
      fetchWater();
    } catch (err) {
      alert(err.message || 'Failed to record water');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteWater(id);
      fetchWater();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating daily hydration target..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Droplets size={26} color="#3b82f6" /> Water Hydration Tracker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Maintain optimal performance by tracking your daily fluid intake.</p>
      </div>

      {/* Main Hydration Visualizer Card */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Today's Total Intake
        </span>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>
          {summary.totalConsumed} <span style={{ fontSize: '1.2rem', color: '#9ca3af' }}>/ {summary.goalAmount} ml</span>
        </div>
        
        <p style={{ color: '#10b981', fontWeight: 700, margin: '0.5rem 0 1.5rem 0' }}>
          {summary.progressPercentage}% Completed ({summary.remaining} ml remaining)
        </p>

        <ProgressBar progress={summary.progressPercentage} color="#3b82f6" height="14px" showLabel={false} />

        {/* Quick Add Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleAddWater(250)} className="btn btn-secondary">
            + 250 ml (Glass)
          </button>
          <button onClick={() => handleAddWater(500)} className="btn btn-secondary">
            + 500 ml (Bottle)
          </button>
          <button onClick={() => handleAddWater(750)} className="btn btn-secondary">
            + 750 ml (Shaker)
          </button>
        </div>

        {/* Custom Input */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', maxWidth: '300px', margin: '1rem auto 0 auto' }}>
          <input
            type="number"
            className="form-input"
            value={customAmount}
            onChange={(e) => setCustomAmount(Number(e.target.value))}
            placeholder="Custom ml"
          />
          <button onClick={() => handleAddWater(customAmount)} className="btn btn-cyan btn-sm">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Today Logs */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Today's Hydration Logs</h3>
        {logs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {logs.map((log) => (
              <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Droplets size={18} color="#3b82f6" />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{log.amount} ml</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.6rem' }}>{log.time}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(log._id)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No water logged yet today. Click one of the quick add buttons above!</p>
        )}
      </div>

    </div>
  );
};

export default WaterTracker;
