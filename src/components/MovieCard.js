import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, onDelete }) => {
  const tmdbPosterBaseUrl = 'https://image.tmdb.org/t/p/w185';

  let posterUrl = 'https://via.placeholder.com/185x278.png?text=No+Poster'; // Default placeholder

  // Prioritaskan URL poster manual jika ada
  if (movie.manual_poster_url) {
    posterUrl = movie.manual_poster_url;
  } 
  // Jika tidak ada manual, gunakan poster_path dari TMDb jika ada
  else if (movie.poster_path) {
    posterUrl = `${tmdbPosterBaseUrl}${movie.poster_path}`;
  }

  return (
    <div className="movie-card">
      <div className="movie-card-content">
        <div className="movie-card-image">
          <img src={posterUrl} alt={movie.title} />
        </div>
        <div className="movie-card-details">
          <div className="movie-card-header">
            <h3>
              {movie.title} ({movie.year})
            </h3>
            <span className="movie-card-rating">⭐ {movie.rating}/10</span>
          </div>
          <p className="movie-card-genre">
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p className="movie-card-overview">
            <strong>Overview:</strong> {movie.overview || 'No overview available.'}
          </p>
          <p className="movie-card-review">
            <strong>My Review:</strong> {movie.review || 'No review added.'}
          </p>
        </div>
      </div>
      <div className="movie-card-actions">
        <Link to={`/edit/${movie.id}`} className="btn btn-secondary">
          Edit
        </Link>
        <button onClick={() => onDelete(movie.id)} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default MovieCard;