# Bazi Calculator - Dokumentasi Proyek

## 1. Ekosistem dan Tech Stack (Teknologi yang Digunakan)
Proyek ini menggunakan arsitektur **Client-Server** yang memisahkan antara antarmuka pengguna (frontend) dan mesin kalkulasi (backend).

### Backend (Mesin Kalkulasi)
* **Bahasa:** Python 3.x
* **Framework:** Flask (menyediakan RESTful API via endpoint `/calculate`).
* **Library Utama:** `datetime`, `calendar`, `dateutil.tz` (sangat krusial untuk manajemen zona waktu), `json`.
* **Fungsi Utama:** Melakukan perhitungan astronomis yang sangat presisi untuk menentukan 4 Pilar (Tahun, Bulan, Hari, Jam) dan Pilar Keberuntungan (Dayun) berdasarkan data *Jie Qi* (Solar Terms).

### Frontend (Antarmuka Pengguna)
* **Bahasa:** HTML5, CSS3, Vanilla JavaScript (tanpa framework seperti React/Vue).
* **Library UI:** Bootstrap 5.2 (untuk layout dan styling responsif), FontAwesome (untuk ikon), Animate.css (untuk animasi).
* **Fungsi Utama:** Mengumpulkan input pengguna (tanggal, waktu, zona waktu, jenis kelamin), mengirim request ke backend, merender hasil kalkulasi ke dalam bentuk visual (tabel pilar), dan **mendeteksi serta menampilkan kombinasi/interaksi** antar pilar (seperti San He, Liu Chong, dll).

### Data Layer (Database Astronomis)
* Menggunakan file JSON statis (`jieqi_ultra_precise_1909_2183_cst.json`).
* File ini berisi data 24 *Jie Qi* (Solar Terms) yang sangat presisi dari tahun 1909 hingga 2183, dihitung menggunakan algoritma VSOP87 dan Kepler. Data ini disimpan dalam zona waktu CST (China Standard Time / UTC+8).

## 2. Struktur File Utama
* **`app.py`**: Jantung dari aplikasi backend. Berisi logika untuk menghitung *Four Pillars* (Pilar Kelahiran) dan *Luck Pillars* (Pilar Keberuntungan/Dayun). File ini menangani konversi zona waktu yang kompleks agar perhitungan sesuai dengan waktu lokal pengguna.
* **`script.js`**: Otak dari frontend. Menangani event listener (tombol calculate, toggle), mengirim data ke `app.py`, dan berisi ratusan baris kode untuk **mendeteksi interaksi Bazi** (Kombinasi Batang Langit, Interaksi Cabang Bumi seperti San He, Clash, Punishment, Harm, dll).
* **`index.html`**: Struktur halaman web, form input, dan kerangka untuk menampilkan hasil (Natal Chart dan Current Pillars).
* **`style.css`**: Mengatur tampilan visual, warna elemen (Kayu=Hijau, Api=Merah, dll), dan layout pilar.
* **`jieqi_ultra_precise_1909_2183_cst.json`**: Sumber kebenaran (source of truth) untuk pergantian bulan dan tahun dalam kalender Bazi.
* **File Markdown (`FEATURE_*.md`, `FIX_*.md`)**: Dokumentasi ekstensif yang mencatat sejarah perbaikan bug dan penambahan fitur.

## 3. Alur Kerja Aplikasi (Flow)
1. **Input Pengguna:** Pengguna memasukkan Tanggal Lahir, Waktu Lahir (opsional jika "Don't Know Birth Time" dicentang), Zona Waktu Lokal (misal: WIB/UTC+7), dan Jenis Kelamin di antarmuka web (`index.html`).
2. **Validasi & Pengiriman (Frontend):** `script.js` memvalidasi input. Jika waktu tidak diketahui, sistem otomatis menggunakan jam 12:00 siang. Data dikemas dalam format JSON dan dikirim via HTTP POST ke endpoint `/calculate` di backend.
3. **Pemrosesan Backend (`app.py`):**
    * **Manajemen Zona Waktu:** Backend menerima waktu lokal pengguna. **Krusial:** Backend *tidak* mengubah waktu pengguna ke CST. Sebaliknya, saat membandingkan waktu lahir dengan data *Jie Qi* (yang berada di CST), data *Jie Qi* tersebut yang dikonversi ke zona waktu lokal pengguna.
    * **Kalkulasi Pilar Hari:** Dihitung berdasarkan jumlah hari sejak referensi (1 Jan 1900). **Aturan Khusus:** Jika waktu >= 23:00 (Jam Zi), hari otomatis berganti ke hari berikutnya.
    * **Kalkulasi Pilar Tahun & Bulan:** Backend mencari posisi waktu lahir di antara 24 *Jie Qi*. Pergantian tahun didasarkan pada titik *Lichun* (Awal Musim Semi), bukan 1 Januari atau Imlek kalender lunar.
    * **Kalkulasi Pilar Jam:** Dihitung berdasarkan siklus 2 jam tradisional (Zi, Chou, Yin, dst).
    * **Kalkulasi Dayun (Pilar Keberuntungan):** Menghitung jarak (dalam hari) dari waktu lahir ke *Jie Qi* berikutnya (jika maju) atau sebelumnya (jika mundur), lalu dikonversi menjadi umur mulai (Start Age) dengan rumus 3 hari = 1 tahun.
4. **Pengembalian Data:** Backend mengirim kembali data lengkap (Elemen, Batang Langit, Cabang Bumi, Akar Tersembunyi/Hidden Stems, 10 Gods) ke frontend dalam format JSON.
5. **Rendering & Deteksi Kombinasi (Frontend):**
    * `script.js` menerima data dan menggambar kotak-kotak pilar (Natal Chart & Current Pillars).
    * Fungsi seperti `detectAllHSCombinations` dan `detectAllBranchInteractions` berjalan untuk membandingkan setiap pilar dengan pilar lainnya.
    * Sistem mendeteksi interaksi positif (San Hui, San He, Ban He, Liu He, An He) dan negatif (Clash, Punishment, Destruction, Harm).
    * Hasil interaksi ditampilkan di bagian bawah setiap pilar dengan ikon dan warna yang sesuai (bisa di-toggle antara istilah Klasik/Pinyin atau Modern/Inggris).

## 4. Fitur & Aturan Bisnis Bazi yang Diterapkan
Proyek ini sangat memperhatikan detail aturan Bazi tradisional:
* **Transisi Hari 23:00:** Hari Bazi berganti pada jam 23:00 (awal jam Zi), bukan jam 00:00 tengah malam.
* **Akurasi Zona Waktu:** Perhitungan jam dan *Jie Qi* benar-benar menggunakan waktu lokal pengguna, bukan waktu server atau CST.
* **Kalkulasi Umur Dayun yang Presisi:** Menghitung selisih hari aktual ke *Jie Qi* terdekat, bukan menggunakan angka baku.
* **Current Day Pillar:** Menampilkan pilar hari ini secara real-time (juga mengikuti aturan transisi 23:00).
* **An He (Hidden Combinations):** Mendeteksi kombinasi tersembunyi berdasarkan *Hidden Stems* di dalam Cabang Bumi (misal: Yin-Chou, Zi-Chen).
* **Unknown Birth Time:** Jika pengguna tidak tahu jam lahirnya, sistem menggunakan jam 12 siang untuk menghitung 3 pilar pertama, dan mengosongkan Pilar Jam (serta tidak menghitung kombinasi yang melibatkan jam).
* **Classic/Modern Toggle:** Pengguna dapat memilih untuk menampilkan istilah kombinasi dalam bahasa Pinyin (Klasik) atau Bahasa Inggris (Modern).

## 5. Cara Menjalankan Aplikasi
Aplikasi ini berjalan di atas server Flask (Python). Berikut langkah-langkah untuk menjalankannya secara lokal:

1. **Persiapan Lingkungan (Prerequisites):**
   Pastikan Python 3.x sudah terinstal di sistem Anda.
   
2. **Instalasi Dependensi:**
   Buka terminal/command prompt dan instal library yang dibutuhkan:
   ```bash
   pip install flask flask-cors python-dateutil pytz
   ```

3. **Menjalankan Server:**
   Navigasi ke direktori proyek (`BAZI 01`) dan jalankan file `app.py`:
   ```bash
   cd "path/to/BAZI 01"
   python app.py
   ```
   Server Flask akan berjalan, biasanya di port `5000`.

4. **Mengakses Aplikasi:**
   Buka web browser (Chrome, Firefox, Safari, dll) dan akses alamat berikut:
   ```
   http://localhost:5000
   ```
   *(Catatan: Meskipun Anda bisa membuka file `index.html` secara langsung di browser, sangat disarankan untuk menjalankannya melalui server Flask agar API `/calculate` dapat diakses tanpa kendala CORS).*