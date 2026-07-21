# 命 Orinqi — Bazi Calculator

> Kalkulator Ba Zi (八字) modern berbasis web. Masukkan tanggal & waktu lahir, dan dapatkan analisis lengkap pilar nasib, dewa sepuluh, struktur elemen, bintang keberuntungan, hingga siklus Luck Pillar — semua dalam tampilan yang bersih dan elegan.

---

## 📖 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Prasyarat](#-prasyarat)
- [Cara Instalasi & Menjalankan Proyek](#-cara-instalasi--menjalankan-proyek)
- [Struktur Folder](#-struktur-folder)
- [Cara Pengembangan](#-cara-pengembangan)
- [Perintah yang Tersedia](#-perintah-yang-tersedia)
- [Konfigurasi Firebase](#-konfigurasi-firebase)
- [Kontribusi](#-kontribusi)

---

## 🌟 Tentang Proyek

**Orinqi** adalah aplikasi web kalkulator **Ba Zi (八字)** — sistem metafisika tradisional Tiongkok yang menganalisis nasib seseorang berdasarkan tanggal dan waktu kelahiran.

Aplikasi ini dibangun dengan pendekatan **modern dan minimalis**, terinspirasi dari desain Apple, Stripe, dan Linear — sehingga terasa premium tanpa kesan "kuno" atau terlalu bernuansa Cina tradisional.

**Siapa yang bisa menggunakan ini?**
- Praktisi dan peminat Ba Zi / Feng Shui
- Siapa saja yang ingin mengetahui analisis pilar nasib mereka
- Developer yang ingin belajar atau berkontribusi

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🔢 **Kalkulasi Ba Zi** | Hitung 4 pilar (Tahun, Bulan, Hari, Jam) dari tanggal & waktu lahir |
| 🧭 **Ten Gods (Sepuluh Dewa)** | Analisis hubungan elemen antar pilar |
| 🌊 **Struktur Elemen** | Distribusi kekuatan 5 elemen (Kayu, Api, Tanah, Logam, Air) |
| ⭐ **Lucky Stars** | Bintang keberuntungan berdasarkan pilar |
| 🔄 **Luck Pillar Explorer** | Jelajahi siklus 10 tahunan (Da Yun) |
| 📅 **Pilar Hari Ini** | Tampilkan pilar tahun, bulan, dan hari saat ini secara real-time |
| 💾 **Riwayat Kalkulasi** | Simpan dan kelola riwayat perhitungan (perlu login) |
| 👤 **Autentikasi** | Login / Register dengan Firebase Auth |
| 🌙 **Dark / Light Mode** | Tema gelap dan terang |
| 📱 **Responsif** | Tampilan optimal di desktop maupun mobile |

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework utama (React) |
| [React](https://react.dev/) | 19 | Library UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Bahasa pemrograman |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling / tampilan |
| [shadcn/ui](https://ui.shadcn.com/) | — | Komponen UI siap pakai |
| [Firebase](https://firebase.google.com/) | 12 | Auth, Database, Storage |
| [Recharts](https://recharts.org/) | 3 | Grafik elemen |
| [Zod](https://zod.dev/) | 4 | Validasi form |
| [React Hook Form](https://react-hook-form.com/) | 7 | Manajemen form |
| [Day.js](https://day.js.org/) | 1 | Manipulasi tanggal |

---

## 📋 Prasyarat

Sebelum memulai, pastikan komputer kamu sudah terinstal:

1. **Node.js** versi 18 ke atas
   - Cek dengan perintah: `node --version`
   - Download di: https://nodejs.org/

2. **npm** (biasanya sudah ikut bersama Node.js)
   - Cek dengan perintah: `npm --version`

3. **Git** (untuk mengunduh kode)
   - Cek dengan perintah: `git --version`
   - Download di: https://git-scm.com/

> 💡 **Belum pernah pakai terminal?** Buka aplikasi **Terminal** (Mac/Linux) atau **Command Prompt / PowerShell** (Windows), lalu ketik perintah-perintah di bawah ini.

---

## 🚀 Cara Instalasi & Menjalankan Proyek

### Langkah 1 — Unduh kode proyek

```bash
git clone https://github.com/username/orinqi.git
cd orinqi
```

> Ganti `username/orinqi` dengan URL repositori yang sebenarnya.

### Langkah 2 — Install semua dependensi

```bash
npm install
```

> Proses ini mungkin memakan waktu 1–3 menit. Tunggu hingga selesai.

### Langkah 3 — Buat file konfigurasi environment

Buat file baru bernama `.env.local` di folder utama proyek, lalu isi dengan:

```env
# Tidak ada variabel environment tambahan yang diperlukan saat ini.
# Firebase sudah dikonfigurasi di dalam kode.
```

> Jika kamu ingin menggunakan Firebase project milikmu sendiri, lihat bagian [Konfigurasi Firebase](#-konfigurasi-firebase).

### Langkah 4 — Jalankan server pengembangan

```bash
npm run dev
```

### Langkah 5 — Buka di browser

Buka browser dan kunjungi:

```
http://localhost:3000
```

Selesai! 🎉 Aplikasi sudah berjalan di komputer kamu.

---

## 📁 Struktur Folder

```
orinqi/
├── src/
│   ├── app/                    # Halaman-halaman aplikasi (Next.js App Router)
│   │   ├── page.tsx            # Halaman utama / landing page
│   │   ├── calculate-v2/       # Halaman kalkulator Ba Zi
│   │   ├── dashboard/          # Halaman dashboard & riwayat
│   │   ├── login/              # Halaman login
│   │   └── register/           # Halaman registrasi
│   ├── components/             # Komponen UI yang dapat digunakan ulang
│   │   ├── calculate-v2/       # Komponen khusus halaman kalkulator
│   │   ├── providers/          # Context providers (Auth, Theme)
│   │   └── ui/                 # Komponen dasar (Button, Card, dll.)
│   ├── lib/                    # Logika inti & utilitas
│   │   ├── bazi/               # Algoritma kalkulasi Ba Zi
│   │   ├── bazi.ts             # Entry point kalkulasi
│   │   ├── firebase.ts         # Konfigurasi Firebase
│   │   └── utils.ts            # Fungsi utilitas umum
│   └── hooks/                  # Custom React hooks
├── public/                     # Aset statis (gambar, ikon, dll.)
├── master_filie/               # File referensi & data Jieqi (24 solar terms)
├── next.config.ts              # Konfigurasi Next.js
├── tailwind.config.ts          # Konfigurasi Tailwind CSS
├── tsconfig.json               # Konfigurasi TypeScript
└── package.json                # Daftar dependensi & skrip
```

---

## 💻 Cara Pengembangan

### Alur kerja dasar

1. **Jalankan server dev** dengan `npm run dev` — setiap perubahan kode akan langsung terlihat di browser tanpa perlu restart.

2. **Edit halaman** di folder `src/app/` — setiap folder adalah sebuah route/halaman.

3. **Buat komponen baru** di `src/components/` — komponen adalah bagian UI yang bisa dipakai ulang.

4. **Tambah logika Ba Zi** di `src/lib/bazi/` — semua algoritma perhitungan ada di sini.

### Menambah halaman baru

Buat folder baru di `src/app/`, lalu buat file `page.tsx` di dalamnya:

```
src/app/nama-halaman/page.tsx  →  http://localhost:3000/nama-halaman
```

### Menambah komponen UI baru (shadcn/ui)

```bash
npx shadcn@latest add nama-komponen
# Contoh:
npx shadcn@latest add dialog
npx shadcn@latest add calendar
```

### Mengecek error TypeScript

```bash
npm run typecheck
```

### Merapikan kode (formatting)

```bash
npm run format
```

### Mengecek kualitas kode (linting)

```bash
npm run lint
```

---

## 📜 Perintah yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan server pengembangan (mode development) |
| `npm run build` | Build aplikasi untuk produksi |
| `npm run start` | Jalankan aplikasi hasil build (mode produksi) |
| `npm run lint` | Cek kualitas kode dengan ESLint |
| `npm run format` | Rapikan format kode dengan Prettier |
| `npm run typecheck` | Cek error TypeScript tanpa build |

---

## 🔥 Konfigurasi Firebase

Proyek ini menggunakan **Firebase** untuk:
- **Authentication** — Login & Register pengguna
- **Firestore** — Database dokumen
- **Realtime Database** — Riwayat kalkulasi
- **Storage** — Penyimpanan file

Saat ini konfigurasi Firebase sudah tertanam di dalam kode (`src/lib/firebase.ts`). Jika kamu ingin menggunakan Firebase project milikmu sendiri:

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan **Authentication** (Email/Password), **Firestore**, **Realtime Database**, dan **Storage**
3. Salin konfigurasi Firebase kamu
4. Ubah nilai di `src/lib/firebase.ts` sesuai konfigurasi project kamu

---

## 🤝 Kontribusi

Ingin berkontribusi? Ikuti langkah berikut:

1. **Fork** repositori ini
2. Buat **branch** baru: `git checkout -b fitur/nama-fitur`
3. Lakukan perubahan dan **commit**: `git commit -m "feat: tambah fitur X"`
4. **Push** ke branch kamu: `git push origin fitur/nama-fitur`
5. Buat **Pull Request**

### Konvensi penamaan commit

| Prefix | Digunakan untuk |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `style:` | Perubahan tampilan/styling |
| `refactor:` | Refaktor kode (bukan fitur/bug) |
| `docs:` | Perubahan dokumentasi |
| `chore:` | Pemeliharaan (update dependensi, dll.) |

---

## ❓ Pertanyaan Umum

**Q: Aplikasi tidak bisa dibuka di browser setelah `npm run dev`?**
> Pastikan port 3000 tidak digunakan aplikasi lain. Coba akses `http://localhost:3001` jika 3000 sudah terpakai.

**Q: Error saat `npm install`?**
> Pastikan versi Node.js kamu minimal v18. Jalankan `node --version` untuk mengecek.

**Q: Bagaimana cara deploy ke internet?**
> Cara termudah adalah menggunakan [Vercel](https://vercel.com/) — platform resmi dari pembuat Next.js. Cukup hubungkan repositori GitHub kamu dan deploy otomatis.

---

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan Next.js & Firebase</p>
</div>
