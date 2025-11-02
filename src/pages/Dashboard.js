import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import MovieCard from '../components/MovieCard';

const Dashboard = () => {
  // State untuk menyimpan daftar film, status loading, dan error
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fungsi untuk mengambil data film dari Firestore
  const fetchMovies = async () => {
    try {
      // 1. Dapatkan pengguna yang sedang login saat ini
      const user = auth.currentUser;
      if (!user) {
        setError('No user is logged in.');
        setLoading(false);
        return;
      }

      // 2. Buat referensi ke koleksi 'movies'
      const moviesCollectionRef = collection(db, 'movies');

      // 3. Buat query untuk HANYA mengambil film
      //    dimana 'userId' sama dengan ID pengguna yang sedang login
      const q = query(moviesCollectionRef, where('userId', '==', user.uid));

      // 4. Eksekusi query
      const querySnapshot = await getDocs(q);

      // 5. Ubah data (dokumen) hasil query menjadi array
      const moviesList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Simpan ID dokumen
        ...doc.data(), // Ambil semua data (title, year, etc.)
      }));

      setMovies(moviesList); // Simpan daftar film ke state
    } catch (err) {
      setError('Failed to fetch movies.');
      console.error(err);
    } finally {
      setLoading(false); // Selesai loading, baik berhasil maupun gagal
    }
  };

  // useEffect hook untuk memanggil fetchMovies() saat halaman di-load
  useEffect(() => {
    fetchMovies();
  }, []); // Array kosong berarti hanya berjalan sekali

  // Fungsi untuk menghapus film (Delete)
  const handleDeleteMovie = async (movieId) => {
    // Tampilkan konfirmasi
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      // 1. Buat referensi ke dokumen film yang spesifik
      const movieDocRef = doc(db, 'movies', movieId);

      // 2. Hapus dokumen
      await deleteDoc(movieDocRef);

      // 3. Perbarui state lokal untuk menghapus film dari UI
      //    (tanpa perlu me-refresh seluruh data dari server)
      setMovies(movies.filter((movie) => movie.id !== movieId));
    } catch (err) {
      setError('Failed to delete movie.');
      console.error(err);
    }
  };

  // Tampilan loading
  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  // Tampilan error
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Tampilan utama
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Movie List</h2>
        <Link to="/add" className="btn btn-primary">
          + Add New Movie
        </Link>
      </div>

      <div className="movie-list">
        {movies.length > 0 ? (
          // Jika ada film, map dan tampilkan menggunakan MovieCard
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDeleteMovie}
            />
          ))
        ) : (
          // Jika tidak ada film
          <p>Your movie list is empty. Add a new movie to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;