import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <h2>Create an Account</h2>
      
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
          style={{ width: '100%', padding: '12px', fontSize: '16px' }}
        >
          Create Account
        </button>
      </form>
      
      <div style={{ 
        marginTop: '24px', 
        textAlign: 'center',
        padding: '15px',
        borderTop: '1px solid #eee' 
      }}>
        Already have an account? <Link to="/login" style={{ 
          color: '#007bff', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>Log in here</Link>
      </div>
    </div>
  );
}

export default Signup;