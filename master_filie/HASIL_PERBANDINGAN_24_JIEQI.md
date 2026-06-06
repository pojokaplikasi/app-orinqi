# 📊 HASIL PERBANDINGAN DATA 24 JIEQI

## Ringkasan Eksekutif

**Tanggal Analisis:** 26 Maret 2026  
**Dataset yang Dibandingkan:**
- **Dataset A:** `complete_jieqi_data_1909_2183.json` (Data Excel Ultra Presisi VSOP87/Kepler)
- **Dataset B:** `corrected_final_jieqi_data_1900_2150.json` (Data terintegrasi di aplikasi web)

---

## 🎯 KESIMPULAN UTAMA

### ⚠️ **DITEMUKAN PERBEDAAN SIGNIFIKAN**

**Semua 5,808 perbandingan (100%) menunjukkan perbedaan** antara kedua dataset.

#### Statistik Kunci:
- ✅ **Sama persis:** 0 (0.00%)
- ❌ **Berbeda:** 5,808 (100.00%)
- 📅 **Tahun terdampak:** 242 tahun (1909-2150)
- 🔢 **Jieqi terdampak:** 24 dari 24 Jieqi (100%)

---

## 📈 ANALISIS DETAIL

### 1. Statistik Selisih Waktu

| Metrik | Nilai |
|--------|-------|
| **Rata-rata selisih** | 776.55 jam (32.4 hari) |
| **Median selisih** | 37.56 jam (1.6 hari) |
| **Selisih minimum** | 1.3 menit |
| **Selisih maksimum** | 8,754.76 jam (364.8 hari) |

### 2. Kategori Perbedaan

| Kategori | Jumlah | Persentase |
|----------|--------|------------|
| **Kecil** (< 5 menit) | 3 | 0.1% |
| **Sedang** (5-60 menit) | 36 | 0.6% |
| **Besar** (1-24 jam) | 2,597 | 44.7% |
| **Sangat besar** (> 24 jam) | 3,172 | 54.6% |

### 3. Perbedaan Rata-Rata per Jieqi (Top 10 Terbesar)

| Jieqi | Rata-rata Selisih | Min | Max |
|-------|-------------------|-----|-----|
| **dahan** | 8,747.5 jam (364.5 hari) | 8,725.1j | 8,749.0j |
| **xiaohan** | 8,736.2 jam (364.0 hari) | 8,713.7j | 8,754.8j |
| **shuangjiang** | 96.4 jam (4.0 hari) | 65.1j | 7,033.6j |
| **hanlu** | 95.1 jam (4.0 hari) | 64.9j | 6,670.3j |
| **lidong** | 94.8 jam (3.9 hari) | 62.3j | 7,396.9j |
| **qiufen** | 90.8 jam (3.8 hari) | 61.7j | 6,306.7j |
| **xiaoxue** | 90.5 jam (3.8 hari) | 56.8j | 7,760.3j |
| **daxue** | 83.9 jam (3.5 hari) | 44.2j | 8,123.9j |
| **bailu** | 83.7 jam (3.5 hari) | 55.7j | 5,942.8j |
| **chushu** | 74.2 jam (3.1 hari) | 47.3j | 5,578.6j |

### 4. Lima Perbedaan Terkecil

Semua terjadi pada **Mangzhong (芒种)**:

1. **1941 - Mangzhong:** 77 detik (1.3 menit)
   - Excel: `1941-06-06 11:39:45`
   - Kalkulasi: `1941-06-06 11:38:28`

2. **1944 - Mangzhong:** 156 detik (2.6 menit)
   - Excel: `1944-06-06 05:12:45`
   - Kalkulasi: `1944-06-06 05:10:09`

3. **1945 - Mangzhong:** 244 detik (4.1 menit)
   - Excel: `1945-06-06 11:08:45`
   - Kalkulasi: `1945-06-06 11:04:41`

4. **1946 - Mangzhong:** 347 detik (5.8 menit)
   - Excel: `1946-06-06 16:53:45`
   - Kalkulasi: `1946-06-06 16:47:58`

5. **1942 - Mangzhong:** 417 detik (7.0 menit)
   - Excel: `1942-06-06 17:38:45`
   - Kalkulasi: `1942-06-06 17:31:48`

### 5. Lima Perbedaan Terbesar

Terjadi pada **Xiaohan (小寒)** dan **Dahan (大寒)** dengan kesalahan ~1 tahun:

1. **2024 - Xiaohan:** 8,754.76 jam (364.8 hari ≈ **1 tahun**)
   - Excel: `2025-01-04 05:16:44` ❌ (tahun salah!)
   - Kalkulasi: `2024-01-05 10:31:00` ✅

2. **2020 - Xiaohan:** 8,754.50 jam (364.8 hari ≈ **1 tahun**)
   - Excel: `2021-01-04 05:52:44` ❌ (tahun salah!)
   - Kalkulasi: `2020-01-05 11:23:00` ✅

3. **2113 - Dahan:** 8,748.99 jam (364.5 hari ≈ **1 tahun**)
   - Excel: `2114-01-20 01:38:14` ❌ (tahun salah!)
   - Kalkulasi: `2113-01-20 12:38:39` ✅

4. **2116 - Dahan:** 8,748.97 jam (364.5 hari ≈ **1 tahun**)
   - Excel: `2117-01-19 19:05:14` ❌ (tahun salah!)
   - Kalkulasi: `2116-01-21 06:07:06` ✅

5. **2109 - Dahan:** 8,748.96 jam (364.5 hari ≈ **1 tahun**)
   - Excel: `2110-01-20 02:16:14` ❌ (tahun salah!)
   - Kalkulasi: `2109-01-20 13:18:34` ✅

---

## 🔍 TEMUAN KRITIS

### ⚠️ **MASALAH SERIUS TERDETEKSI**

1. **Kesalahan Tahun pada Xiaohan & Dahan:**
   - Dataset Excel menempatkan Xiaohan dan Dahan di **tahun yang salah**
   - Contoh: Xiaohan 2024 seharusnya Januari 2024, tapi Excel menulis Januari 2025
   - Ini adalah **bug offset 1 tahun** untuk 2 Jieqi pertama setiap tahun

2. **Drift Kumulatif:**
   - Perbedaan meningkat secara sistematis sepanjang tahun
   - Awal tahun (Lichun): ~10 jam
   - Tengah tahun: ~20-30 jam
   - Akhir tahun (Dongzhi): ~75+ jam
   - Ini mengindikasikan **masalah model ΔT atau precession**

3. **Pattern Anomali:**
   - **Mangzhong** memiliki akurasi terbaik (beberapa menit)
   - **Xiaohan/Dahan** memiliki error terbesar (~1 tahun)
   - Ini menunjukkan masalah spesifik pada implementasi

---

## 📋 DAFTAR PERBEDAAN LENGKAP

File output detail tersedia:
- `comparison_differences.json` - Format JSON (programmatic analysis)
- `comparison_differences.txt` - Format teks (30,015 baris detail lengkap)

---

## 💡 REKOMENDASI

### Prioritas Tinggi 🔴

1. **FIX CRITICAL BUG - Xiaohan/Dahan Year Offset:**
   - Dataset Excel mengalami offset 1 tahun untuk Xiaohan dan Dahan
   - Ini harus dikoreksi sebelum menggunakan data tersebut
   - Kemungkinan penyebab: kesalahan handling year boundary saat generate JSON dari Excel

2. **Validasi Sumber Referensi:**
   - Bandingkan kedua dataset dengan sumber independen:
     - NASA JPL Horizons ephemeris
     - Purple Mountain Observatory (中国科学院紫金山天文台)
     - IMCCE (Institut de Mécanique Céleste et de Calcul des Éclipses)
   
3. **Investigasi Model ΔT:**
   - Cek apakah kedua dataset menggunakan ΔT model yang sama
   - Dataset kalkulasi menggunakan CAS cubic interpolation (1900-2150)
   - Dataset Excel mungkin menggunakan model berbeda

### Prioritas Sedang 🟡

4. **Verifikasi Algoritma Astronomi:**
   - Dataset Excel mengklaim menggunakan VSOP87 + Kepler
   - Dataset kalkulasi menggunakan Skyfield + DE440s ephemeris
   - Perlu cross-validation dengan standar internasional

5. **Timezone & Localization:**
   - Pastikan kedua dataset menggunakan referensi timezone yang sama
   - Dataset kalkulasi: China Standard Time (UTC+8)
   - Dataset Excel: perlu dikonfirmasi

### Prioritas Rendah 🟢

6. **Presisi Numerik:**
   - Cek floating-point precision dalam perhitungan
   - Verifikasi threshold konvergensi algoritma bisection

---

## 🎯 KESIMPULAN AKHIR

### Apakah ada perbedaan signifikan?

**YA, SANGAT SIGNIFIKAN.** 

- **100% data menunjukkan perbedaan**
- **54.6% perbedaan > 24 jam** (bahkan ada yang 1 tahun!)
- **Hanya 0.1% perbedaan < 5 menit**

### Dataset mana yang lebih akurat?

**Tidak dapat disimpulkan tanpa validasi pihak ketiga.** Namun:

✅ **Dataset Kalkulasi** (`corrected_final_jieqi_data_1900_2150.json`):
- Menggunakan Skyfield library dengan DE440s ephemeris
- Sudah dikoreksi berdasarkan referensi tertentu
- Lebih konsisten secara internal
- Tidak ada bug year offset

⚠️ **Dataset Excel** (`complete_jieqi_data_1909_2183.json`):
- Mengklaim VSOP87 + Kepler (metode high-precision)
- **TERDETEKSI BUG YEAR OFFSET** pada Xiaohan/Dahan
- Perlu investigasi lebih lanjut
- Mungkin ada masalah dalam proses export/conversion ke JSON

### Langkah Selanjutnya

1. **JANGAN gunakan Dataset Excel sebelum bug diperbaiki**
2. Lakukan validasi dengan sumber independen
3. Gunakan Dataset Kalkulasi sebagai baseline sementara
4. Dokumentasikan sumber referensi yang digunakan

---

## 📧 KONTAK UNTUK VALIDASI

Untuk validasi lebih lanjut, disarankan menghubungi:
- Purple Mountain Observatory: pmo@pmo.ac.cn
- NASA JPL Horizons: https://ssd.jpl.nasa.gov/horizons/
- IMCCE: https://www.imcce.fr/

---

**Dibuat oleh:** Automated Comparison Analysis System  
**Tools:** Python, openpyxl, json, statistical analysis  
**Waktu analisis:** < 10 detik  
**Total data points dianalisis:** 5,808
