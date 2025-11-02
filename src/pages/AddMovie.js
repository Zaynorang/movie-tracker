import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Ambil Kunci API dari file .env
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const AddMovie = () => {
  // State untuk form utama
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('5');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- State BARU untuk Fitur Pencarian ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // --- Fungsi BARU untuk menangani pencarian film ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;

    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);

    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch from TMDb.');
      }
      const data = await response.json();

      // Hanya ambil 5 hasil teratas
      setSearchResults(data.results.slice(0, 5)); 
    } catch (err) {
      setSearchError(err.message);
    }
    setSearchLoading(false);
  };

  // --- Fungsi BARU untuk memilih film dari hasil pencarian ---
  const handleSelectMovie = (movie) => {
    // Isi otomatis form utama
    setTitle(movie.title);
    // Ambil tahun dari tanggal rilis (misal: "2024-05-10" -> "2024")
    setYear(movie.release_date ? movie.release_date.split('-')[0] : '');
    // Masukkan deskripsi film ke notes
    setNotes(movie.overview || '');
    
    // Kosongkan hasil pencarian
    setSearchResults([]);
    setSearchQuery('');
  };

  // --- Fungsi handleSubmit (yang sudah ada) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = auth.currentUser.uid;
      if (!userId) {
        throw new Error('No user is logged in.');
      }

      await addDoc(collection(db, 'movies'), {
        title: title,
        year: Number(year),
        genre: genre,
        rating: Number(rating),
        notes: notes,
        userId: userId,
        createdAt: serverTimestamp(),
      });

      navigate('/');
    } catch (err) {
      setError('Failed to add movie. ' + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      {/* --- Bagian BARU: Formulir Pencarian --- */}
      <div className="search-container form-container">
        <form onSubmit={handleSearch}>
          <h2>Search Movie (from TMDb)</h2>
          <p>Find a movie to auto-fill the form below.</p>
          <div className="form-group">
            <label htmlFor="search">Movie Title Search</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Inception, The Dark Knight..."
            />
          </div>
          {searchError && <p className="error-message">{searchError}</p>}
          <button type.="submit" className="btn btn-secondary" disabled={searchLoading}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* --- Bagian BARU: Hasil Pencarian --- */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => handleSelectMovie(movie)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/92x138.png?text=No+Image'
                  }
                  alt={movie.title}
                />
                <div className="result-info">
                  <strong>{movie.title}</strong>
                  <span>({movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Formulir "Add Movie" yang sudah ada --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add New Movie (Manual Entry)</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Sci-Fi, Action (fill this yourself)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes / Comments</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Movie to My List'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddMovie;