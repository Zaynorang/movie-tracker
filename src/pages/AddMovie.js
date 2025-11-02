import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddMovie = () => {
  // State untuk setiap field dalam form
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('5'); // Default rating 5
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi yang dipanggil saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Dapatkan ID pengguna yang sedang login
      const userId = auth.currentUser.uid;
      if (!userId) {
        throw new Error('No user is logged in.');
      }

      // Panggil fungsi addDoc untuk menambahkan dokumen baru
      // ke koleksi 'movies'
      await addDoc(collection(db, 'movies'), {
        title: title,
        year: Number(year), // Pastikan tahun adalah angka
        genre: genre,
        rating: Number(rating), // Pastikan rating adalah angka
        notes: notes,
        userId: userId, // <-- KUNCI: Tautkan film ini ke pengguna
        createdAt: serverTimestamp(), // Tambahkan stempel waktu
      });

      // Jika berhasil, kembali ke dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to add movie. ' + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add New Movie</h2>
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
        <div className="form-group">
          <label htmlFor="notes">Notes / Comments</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovie;