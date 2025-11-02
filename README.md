# 🎬 Movie Tracker

Movie Tracker adalah aplikasi web *serverless* yang dibangun dengan React dan Firebase. Aplikasi ini memungkinkan pengguna untuk mendaftar, login, dan mengelola daftar pribadi film yang telah mereka tonton. Pengguna dapat mencari film menggunakan API TMDb untuk mengisi detail secara otomatis atau menambahkannya secara manual, dengan data yang disimpan dengan aman di Firestore.

## 💻 Technologies Used

* **Frontend:** React (Functional Components, Hooks)
* **Routing:** React Router v6
* **Backend & Database:** Firebase (Authentication, Firestore)
* **Security:** Firebase App Check dengan reCAPTCHA v3
* **External API:** The Movie Database (TMDb) untuk data dan poster film
* **Styling:** CSS (Tema gelap yang terinspirasi Netflix)

---

## ✨ Features

* **Autentikasi Pengguna:** Pendaftaran, Login, "Forgot Password", Reset Password, dan Hapus Akun yang aman.
* **Keamanan Bot:** Integrasi reCAPTCHA v3 melalui Firebase App Check untuk melindungi endpoint autentikasi dan database dari penyalahgunaan.
* **Operasi CRUD Penuh:** Fungsionalitas Create, Read, Update, dan Delete untuk semua entri film.
* **Isolasi Data:** Pengguna hanya dapat melihat dan mengelola daftar film mereka sendiri, yang diberlakukan oleh Aturan Keamanan Firestore.
* **Pencarian API TMDb:** Mencari film dari TMDb untuk mengisi Judul, Tahun, Poster, dan Sinopsis secara otomatis.
* **Entri Manual:** Opsi untuk menambahkan film secara manual, termasuk kemampuan untuk menambahkan URL poster kustom.
* **Pencegahan Duplikat:** Logika sisi klien dan server untuk mencegah penambahan film yang sama (berdasarkan judul dan tahun) berulang kali.
* **Manajemen Data:** Mengimpor dan Mengekspor seluruh daftar film Anda sebagai file `.json` untuk pencadangan.
* **UI Kustom:** Tombol *toggle* di dashboard untuk beralih antara tampilan Grid (kotak) dan tampilan List (daftar) yang responsif.
* **Pengaturan Pengguna:** Halaman khusus bagi pengguna untuk mengelola akun mereka, termasuk mengirim email reset password atau menghapus akun mereka dengan aman (memerlukan re-autentikasi).

---

## 🚀 Setup Instructions

Untuk menjalankan proyek ini secara lokal, Anda akan memerlukan kunci API dari Firebase, reCAPTCHA, dan TMDb.

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/Zaynorang/movie-tracker.git
    cd movie-tracker-react
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Setup Firebase**
    * Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
    * Tambahkan **Aplikasi Web** baru dan salin objek `firebaseConfig`.
    * Aktifkan **Authentication** -> **Sign-in method** -> **Email/Password**.
    * Aktifkan **Firestore Database** -> Buat database (misalnya dalam mode Uji).
    * **PENTING (Aturan Keamanan):** Buka **Firestore Database** -> **Rules** dan perbarui aturannya menjadi:
        ```javascript
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if request.auth != null;
            }
          }
        }
        ```
    * **PENTING (Indeks Firestore):** Anda harus membuat indeks komposit untuk pengecekan duplikat. Cara termudah adalah:
        1.  Jalankan aplikasi.
        2.  Coba tambahkan film (pastikan judul dan tahun terisi).
        3.  Cek **Browser Console (F12)**. Akan ada pesan error dari Firebase yang berisi **link panjang**.
        4.  Klik link tersebut. Ini akan membuka Firebase Console Anda dengan semua pengaturan indeks yang sudah terisi. Klik **Create Index**.
        5.  Tunggu 2-5 menit hingga indeks selesai di-build.

4.  **Setup reCAPTCHA & App Check**
    * Buka [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create).
    * Buat kunci **reCAPTCHA v3** baru. Tambahkan `localhost` ke daftar domain.
    * Salin **Site Key** dan **Secret Key**.
    * Di **Firebase Console**, buka **App Check**.
    * Pilih aplikasi web Anda, pilih **reCAPTCHA v3**, dan masukkan **Secret Key** Anda.
    * **JANGAN "Enforce"** dulu.

5.  **Setup TMDb API**
    * Buat akun di [The Movie Database (TMDb)](https://www.themoviedb.org/).
    * Di pengaturan akun Anda -> API, dapatkan **API Key (v3 auth)** Anda.

6.  **Konfigurasi Environment**
    * **a) Konfigurasi Firebase:** Buka `src/firebase.js`.
        * Tempelkan objek `firebaseConfig` Anda.
        * Ikuti instruksi di file tersebut (di blok `initializeAppCheck`) untuk menambahkan **reCAPTCHA Site Key** dan **Debug Token** untuk pengembangan `localhost`.
    * **b) Kunci TMDb:** Buat file baru di **folder root** proyek (sejajar dengan `package.json`) bernama `.env.local` dan tambahkan kunci TMDb Anda:
        ```
        REACT_APP_TMDB_API_KEY=kunci_tmdb_v3_anda_disini
        ```

7.  **Jalankan Aplikasi**
    * (Restart server Anda jika sedang berjalan agar `.env.local` termuat)
    ```bash
    npm start
    ```

8.  **Aktifkan App Check**
    * Setelah Anda mengonfirmasi aplikasi berjalan normal di `localhost` (menggunakan Debug Token Anda), kembali ke Firebase **App Check** Console dan klik **Enforce** untuk Authentication dan Firestore.

---

## 🤖 AI Support Explanation

Proyek ini dikembangkan dengan bantuan ekstensif dari asisten AI. Seluruh proses pengembangan, mulai dari pembuatan ide hingga deployment, dibimbing oleh AI.

Kontribusi AI meliputi:
* **Pembuatan Kode:** Menghasilkan kode boilerplate awal untuk semua komponen React, halaman, dan file `firebase.js`.
* **Implementasi Fitur:** Menulis logika untuk semua fitur utama, termasuk:
    * Firebase (v9+) kueri untuk autentikasi dan operasi CRUD.
    * Integrasi API TMDb untuk pencarian dan pengisian otomatis data.
    * Fungsionalitas Impor/Ekspor JSON.
    * Logika untuk pencegahan duplikat, Hapus Akun, dan Reset Password.
* **Styling:** Menyediakan kode CSS untuk seluruh tema gelap (dark theme) yang terinspirasi dari Netflix.
* **Debugging:** Membantu memecahkan masalah error terkait Firebase Security Rules, penyiapan reCAPTCHA/App Check, masalah CORS, dan kesalahan konfigurasi deployment Netlify (seperti file `_redirects` dan `netlify.toml`).