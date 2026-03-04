# Portal Samsat Kalimantan Tengah (Internal) — Node.js + Express + EJS + PM2

Portal web bergaya **standar instansi pemerintahan** untuk kebutuhan internal (pengembangan & publikasi informasi layanan).  
Stack: **Node.js**, **Express**, **EJS**, asset lokal **Bootstrap** + **Bootstrap Icons**, siap dijalankan dengan **PM2**.

> Catatan: Repo ini ditujukan untuk **tim internal instansi**. Pastikan konten, logo, domain, serta kebijakan privasi mengikuti regulasi dan SOP yang berlaku.

---

## Fitur Utama

- Tampilan portal “instansi”:
  - Topbar (PPID / Unduhan / Pengaduan)
  - Header identitas (logo + nama instansi)
  - Navigasi utama + dropdown “Informasi Publik”
  - Breadcrumbs
  - Footer portal
- Halaman standar:
  - Beranda
  - Profil
  - Layanan
  - Berita & Pengumuman + detail
  - PPID
  - Unduhan
  - Pengaduan (form POST contoh)
  - Pencarian (cari layanan & berita)
  - Health check (`/health`)
  - 404
- Aksesibilitas dasar:
  - “Skip to content”
  - Toggle ukuran teks (A-/A+)
  - Toggle kontras
- Asset **lokal** (tanpa CDN) untuk kebutuhan audit/keamanan:
  - Bootstrap & Bootstrap Icons disalin ke `public/vendor/` via script postinstall
- Hardening sederhana:
  - Helmet (CSP ketat untuk asset lokal)
  - Compression
  - Rate limit
  - Logging (morgan)

---

## Struktur Proyek

```text
samsat-kalteng-portal/
├─ server.js
├─ ecosystem.config.js
├─ package.json
├─ .env.example
├─ scripts/
│  └─ copy-assets.js
├─ views/
│  ├─ partials/
│  │  ├─ head.ejs
│  │  ├─ topbar.ejs
│  │  ├─ header.ejs
│  │  ├─ nav.ejs
│  │  ├─ footer.ejs
│  │  └─ breadcrumbs.ejs
│  ├─ index.ejs
│  ├─ profil.ejs
│  ├─ layanan.ejs
│  ├─ berita.ejs
│  ├─ berita-detail.ejs
│  ├─ ppid.ejs
│  ├─ unduhan.ejs
│  ├─ pengaduan.ejs
│  ├─ cari.ejs
│  └─ 404.ejs
└─ public/
   ├─ css/theme.css
   ├─ js/ui.js
   ├─ img/
   │  ├─ logo-pemprov.svg
   │  ├─ logo-instansi.svg
   │  └─ logo-samsat.svg
   └─ vendor/
      ├─ bootstrap/
      └─ bootstrap-icons/