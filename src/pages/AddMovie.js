import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const POSTER_BASE_URL_W185 = 'https://image.tmdb.org/t/p/w185'; // Untuk pratinjau

const AddMovie = () => {
  // State untuk form utama
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [overview, setOverview] = useState('');
  
  // --- STATE BARU: Untuk poster manual ---
  const [manualPosterUrl, setManualPosterUrl] = useState('');
  // --- AKHIR STATE BARU ---

  const [posterPath, setPosterPath] = useState(''); // Ini dari TMDb
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State untuk Fitur Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Fungsi untuk menangani pencarian film
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;

    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);
    setManualPosterUrl(''); // Clear manual poster when searching

    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch from TMDb.');
      }
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5));
    } catch (err) {
      setSearchError(err.message);
    }
    setSearchLoading(false);
  };

  // Fungsi untuk memilih film dari hasil pencarian
  const handleSelectMovie = (movie) => {
    setTitle(movie.title);
    setYear(movie.release_date ? movie.release_date.split('-')[0] : '');
    setPosterPath(movie.poster_path || ''); // Set posterPath dari TMDb
    setManualPosterUrl(''); // Clear manual URL if using search
    setOverview(movie.overview || '');
    setReview('');

    setSearchResults([]);
    setSearchQuery('');
  };

  // Fungsi handleSubmit
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
        overview: overview,
        review: review,
        
        // --- PERUBAHAN DATA SIMPAN: Tambahkan manualPosterUrl ---
        poster_path: posterPath, // Dari TMDb search
        manual_poster_url: manualPosterUrl, // Dari input manual
        // --- AKHIR PERUBAHAN ---

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

  // Fungsi untuk mendapatkan URL poster untuk pratinjau di form
  const getPreviewPosterUrl = () => {
    if (manualPosterUrl) {
      return manualPosterUrl;
    }
    if (posterPath) {
      return `${POSTER_BASE_URL_W185}${posterPath}`;
    }
    return '';
  };
  const previewPoster = getPreviewPosterUrl();

  return (
    <>
      {/* --- Formulir Pencarian --- */}
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
          <button type="submit" className="btn btn-secondary" disabled={searchLoading}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

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
                      ? `${POSTER_BASE_URL_W185}${movie.poster_path}` // Ganti w92 jadi w185 untuk pratinjau yang lebih baik
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

      {/* --- Formulir "Add Movie" --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add New Movie (Manual Entry)</h2>

          {previewPoster && ( // Gunakan previewPoster untuk menampilkan gambar
            <div className="form-group poster-preview-container">
              <label>Poster Preview</label>
              <img
                src={previewPoster}
                alt="Selected movie poster preview"
                className="poster-preview-image"
              />
            </div>
          )}

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
          
          {overview && (
            <div className="form-group">
              <label>Overview (from TMDb)</label>
              <p className="form-overview-display">{overview}</p>
            </div>
          )}

          {/* --- INPUT BARU UNTUK URL POSTER MANUAL --- */}
          {!posterPath && ( // Hanya tampilkan jika tidak ada poster dari TMDb
            <div className="form-group">
              <label htmlFor="manualPosterUrl">Poster Image URL (Optional)</label>
              <input
                type="url"
                id="manualPosterUrl"
                value={manualPosterUrl}
                onChange={(e) => setManualPosterUrl(e.target.value)}
                placeholder="https://example.com/poster.jpg"
              />
              <small className="form-help-text">
                Enter a direct image URL if you want a custom poster.
              </small>
            </div>
          )}
          {/* --- AKHIR INPUT BARU --- */}

          <div className="form-group">
            <label htmlFor="review">My Review / Notes</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
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