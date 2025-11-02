import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const POSTER_BASE_URL_W185 = 'https://image.tmdb.org/t/p/w185'; // Untuk pratinjau

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk form
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
  const [loading, setLoading] = useState(true);

  const movieDocRef = doc(db, 'movies', id);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const docSnap = await getDoc(movieDocRef);

        if (docSnap.exists()) {
          const movieData = docSnap.data();
          setTitle(movieData.title);
          setYear(movieData.year);
          setGenre(movieData.genre);
          setRating(movieData.rating);
          setReview(movieData.review || '');
          setOverview(movieData.overview || '');
          setPosterPath(movieData.poster_path || ''); 
          
          // --- PERUBAHAN PENGAMBILAN DATA: Ambil manualPosterUrl ---
          setManualPosterUrl(movieData.manual_poster_url || ''); 
          // --- AKHIR PERUBAHAN ---

        } else {
          setError('No such movie found!');
        }
      } catch (err) {
        setError('Failed to fetch movie data.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchMovieData();
  }, [id, movieDocRef]);

  // Fungsi handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateDoc(movieDocRef, {
        title: title,
        year: Number(year),
        genre: genre,
        rating: Number(rating),
        overview: overview,
        review: review,
        
        // --- PERUBAHAN DATA SIMPAN: Tambahkan manualPosterUrl ---
        poster_path: posterPath,
        manual_poster_url: manualPosterUrl, 
        // --- AKHIR PERUBAHAN ---
      });

      navigate('/');
    } catch (err) { // Perbaikan: '}' tambahan di sini
      setError('Failed to update movie.');
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

  if (loading && !title) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Movie</h2>

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
          {loading ? 'Updating...' : 'Update Movie'}
        </button>
      </form>
    </div>
  );
};

export default EditMovie;