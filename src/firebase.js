// Impor fungsi yang Anda perlukan dari SDK
import { initializeApp }s from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Tambahkan konfigurasi Firebase proyek Anda di sini
// (Anda bisa mendapatkannya dari konsol Firebase Anda)
const firebaseConfig = {
  apiKey: "AIzaSyAOJRg1Dgw3-N8Ic4ewMYhEW7mtPsadUcI",
  authDomain: "movie-tracker-59561.firebaseapp.com",
  projectId: "movie-tracker-59561",
  storageBucket: "movie-tracker-59561.firebasestorage.app",
  messagingSenderId: "1096261266349",
  appId: "1:1096261266349:web:127be7dd18ee4a07298f24"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi dan ekspor layanan Firebase
// 'auth' adalah untuk Autentikasi (mengelola login, signup, dll.)
// 'db' adalah untuk Firestore (database NoSQL Anda)
export const auth = getAuth(app);
export const db = getFirestore(app);