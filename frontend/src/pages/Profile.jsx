import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: 25,
    gender: 'Male',
    height: 175,
    weight: 70,
    fitnessGoal: 'General Fitness',
    activityLevel: 'Moderately Active',
    profileImage: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getProfile();
        if (res.success) {
          setProfile(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      setSaving(true);
      const res = await api.updateProfile(profile);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        updateUser(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user profile..." />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }} className="animate-fade-in">
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} color="#10b981" /> Profile & Physical Metrics
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Manage your personal details and fitness targets.</p>
      </div>

      <div className="glass-panel">
        
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={profile.name || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={profile.email || ''}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={profile.age || 25}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height"
                className="form-input"
                value={profile.height || 175}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className="form-input"
                value={profile.weight || 70}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={profile.gender || 'Male'} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Fitness Goal</label>
              <select name="fitnessGoal" className="form-select" value={profile.fitnessGoal || 'General Fitness'} onChange={handleChange}>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Endurance">Endurance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Level</label>
            <select name="activityLevel" className="form-select" value={profile.activityLevel || 'Moderately Active'} onChange={handleChange}>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
              <option value="Super Active">Super Active</option>
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <Save size={18} />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Profile;
