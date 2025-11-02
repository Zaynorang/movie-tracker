# 🎬 Movie Tracker (React + Firebase)

Ini adalah aplikasi web CRUD (Create, Read, Update, Delete) lengkap yang dibuat dengan React dan Firebase. Aplikasi ini memungkinkan pengguna untuk mendaftar, masuk, dan mengelola daftar film pribadi yang telah mereka tonton.

## ✨ Fitur

* **Autentikasi Pengguna:** Pendaftaran dan Login menggunakan Firebase Authentication (Email/Password).
* **Perlindungan Rute:** Hanya pengguna yang sudah login yang dapat mengakses dashboard dan halaman CRUD.
* **Operasi CRUD Penuh:**
    * **Create:** Menambah film baru (judul, tahun, genre, rating, catatan).
    * **Read:** Menampilkan daftar film milik pengguna yang sedang login.
    * **Update:** Mengedit detail film yang ada.
    * **Delete:** Menghapus film dari daftar.
* **Data Spesifik Pengguna:** Setiap film ditautkan ke UID pengguna di Firestore, memastikan pengguna hanya dapat melihat dan mengelola film mereka sendiri.
* **Tech Stack:** React (Hooks), React Router v6, Firebase v9+ (Auth & Firestore), dan CSS murni untuk styling tema gelap.

---

## 🚀 Memulai (Setup)

Untuk menjalankan proyek ini secara lokal, Anda perlu mengatur proyek Firebase Anda sendiri terlebih dahulu.

### 1. Prasyarat

* Node.js (v14 atau lebih baru) dan npm terinstal.
* Akun Google untuk membuat proyek Firebase.

### 2. Buat Proyek Firebase

1.  Pergi ke [Firebase Console](https://console.firebase.google.com/).
2.  Klik **"Add project"** dan ikuti langkah-langkah untuk membuat proyek baru.
3.  Setelah proyek Anda siap, di dashboard proyek, klik ikon **Web** (`</>`) untuk mendaftarkan aplikasi web baru.
4.  Beri nama aplikasi Anda (misal: "movie-tracker") dan klik **"Register app"**.
5.  Firebase akan memberi Anda objek konfigurasi (`firebaseConfig`). **Salin objek ini.**

### 3. Aktifkan Layanan Firebase

Di dalam proyek Firebase Anda:

1.  **Authentication:**
    * Pergi ke tab **Authentication** di menu sebelah kiri.
    * Klik **"Get started"**.
    * Pilih **"Email/Password"** sebagai penyedia (provider) dan **Enable** lalu Simpan.
2.  **Firestore:**
    * Pergi ke tab **Firestore Database**.
    * Klik **"Create database"**.
    * Pilih **Start in test mode** (Mode Uji). *Peringatan: Ini membuat database Anda terbuka. Untuk produksi, Anda harus mengatur "Security Rules".*
    * Pilih lokasi server (misal: `us-central` atau `asia-southeast1`) dan klik **Enable**.

### 4. Konfigurasi Proyek Lokal

1.  **Clone Repositori (atau Salin Kode)**
    Jika Anda mengunduh ini, lewati langkah ini. Jika tidak:
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd movie-tracker-react
    ```

2.  **Instal Dependensi**
    Buka terminal di dalam folder `movie-tracker-react` dan jalankan:
    ```bash
    npm install
    ```

3.  **Tambahkan Konfigurasi Firebase Anda**
    * Buka file `src/firebase.js`.
    * Ganti placeholder `firebaseConfig` dengan objek konfigurasi yang Anda salin dari Firebase pada Langkah 2.

    ```javascript
    // src/firebase.js
    
    // ... impor ...
    
    // TODO: Ganti ini dengan konfigurasi Anda!
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    
    // ... sisa kode ...
    ```

### 5. Jalankan Aplikasi Secara Lokal

Setelah dependensi terinstal dan konfigurasi Firebase diatur, jalankan:

```bash
npm start