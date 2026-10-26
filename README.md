# Wedding Plan

Aplikasi web lokal untuk merencanakan persiapan pernikahan, checklist, kebutuhan, seserahan, anggaran, pembayaran, dan vendor. Semua data disimpan di `localStorage` browser yang sedang digunakan.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

Untuk memeriksa TypeScript dan membuat build produksi:

```sh
npm run build
npm run preview
```

## Fitur

- Dashboard dengan countdown, progres persiapan dan pembayaran, ringkasan anggaran, serta deadline mendatang.
- CRUD checklist, seserahan, anggaran dan kebutuhan, transaksi pembayaran/cicilan, serta vendor.
- Filter daftar, pencarian, validasi nominal, dan konfirmasi sebelum penghapusan atau reset.
- Pembayaran dihitung dari riwayat transaksi. Total transaksi dibatasi pada sisa anggaran kebutuhan; status lunas/cicilan tidak disimpan terpisah.
- Pengaturan pasangan, tanggal pernikahan, dan target anggaran.

Data hanya tersimpan pada browser dan perangkat ini. Menghapus data browser akan menghapus salinan aplikasi.
