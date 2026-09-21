import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 25,
    gender: 'Male',
    height: 175,
    weight: 70,
    fitnessGoal: 'General Fitness',
    activityLevel: 'Moderately Active'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b0f19' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
            }}>
              <Activity size={26} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Create Your FitTrack Account</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>Join thousands tracking their fitness journey</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  className="form-input"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-input"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Primary Fitness Goal</label>
                <select name="fitnessGoal" className="form-select" value={formData.fitnessGoal} onChange={handleChange}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select name="activityLevel" className="form-select" value={formData.activityLevel} onChange={handleChange}>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                  <option value="Super Active">Super Active</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#10b981', fontWeight: 700 }}>
              Sign in
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
