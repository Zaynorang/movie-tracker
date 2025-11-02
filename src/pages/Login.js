import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  // State untuk menyimpan email, password, dan pesan error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setError(''); // Reset error
    setLoading(true);

    try {
      // Panggil fungsi Firebase Auth untuk login
      await signInWithEmailAndPassword(auth, email, password);
      // Jika berhasil, arahkan ke dashboard (halaman utama)
      navigate('/');
    } catch (err) {
      // Jika gagal, tampilkan pesan error
      setError('Failed to log in. Please check your email and password.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
        <p className="form-switch">
          Need an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;