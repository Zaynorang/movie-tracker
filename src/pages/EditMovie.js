import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditMovie = () => {
  // useParams() digunakan untuk mengambil parameter dari URL (yaitu :id)
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk form, mirip dengan AddMovie
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('5');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Referensi ke dokumen film yang spesifik
  const movieDocRef = doc(db, 'movies', id);

  // useEffect untuk mengambil data film yang ada saat halaman di-load
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Ambil data dokumen tunggal
        const docSnap = await getDoc(movieDocRef);

        if (docSnap.exists()) {
          // Jika dokumen ada, isi form dengan datanya
          const movieData = docSnap.data();
          setTitle(movieData.title);
          setYear(movieData.year);
          setGenre(movieData.genre);
          setRating(movieData.rating);
          setNotes(movieData.notes);
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
  }, [id]); // Hook ini bergantung pada 'id', meski 'id' seharusnya tidak berubah

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Panggil fungsi updateDoc untuk memperbarui dokumen
      await updateDoc(movieDocRef, {
        title: title,
        year: Number(year),
        genre: genre,
        rating: Number(rating),
        notes: notes,
      });

      // Jika berhasil, kembali ke dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to update movie.');
      console.error(err);
    }
    setLoading(false); // Set loading ke false di sini, di luar try/catch
  };

  // Tampilan loading
  if (loading && !title) { // Hanya tunjukkan loading saat data belum terisi
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Movie</h2>
        {error && <p className="error-message">{error}</p>}
        {/* Formulir diisi dengan data yang ada dari state */}
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
        <div className="form-group">
          <label htmlFor="notes">Notes / Comments</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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