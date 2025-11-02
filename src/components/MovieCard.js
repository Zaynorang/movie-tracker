import React from 'react';
import { Link } from 'react-router-dom';

// Menerima prop 'movie' (data film) dan 'onDelete' (fungsi delete)
const MovieCard = ({ movie, onDelete }) => {
  return (
    <div className="movie-card">
      <div className="movie-card-header">
        <h3>
          {movie.title} ({movie.year})
        </h3>
        <span className="movie-card-rating">⭐ {movie.rating}/10</span>
      </div>
      <p className="movie-card-genre">
        <strong>Genre:</strong> {movie.genre}
      </p>
      <p className="movie-card-notes">
        <strong>Notes:</strong> {movie.notes || 'No notes added.'}
      </p>
      <div className="movie-card-actions">
        {/* Link untuk mengedit, mengarahkan ke /edit/ID_FILM */}
        <Link to={`/edit/${movie.id}`} className="btn btn-secondary">
          Edit
        </Link>
        {/* Tombol untuk menghapus, memanggil fungsi onDelete dengan ID film */}
        <button onClick={() => onDelete(movie.id)} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default MovieCard;