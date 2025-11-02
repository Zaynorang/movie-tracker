import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Impor instance auth
import { onAuthStateChanged } from 'firebase/auth';

// Impor komponen dan halaman
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';

function App() {
  // State untuk menyimpan data pengguna yang sedang login
  const [currentUser, setCurrentUser] = useState(null);
  // State untuk menangani status loading awal (menunggu pengecekan auth)
  const [loading, setLoading] = useState(true);

  // useEffect hook ini berjalan saat komponen App di-mount
  useEffect(() => {
    // onAuthStateChanged adalah listener dari Firebase
    // Ini akan terpanggil setiap kali status login pengguna berubah
    // (login, logout, atau saat pertama kali memuat)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set pengguna saat ini (bisa null jika logout)
      setLoading(false); // Selesai loading
    });

    // Cleanup function: ini akan dipanggil saat komponen di-unmount
    // untuk membersihkan listener dan menghindari memory leak
    return () => {
      unsubscribe();
    };
  }, []); // Array kosong [] berarti hook ini hanya berjalan sekali saat mount

  // Jika masih loading (menunggu pengecekan auth), tampilkan pesan loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Movie Tracker...</p>
      </div>
    );
  }

  // Render UI utama
  return (
    <div className="App">
      {/* Navbar selalu ditampilkan, dan kita teruskan info pengguna */}
      <Navbar user={currentUser} />

      {/* Container untuk memberi padding pada konten halaman 
        (didefinisikan di style.css)
      */}
      <div className="container">
        <Routes>
          {/* Rute Publik (Login & Signup) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Rute yang Dilindungi (Protected Routes)
            Ini menggunakan ternary operator untuk mengecek apakah `currentUser` ada.
            - Jika ADA (user login): Tampilkan komponen halaman (misal: <Dashboard />)
            - Jika TIDAK ADA (user logout): Alihkan (Navigate) ke halaman /login
          */}

          <Route
            path="/"
            element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/add"
            element={currentUser ? <AddMovie /> : <Navigate to="/login" />}
          />
          {/* :id adalah parameter URL dinamis untuk ID film */}
          <Route
            path="/edit/:id"
            element={currentUser ? <EditMovie /> : <Navigate to="/login" />}
          />

          {/* Fallback route jika URL tidak ditemukan */}
          <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;