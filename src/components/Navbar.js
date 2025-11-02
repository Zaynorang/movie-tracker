import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Menerima prop 'user' dari App.js
const Navbar = ({ user }) => {
  const navigate = useNavigate();

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Panggil fungsi signOut dari Firebase Auth
      navigate('/login'); // Arahkan pengguna ke halaman login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎬 Movie Tracker
      </Link>
      <div className="navbar-links">
        {user ? (
          // Jika pengguna sudah login
          <>
            <span className="navbar-user">Hi, {user.email}</span>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </>
        ) : (
          // Jika pengguna belum login
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;