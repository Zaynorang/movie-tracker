import { db } from './firebase.js';

document.getElementById('add-btn').addEventListener('click', () => {
    window.location.href = 'add.html';
});

// Fetch and display movies from Firestore
getMovies();

function getMovies() {
    const movieList = document.getElementById('movie-list');
    getDocs(collection(db, 'movies'))
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const movie = doc.data();
                const movieElement = document.createElement('li');
                movieElement.innerHTML = `
                    <span>${movie.title} (${movie.year})</span>
                    <span>${movie.genre}</span>
                    <span>${movie.rating}/10</span>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                movieList.appendChild(movieElement);
            });
        })
        .catch(error => console.error('Error getting documents:', error));
}

// Handle edit and delete functionalities
// ...
