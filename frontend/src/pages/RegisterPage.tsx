// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Name<br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Password<br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '0.75rem' }}>{error}</div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
