import { db } from './firebase.js';

document.getElementById('add-form').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;
    const notes = document.getElementById('notes').value;

    await addDoc(collection(db, 'movies'), {
        title,
        year,
        genre,
        rating,
        notes
    });

    window.location.href = 'index.html';
});
