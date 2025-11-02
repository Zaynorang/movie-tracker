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
  writeBatch, // --- Impor BARU untuk batch write ---
  serverTimestamp // --- Impor BARU untuk timestamp ---
} from 'firebase/firestore';
import MovieCard from '../components/MovieCard';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- State BARU untuk Impor/Ekspor ---
  const [importLoading, setImportLoading] = useState(false);
  const [importFeedback, setImportFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'success' or 'error'
  // --- Akhir State BARU ---

  const [view, setView] = useState('grid'); // 'grid' (default) atau 'list'

  // Fungsi untuk mengambil data film (tidak berubah, tapi akan kita panggil lagi)
  const fetchMovies = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is logged in.');
        setLoading(false);
        return;
      }

      const moviesCollectionRef = collection(db, 'movies');
      const q = query(moviesCollectionRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const moviesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovies(moviesList);
    } catch (err) {
      setError('Failed to fetch movies.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []); // Array kosong berarti hanya berjalan sekali

  // Fungsi untuk menghapus film (tidak berubah)
  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }
    try {
      const movieDocRef = doc(db, 'movies', movieId);
      await deleteDoc(movieDocRef);
      setMovies(movies.filter((movie) => movie.id !== movieId));
    } catch (err) {
      setError('Failed to delete movie.');
      console.error(err);
    }
  };

  // --- Fungsi BARU untuk Ekspor Data ---
  const handleExport = () => {
    if (movies.length === 0) {
      alert('Your movie list is empty. Nothing to export.');
      return;
    }

    // Buat salinan data dan hapus 'id' dan 'userId' jika tidak diperlukan
    const exportData = movies.map(movie => {
      const { id, userId, createdAt, ...movieToExport } = movie;
      return movieToExport; // Ekspor data bersih (title, year, review, dll)
    });

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movie-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // --- Akhir Fungsi Ekspor ---

  // --- Fungsi BARU untuk Impor Data ---
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
      setImportFeedback('Please select a valid .json file.');
      setFeedbackType('error');
      return;
    }

    setImportLoading(true);
    setImportFeedback('');
    setFeedbackType('');

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importedMovies = JSON.parse(e.target.result);

        if (!Array.isArray(importedMovies)) {
          throw new Error('Invalid JSON format. Expected an array.');
        }

        const user = auth.currentUser;
        if (!user) {
          throw new Error('You must be logged in to import.');
        }

        // Gunakan `movies` dari state untuk mengecek duplikat
        const existingMoviesLookup = new Set(
          movies.map(m => `${m.title.toLowerCase().trim()}_${m.year}`)
        );

        const batch = writeBatch(db);
        const moviesCollectionRef = collection(db, 'movies');
        let moviesAddedCount = 0;
        let moviesSkippedCount = 0;

        importedMovies.forEach((movie) => {
          // Validasi data impor dasar
          if (!movie.title || !movie.year) {
            console.warn('Skipping movie with missing title or year:', movie);
            return;
          }

          const importKey = `${movie.title.toLowerCase().trim()}_${movie.year}`;

          if (existingMoviesLookup.has(importKey)) {
            moviesSkippedCount++;
          } else {
            // Ini film baru, tambahkan ke batch
            const newDocRef = doc(moviesCollectionRef); // Buat ID baru
            const newMovieData = {
              ...movie,
              userId: user.uid,
              createdAt: serverTimestamp(),
            };
            batch.set(newDocRef, newMovieData);
            moviesAddedCount++;
            
            // Perbarui set lookup agar impor tidak menduplikasi dirinya sendiri
            existingMoviesLookup.add(importKey); 
          }
        });

        if (moviesAddedCount > 0) {
          await batch.commit();
        }

        setImportFeedback(
          `Import complete: Added ${moviesAddedCount} new movies. Skipped ${moviesSkippedCount} duplicates.`
        );
        setFeedbackType('success');
        fetchMovies(); // PENTING: Muat ulang daftar film setelah impor
      } catch (err) {
        setImportFeedback('Failed to import: ' + err.message);
        setFeedbackType('error');
      } finally {
        setImportLoading(false);
      }
    };

    reader.onerror = () => {
      setImportFeedback('Failed to read the file.');
      setFeedbackType('error');
      setImportLoading(false);
    };

    reader.readAsText(file);

    // Reset input file agar bisa mengimpor file yang sama lagi
    event.target.value = null;
  };
  // --- Akhir Fungsi Impor ---

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Movie List</h2>
        
        {/* --- KUMPULAN TOMBOL BARU --- */}
        <div className="dashboard-header-actions">
            {/* --- TAMBAHKAN BLOK TOMBOL BARU INI --- */}
    <div className="view-toggle-buttons">
      <button 
        onClick={() => setView('grid')}
        className={`btn btn-view ${view === 'grid' ? 'active' : ''}`}
        title="Grid View"
      >
        ▦
      </button>
      <button 
        onClick={() => setView('list')}
        className={`btn btn-view ${view === 'list' ? 'active' : ''}`}
        title="List View"
      >
        ☰
      </button>
    </div>
    {/* --- AKHIR BLOK TOMBOL BARU --- */}
          <button
            onClick={handleExport}
            className="btn btn-secondary"
            disabled={importLoading || movies.length === 0}
          >
            Export List (.json)
          </button>
          
          {/* Ini adalah tombol palsu (label) untuk input file yang tersembunyi */}
          <label 
            htmlFor="import-input" 
            className={`btn btn-secondary ${importLoading ? 'disabled' : ''}`}
          >
            {importLoading ? 'Importing...' : 'Import List (.json)'}
          </label>
          <input
            type="file"
            id="import-input"
            className="hidden-file-input"
            accept=".json"
            onChange={handleImport}
            disabled={importLoading}
          />
          
          <Link to="/add" className="btn btn-primary">
            + Add New Movie
          </Link>
        </div>
        {/* --- Akhir Kumpulan Tombol --- */}
      </div>

      {/* --- Pesan Feedback Impor BARU --- */}
      {importFeedback && (
        <div className={`import-feedback ${feedbackType}`}>
          {importFeedback}
        </div>
      )}
      {/* --- Akhir Pesan Feedback --- */}

      <div className={`movie-list ${view === 'grid' ? 'grid-view' : 'list-view'}`}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDeleteMovie}
            />
          ))
        ) : (
          <p>Your movie list is empty. Add a new movie or import a list!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;