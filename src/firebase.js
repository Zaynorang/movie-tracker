// Impor fungsi yang Anda perlukan dari SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

//window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

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

// --- GANTI BLOK APPCHECK LAMA ANDA DENGAN INI ---
let appCheckProvider;
const siteKey = '6LfWDP8rAAAAAMIElxrxcemzYXl_nLs0Pr8Jf-zj'; // <-- Masukkan Site Key Anda di sini

if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
  // (1) Jika di localhost, gunakan token debug
  // TODO: Ganti 'TOKEN_ANDA_DARI_LANGKAH_1' dengan token yang Anda salin
  console.log('App Check: Menggunakan Debug Token untuk localhost.');
  appCheckProvider = new ReCaptchaV3Provider({
    'sitekey': '9f833fa7-3507-4861-a030-b2fcdc6b55f5', // Ini aneh, tapi ini cara kerjanya
  });
} else {
  // (2) Jika di produksi (Netlify), gunakan reCAPTCHA
  console.log('App Check: Menggunakan reCAPTCHA v3.');
  appCheckProvider = new ReCaptchaV3Provider(siteKey);
}

initializeAppCheck(app, {
  provider: appCheckProvider,
  isTokenAutoRefreshEnabled: true
});
// --- AKHIR BLOK PENGGANTI ---

// Inisialisasi dan ekspor layanan Firebase
// 'auth' adalah untuk Autentikasi (mengelola login, signup, dll.)
// 'db' adalah untuk Firestore (database NoSQL Anda)
export const auth = getAuth(app);
export const db = getFirestore(app);