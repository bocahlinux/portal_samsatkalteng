const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const SITE_NAME = process.env.SITE_NAME || "Portal Samsat Kalimantan Tengah";
const ORG_LINE = process.env.ORG_LINE || "Pemerintah Provinsi Kalimantan Tengah";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.set("trust proxy", 1);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  helmet({
    // Karena semua asset kita lokal, CSP bisa lebih ketat.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "font-src": ["'self'"],
      },
    },
  })
);
app.use(compression());
app.use(morgan("combined"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 180,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public"), { maxAge: "7d" }));

app.use((req, res, next) => {
  res.locals.siteName = SITE_NAME;
  res.locals.orgLine = ORG_LINE;
  res.locals.baseUrl = BASE_URL;
  res.locals.path = req.path;
  res.locals.year = new Date().getFullYear();
  next();
});

// ===== Data contoh (ganti ke DB/CMS kalau sudah) =====
const layanan = [
  {
    slug: "pengesahan-tahunan",
    name: "Pengesahan STNK Tahunan",
    ringkas: "Pengesahan STNK dan pembayaran PKB tahunan.",
    persyaratan: ["KTP sesuai STNK", "STNK asli", "BPKB (jika diminta)"],
    estimasi: "± 15–30 menit (tergantung antrean)",
  },
  {
    slug: "perpanjangan-5-tahunan",
    name: "Perpanjangan 5 Tahunan / Ganti TNKB",
    ringkas: "Perpanjangan 5 tahunan termasuk ganti plat.",
    persyaratan: ["KTP", "STNK", "BPKB", "Cek fisik kendaraan"],
    estimasi: "± 60–120 menit",
  },
  {
    slug: "balik-nama",
    name: "Balik Nama Kendaraan (BBN)",
    ringkas: "Perubahan kepemilikan kendaraan sesuai ketentuan.",
    persyaratan: ["KTP", "STNK", "BPKB", "Dokumen jual-beli/pendukung"],
    estimasi: "Sesuai verifikasi berkas",
  },
];

const unduhan = [
  { name: "Formulir Permohonan Layanan (PDF)", file: "#", size: "—" },
  { name: "Maklumat Pelayanan (PDF)", file: "#", size: "—" },
  { name: "Standar Pelayanan (PDF)", file: "#", size: "—" },
];

const berita = [
  {
    slug: "pengumuman-jam-layanan",
    title: "Pengumuman Jam Layanan",
    date: "2026-03-04",
    content:
      "Jam layanan menyesuaikan kebijakan operasional. Informasi rinci dapat disampaikan melalui kanal resmi dan pengumuman di kantor layanan.",
    tags: ["Pengumuman"],
  },
  {
    slug: "imbauan-pembayaran-tepat-waktu",
    title: "Imbauan Pembayaran Pajak Tepat Waktu",
    date: "2026-02-20",
    content:
      "Pembayaran tepat waktu membantu kelancaran pelayanan publik dan pembangunan daerah. Silakan gunakan kanal pembayaran yang tersedia sesuai ketentuan.",
    tags: ["Informasi"],
  },
];

// ===== Routes =====
app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Beranda",
    breadcrumbs: [],
    layananUnggulan: layanan.slice(0, 3),
    beritaTerbaru: berita.slice(0, 3),
    statistik: [
      { label: "Kanal Layanan", value: "Samsat Induk, Gerai, Keliling" },
      { label: "Ketersediaan", value: "Jam kerja (sesuai kebijakan)" },
      { label: "Pengaduan", value: "Terintegrasi/kanal resmi instansi" },
    ],
  });
});

app.get("/profil", (req, res) => {
  res.render("profil", {
    pageTitle: "Profil",
    breadcrumbs: [{ name: "Profil", href: "/profil" }],
  });
});

app.get("/layanan", (req, res) => {
  res.render("layanan", {
    pageTitle: "Layanan",
    breadcrumbs: [{ name: "Layanan", href: "/layanan" }],
    layanan,
  });
});

app.get("/berita", (req, res) => {
  res.render("berita", {
    pageTitle: "Berita & Pengumuman",
    breadcrumbs: [{ name: "Berita", href: "/berita" }],
    berita,
  });
});

app.get("/berita/:slug", (req, res) => {
  const item = berita.find((b) => b.slug === req.params.slug);
  if (!item) return res.status(404).render("404", { pageTitle: "Tidak ditemukan", breadcrumbs: [] });

  res.render("berita-detail", {
    pageTitle: item.title,
    breadcrumbs: [
      { name: "Berita", href: "/berita" },
      { name: item.title, href: `/berita/${item.slug}` },
    ],
    item,
  });
});

app.get("/ppid", (req, res) => {
  res.render("ppid", {
    pageTitle: "PPID",
    breadcrumbs: [{ name: "PPID", href: "/ppid" }],
  });
});

app.get("/unduhan", (req, res) => {
  res.render("unduhan", {
    pageTitle: "Unduhan",
    breadcrumbs: [{ name: "Unduhan", href: "/unduhan" }],
    unduhan,
  });
});

app.get("/pengaduan", (req, res) => {
  res.render("pengaduan", {
    pageTitle: "Pengaduan",
    breadcrumbs: [{ name: "Pengaduan", href: "/pengaduan" }],
    sent: req.query.sent === "1",
  });
});

// contoh submit (internal bisa diarahkan ke ticketing / helpdesk)
app.post("/pengaduan", (req, res) => {
  // TODO: validasi + simpan ke DB / forward ke sistem pengaduan
  // Jangan simpan data sensitif tanpa kebijakan & SOP.
  return res.redirect("/pengaduan?sent=1");
});

app.get("/cari", (req, res) => {
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const beritaHit = q ? berita.filter(b => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)) : [];
  const layananHit = q ? layanan.filter(l => l.name.toLowerCase().includes(q) || l.ringkas.toLowerCase().includes(q)) : [];
  res.render("cari", {
    pageTitle: "Pencarian",
    breadcrumbs: [{ name: "Pencarian", href: "/cari" }],
    q,
    beritaHit,
    layananHit
  });
});

app.get("/health", (req, res) => res.json({ ok: true, name: SITE_NAME, time: new Date().toISOString() }));

// Rute khusus untuk melayani file verifikasi Meta/Facebook
app.get("/v84tlhlgfv26ch7jflcoa9ekk29pfy.html", (req, res) => {
  res.sendFile(path.join(__dirname, "v84tlhlgfv26ch7jflcoa9ekk29pfy.html"));
});

app.use((req, res) => res.status(404).render("404", { pageTitle: "Halaman Tidak Ditemukan", breadcrumbs: [] }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Terjadi kesalahan pada server.");
});

app.listen(PORT, () => console.log(`[OK] ${SITE_NAME} running on :${PORT}`));