# Dokumentasi Modul Bazi (Frontend Logic)

Modul ini berisi logika frontend untuk Kalkulator Bazi, yang sebelumnya berada di dalam satu file monolitik `script.js`. Modul ini telah dipecah menjadi beberapa file TypeScript yang modular untuk memudahkan pemeliharaan dan pengembangan di dalam ekosistem Next.js.

**Penting:** Modul ini *tidak* melakukan perhitungan astronomi dasar (seperti menentukan 4 Pilar utama dari tanggal lahir). Perhitungan astronomi yang presisi (menggunakan data Jieqi) dilakukan oleh backend (sebelumnya Flask `app.py`, sekarang API Routes Next.js di `src/app/api/`). Modul ini menerima hasil dari backend dan melakukan perhitungan astrologi sekunder (Bintang, Elemen, Kombinasi, dll).

## Struktur File dan Tanggung Jawab

### 1. `constants.ts`
File ini adalah sumber kebenaran tunggal (Single Source of Truth) untuk semua data statis dan konstanta Bazi.
*   **Isi:**
    *   `HEAVENLY_STEMS` (10 Batang Langit) & `EARTHLY_BRANCHES` (12 Cabang Bumi).
    *   `GANZHI_COMBINATIONS` (Siklus 60 Jiazi).
    *   `NAYIN_TABLE` & `NAYIN_CLASSIC_NAMES` (Elemen Suara / Na Yin).
    *   `LIFECYCLE_TABLE`, `LIFE_CYCLES_ENGLISH`, `LIFE_CYCLES_PINYIN` (12 Fase Kehidupan / 12 Life Stages).
    *   `HIDDEN_STEMS_MAP` (Batang Tersembunyi di dalam Cabang Bumi).
    *   Pemetaan warna elemen (`ELEMENT_COLORS`) dan asosiasi cabang ke elemen (`BRANCH_ASSOCIATIONS`).
*   **Cara Kerja:** Hanya mengekspor objek dan array konstan. Tidak ada logika dinamis di sini.

### 2. `pillar-calculations.ts`
File ini menangani perhitungan pilar yang sedang berjalan (Current Transiting Pillars) berdasarkan waktu saat ini (real-time) atau waktu yang dipilih pengguna.
*   **Fungsi Utama:**
    *   `calculateCurrentYearPillar`, `calculateCurrentMonthPillar`, `calculateCurrentDayPillar`: Menghitung pilar Tahun, Bulan, dan Hari saat ini. Algoritmanya menggunakan offset dari tahun referensi (1984 untuk Tahun, 1900 untuk Hari) dan memperhitungkan transisi bulan Cina (Jieqi).
    *   `calculateCurrentLuckPillar`: Menentukan Pilar Keberuntungan (Dayun) mana yang sedang aktif berdasarkan umur pengguna saat ini.
*   **Fungsi Helper:**
    *   `getNayinFromStemBranch`, `formatLifeCycleName`: Mengambil data Na Yin dan 12 Fase Kehidupan dari `constants.ts` berdasarkan kombinasi Batang dan Cabang.

### 3. `lucky-stars.ts`
File ini khusus menangani perhitungan Bintang Keberuntungan (Shen Sha) dan Kong Wang (Kekosongan).
*   **Fungsi Utama:** `calculateLuckyStars(fourPillars, currentPillars)`
*   **Algoritma:**
    *   Mengekstrak *Day Master* (Batang Hari) dan Cabang-cabang penting (Tahun, Bulan, Hari).
    *   Mencocokkan dengan aturan tradisional:
        *   *Nobleman* (Tian Yi Gui Ren) & *Intelligence* (Wen Chang) dihitung berdasarkan *Day Master*.
        *   *Peach Blossom* (Xian Chi), *Sky Horse* (Yi Ma), & *Solitary* (Gu Chen) dihitung berdasarkan *Day Branch* (Cabang Hari).
        *   *Heavenly Doctor* (Tian Yi) dihitung berdasarkan *Month Branch* (Cabang Bulan).
        *   *Kong Wang* (Dead Emptiness) dihitung berdasarkan posisi Pilar Hari dalam siklus 60 Jiazi (mencari 2 cabang yang kosong dalam kelompok 10/Xun).

### 4. `combinations.ts`
File ini adalah mesin pendeteksi interaksi (Kombinasi, Bentrokan, Hukuman) antar pilar.
*   **Isi:** Mendefinisikan array aturan untuk *San Hui* (Seasonal), *San He* (Harmony), *Liu He* (Six Harmony), *Liu Chong* (Clash), *Xing* (Punishments), *Po* (Destruction), *Hai* (Harm), dan *An He* (Hidden Combinations).
*   **Fungsi Utama:**
    *   `detectAllHSCombinations`: Memeriksa setiap pasangan Batang Langit (Heavenly Stems) di semua pilar (Natal + Current) untuk mencari kombinasi 5 elemen.
    *   `detectAllBranchInteractions`: Memeriksa setiap pasangan Cabang Bumi di semua pilar. Fungsi ini memanggil fungsi-fungsi pengecekan spesifik (seperti `canFormThreeHarmony`, `canFormClash`) untuk setiap pasangan.
*   **Cara Kerja:** Menggunakan *nested loop* (O(N^2)) untuk membandingkan setiap pilar dengan pilar lainnya, mengembalikan objek yang memetakan setiap pilar ke daftar interaksinya.

### 5. `element-analysis.ts`
File ini menangani analisis mendalam terhadap komposisi elemen dan hubungan 10 Dewa (10 Gods / Shi Shen).
*   **Fungsi Utama:**
    *   `calculateElementStructure`: Menghitung persentase 5 Elemen (Kayu, Api, Tanah, Logam, Air) untuk Radar Chart.
        *   **Algoritma (Weighted Method):** Batang Langit bernilai 1.0. Cabang Bumi dipecah menjadi Batang Tersembunyi (Hidden Stems). *Main Qi* bernilai 0.7 (atau 1.0/0.8 tergantung cabang), *Sub Main Qi* bernilai 0.2, *Residual Qi* bernilai 0.1.
        *   Menghitung dua set data: *Natal* (hanya 4 pilar kelahiran) dan *Annual* (4 pilar kelahiran + pilar saat ini).
    *   `calculateTenGods`: Menghitung poin kekuatan untuk masing-masing dari 10 Dewa.
        *   **Algoritma:** Membandingkan setiap elemen (Batang Langit dan Batang Tersembunyi) dengan *Day Master*. Menggunakan siklus 5 Elemen (Menghasilkan/Dikontrol) dan polaritas (Yin/Yang) untuk menentukan nama Dewa (misal: Elemen sama beda polaritas = *Rob Wealth*).
        *   Bobot poin yang digunakan sama dengan `calculateElementStructure`.

---

## Catatan Migrasi dari `script.js` (Legacy)

1.  **Pemisahan UI dan Logika:** Di `script.js` lama, logika perhitungan bercampur aduk dengan manipulasi DOM (`document.getElementById`, `innerHTML`). Dalam modul TypeScript ini, **semua manipulasi DOM telah dihapus**. Fungsi-fungsi ini sekarang murni mengembalikan struktur data (JSON/Objects) yang siap digunakan oleh komponen React.
2.  **Tipe Data:** Meskipun belum menggunakan *strict typing* secara menyeluruh (masih banyak menggunakan `any`), struktur data telah dirapikan.
3.  **Penghapusan Variabel Global:** Variabel global seperti `combinationStyle` atau `currentLanguage` yang ada di `script.js` tidak lagi digunakan di dalam logika inti. Preferensi tampilan (Klasik vs Modern) sekarang harus di-handle di tingkat komponen React dan dilempar sebagai parameter jika diperlukan (lihat `formatLifeCycleName`).
4.  **Ketergantungan:** Modul ini dirancang untuk bekerja secara sinkron dengan hasil dari API Backend (`/api/calculate`). Pastikan struktur data yang dikembalikan oleh API cocok dengan yang diharapkan oleh fungsi-fungsi di sini (terutama struktur `four_pillars` dan `luck_pillars`).

## Panduan untuk Agent Selanjutnya

Jika Anda diminta untuk:
*   **Menambah Bintang Baru (Shen Sha):** Buka `lucky-stars.ts`. Tambahkan aturan pemetaannya, lalu masukkan ke dalam objek `stars` yang dikembalikan.
*   **Mengubah Bobot Elemen (Radar Chart):** Buka `element-analysis.ts`, cari fungsi `calculateElementStructure`, dan modifikasi variabel `mainQiWeight`, `subMainQiWeight`, dll.
*   **Menambah Aturan Kombinasi Baru:** Buka `combinations.ts`. Tambahkan konstanta array baru di bagian atas, buat fungsi `canForm...` baru, dan daftarkan fungsi tersebut di dalam array `checks` di dalam `detectAllBranchInteractions`.
*   **Memperbaiki Teks/Terjemahan:** Buka `constants.ts`.

## Catatan Penting Terkait Tampilan (UI) yang Belum Diimplementasikan

Karena modul ini hanya berisi logika murni (pure functions), ada beberapa fitur visual dari `script.js` lama yang **harus diimplementasikan ulang di sisi komponen React (Frontend)**:

1.  **Warna Elemen Dinamis:** Di `script.js`, warna teks berubah sesuai elemen (Kayu = Hijau, Api = Merah, dll). Anda harus menggunakan konstanta `ELEMENT_COLORS` dari `constants.ts` untuk mengatur *inline style* atau *Tailwind classes* di komponen React Anda.
2.  **Radar Chart (Chart.js):** Fungsi `displayElementStructure` di `script.js` lama menggunakan library `Chart.js` untuk menggambar grafik jaring laba-laba (Radar Chart). Di Next.js, Anda perlu menginstal library seperti `react-chartjs-2` atau `recharts` dan menggunakan data dari `calculateElementStructure` untuk merender grafik tersebut.
3.  **Indikator Bintang Keberuntungan (Emoji):** Di `script.js`, emoji bintang (👑, 🎓, 🌸) ditumpuk di atas Cabang Bumi. Logika ini harus dibangun ulang di komponen React dengan mengecek hasil dari `calculateLuckyStars` dan merender elemen absolut di atas komponen Pilar.
4.  **Interaksi Drill-Down (Klik Pilar):** Fitur di mana pengguna mengklik Pilar Keberuntungan (Luck Pillar) untuk melihat Tahun/Bulan/Hari di bawahnya (`handleLuckPillarClick`, dll) harus diimplementasikan menggunakan *React State* (`useState`). State ini akan menyimpan indeks pilar yang sedang aktif dan merender ulang komponen anak di bawahnya.
5.  **Toggle Klasik/Modern:** Fitur untuk mengubah bahasa (Pinyin vs Inggris) harus menggunakan *React State* yang diteruskan sebagai *props* ke komponen-komponen yang merender teks (menggunakan fungsi `formatLifeCycleName` dan `formatNayinName` dengan parameter style).
6.  **Mode "Tidak Tahu Waktu Lahir":** Jika mode ini aktif, komponen React harus secara kondisional menyembunyikan (tidak merender) komponen Pilar Jam (Hour Pillar) dan tidak mengirimkan data jam ke fungsi kalkulasi kombinasi.
