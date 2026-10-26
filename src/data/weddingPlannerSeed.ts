import type { ChecklistTask, WeddingItem } from '../types'

const estimateNote = 'Estimasi contoh untuk perencanaan, bukan harga pasar yang pasti.'

function gift(
  id: string,
  name: string,
  category: string,
  description: string,
  estimatedCost: number,
  unit = 'buah',
): WeddingItem {
  return {
    id,
    name,
    category,
    description,
    quantity: 1,
    unit,
    estimatedCost,
    actualCost: 0,
    status: 'planned',
    purchaseStatus: 'Belum Dibeli',
    personInCharge: '',
    deadline: '',
    vendor: '',
    notes: estimateNote,
  }
}

export const seserahanSeed: WeddingItem[] = [
  gift('gift-mukena', 'Mukena', 'Perlengkapan ibadah', 'Mukena untuk perlengkapan ibadah, pilihan bahan dan warna dapat disesuaikan.', 450000),
  gift('gift-sajadah', 'Sajadah', 'Perlengkapan ibadah', 'Sajadah untuk perlengkapan ibadah.', 175000),
  gift('gift-alquran', "Al-Qur'an", 'Perlengkapan ibadah', "Al-Qur'an dengan ukuran dan edisi sesuai pilihan keluarga.", 200000),
  gift('gift-perlengkapan-ibadah-lain', 'Tasbih atau perlengkapan ibadah lainnya', 'Perlengkapan ibadah', 'Pilih tasbih atau perlengkapan ibadah lain sesuai kebutuhan.', 100000),

  gift('gift-skincare', 'Skincare', 'Perawatan diri', 'Paket perawatan wajah sesuai pilihan dan kecocokan penerima.', 750000, 'paket'),
  gift('gift-makeup', 'Makeup', 'Perawatan diri', 'Kosmetik pilihan atau produk yang memang digunakan penerima.', 650000, 'paket'),
  gift('gift-body-care', 'Body care', 'Perawatan diri', 'Perlengkapan perawatan tubuh sesuai kebutuhan.', 400000, 'paket'),
  gift('gift-parfum', 'Parfum', 'Perawatan diri', 'Parfum pilihan dengan aroma yang disukai penerima.', 500000),
  gift('gift-perlengkapan-mandi', 'Perlengkapan mandi', 'Perawatan diri', 'Perlengkapan mandi pilihan untuk melengkapi hantaran.', 250000, 'paket'),

  gift('gift-baju-kain', 'Baju atau kain', 'Busana dan aksesori', 'Baju atau kain pilihan, ukuran dan motif dapat disesuaikan.', 800000, 'set'),
  gift('gift-kebaya', 'Kebaya atau pakaian pilihan', 'Busana dan aksesori', 'Kebaya atau pakaian pilihan sesuai kesepakatan pasangan.', 1500000, 'set'),
  gift('gift-tas', 'Tas', 'Busana dan aksesori', 'Tas pilihan sesuai gaya dan kebutuhan penerima.', 900000),
  gift('gift-sepatu-sandal', 'Sepatu atau sandal', 'Busana dan aksesori', 'Sepatu atau sandal pilihan, ukuran perlu dikonfirmasi.', 650000, 'pasang'),
  gift('gift-jam-tangan', 'Jam tangan', 'Busana dan aksesori', 'Jam tangan pilihan sesuai anggaran.', 1200000),
  gift('gift-aksesori', 'Aksesori', 'Busana dan aksesori', 'Aksesori pilihan yang dapat disesuaikan dengan busana.', 350000, 'set'),

  gift('gift-pakaian-tidur', 'Pakaian tidur', 'Perlengkapan pribadi', 'Pakaian tidur dengan ukuran dan bahan sesuai pilihan penerima.', 400000, 'set'),
  gift('gift-pakaian-dalam', 'Pakaian dalam', 'Perlengkapan pribadi', 'Pakaian dalam pilihan; sesuaikan ukuran dan preferensi penerima.', 350000, 'set'),
  gift('gift-pribadi-lain', 'Perlengkapan pribadi lainnya', 'Perlengkapan pribadi', 'Isi sesuai kebutuhan dan kesepakatan pasangan.', 250000, 'paket'),

  gift('gift-kue-tradisional', 'Kue tradisional', 'Makanan dan buah', 'Kue tradisional pilihan; sesuaikan jumlah dan ketahanan sajian.', 300000, 'kotak'),
  gift('gift-buah', 'Buah-buahan', 'Makanan dan buah', 'Buah segar pilihan sesuai ketersediaan dan waktu penyerahan.', 250000, 'paket'),
  gift('gift-cokelat', 'Cokelat atau makanan pilihan', 'Makanan dan buah', 'Cokelat atau makanan favorit yang dikemas dengan rapi.', 250000, 'paket'),

  gift('gift-kotak-baki', 'Kotak atau baki seserahan', 'Perlengkapan hantaran', 'Kotak atau baki untuk menata barang seserahan.', 500000, 'set'),
  gift('gift-dekorasi-hantaran', 'Dekorasi hantaran', 'Perlengkapan hantaran', 'Dekorasi hantaran sesuai konsep yang disepakati.', 400000, 'paket'),
  gift('gift-kartu-ucapan', 'Kartu ucapan', 'Perlengkapan hantaran', 'Kartu ucapan untuk melengkapi setiap hantaran.', 50000, 'lembar'),
]

export const maharSeed: WeddingItem[] = [
  { ...gift('mahar-mas-kawin', 'Mahar atau mas kawin', 'Mahar dan perlengkapan simbolis', 'Isi dan bentuk mahar dibicarakan bersama, disesuaikan dengan kesepakatan pasangan dan keluarga.', 0), collection: 'mahar' },
  { ...gift('mahar-cincin-nikah', 'Cincin nikah', 'Mahar dan perlengkapan simbolis', 'Cincin dipilih bersama; ukuran, bahan, dan anggaran belum ditentukan.', 0, 'pasang'), collection: 'mahar' },
  { ...gift('mahar-adat', 'Barang simbolis sesuai adat keluarga', 'Mahar dan perlengkapan simbolis', 'Opsional dan dapat disesuaikan atau tidak digunakan sesuai kesepakatan keluarga.', 0), collection: 'mahar' },
]

type TaskRow = readonly [
  id: string,
  title: string,
  description: string,
  category: string,
  phase: string,
  relativeDeadline: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  estimatedCost?: number,
]

const priorityMap: Record<TaskRow[6], ChecklistTask['priority']> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  urgent: 'Tinggi',
}

function task([id, title, description, category, phase, relativeDeadline, priority, estimatedCost = 0]: TaskRow): ChecklistTask {
  return {
    id,
    name: title,
    description,
    category,
    phase,
    relativeDeadline,
    deadline: '',
    priority: priorityMap[priority],
    status: 'Belum Mulai',
    assignedTo: '',
    estimatedCost,
    actualCost: 0,
    notes: '',
  }
}

const mainTaskRows: TaskRow[] = [
  ['plan-date', 'Menentukan tanggal pernikahan', 'Diskusikan beberapa pilihan tanggal dan konfirmasikan dengan keluarga serta pihak terkait.', 'Perencanaan', 'Perencanaan Awal', 'H-365', 'high'],
  ['plan-theme', 'Menentukan konsep dan tema', 'Catat konsep acara dan preferensi pasangan agar mudah dibagikan kepada vendor.', 'Perencanaan', 'Perencanaan Awal', 'H-330', 'medium'],
  ['plan-traditions', 'Mendiskusikan adat dan tradisi keluarga', 'Bahas tradisi yang ingin diikuti secara terbuka dan sesuaikan dengan kesepakatan keluarga.', 'Perencanaan', 'Perencanaan Awal', 'H-330', 'medium'],
  ['plan-budget', 'Menentukan target anggaran', 'Tentukan batas anggaran bersama dan sisihkan cadangan untuk kebutuhan tak terduga.', 'Perencanaan', 'Perencanaan Awal', 'H-320', 'high'],
  ['plan-cost-sharing', 'Menentukan pembagian biaya', 'Catat pembagian biaya yang disepakati oleh pasangan dan keluarga.', 'Perencanaan', 'Perencanaan Awal', 'H-315', 'medium'],
  ['plan-guests-estimate', 'Memperkirakan jumlah tamu', 'Buat perkiraan awal tamu dari kedua pihak untuk membantu memilih venue dan katering.', 'Perencanaan', 'Perencanaan Awal', 'H-300', 'high'],
  ['plan-venue-survey', 'Survei lokasi acara', 'Bandingkan kapasitas, akses, fasilitas, tanggal tersedia, dan biaya lokasi.', 'Venue', 'Perencanaan Awal', 'H-290', 'high'],
  ['plan-ceremony-needs', 'Menentukan kebutuhan akad atau pemberkatan', 'Konfirmasikan kebutuhan prosesi dan pihak yang perlu dihubungi sesuai pilihan pasangan.', 'Administrasi', 'Perencanaan Awal', 'H-285', 'medium'],
  ['plan-vendor-list', 'Membuat daftar vendor potensial', 'Kumpulkan referensi vendor, kontak, kisaran penawaran, serta catatan hasil riset.', 'Perencanaan', 'Perencanaan Awal', 'H-270', 'medium'],

  ['vendor-venue-booking', 'Booking gedung atau venue', 'Konfirmasikan ketersediaan tanggal, fasilitas, syarat pembayaran, dan kebijakan pembatalan.', 'Venue', 'Pemesanan Vendor', 'H-270', 'urgent'],
  ['vendor-catering', 'Memilih katering', 'Bandingkan menu, kapasitas layanan, biaya, dan opsi uji rasa.', 'Catering', 'Pemesanan Vendor', 'H-250', 'high'],
  ['vendor-decoration', 'Memesan dekorasi', 'Sepakati konsep, cakupan dekorasi, harga, dan jadwal pemasangan.', 'Dekorasi', 'Pemesanan Vendor', 'H-240', 'high'],
  ['vendor-photo-video', 'Memesan fotografer dan videografer', 'Tinjau portofolio, paket, durasi layanan, dan waktu penyerahan hasil.', 'Lain-lain', 'Pemesanan Vendor', 'H-230', 'high'],
  ['vendor-organizer', 'Memilih wedding organizer jika diperlukan', 'Bandingkan paket koordinasi dan cakupan kerja; layanan ini bersifat opsional.', 'Perencanaan', 'Pemesanan Vendor', 'H-220', 'medium'],
  ['vendor-mua', 'Memilih MUA', 'Periksa portofolio, cakupan layanan, ketersediaan tanggal, dan kebutuhan touch-up.', 'Busana', 'Pemesanan Vendor', 'H-210', 'high'],
  ['vendor-attire', 'Memilih busana pengantin', 'Tentukan busana, jadwal pengukuran, proses fitting, serta penyesuaian yang diperlukan.', 'Busana', 'Pemesanan Vendor', 'H-205', 'high'],
  ['vendor-mc-entertainment', 'Menentukan MC dan hiburan', 'Pilih pembawa acara dan hiburan yang sesuai konsep serta preferensi pasangan.', 'Lain-lain', 'Pemesanan Vendor', 'H-195', 'medium'],
  ['vendor-contracts-payments', 'Menyimpan kontrak dan bukti pembayaran vendor', 'Simpan salinan kontrak, kontak, jadwal pembayaran, dan bukti transaksi di tempat yang mudah diakses.', 'Administrasi', 'Pemesanan Vendor', 'H-180', 'high'],

  ['detail-invitation-design', 'Memilih desain undangan', 'Tentukan format, gaya, isi, dan informasi acara yang perlu dicantumkan.', 'Undangan', 'Persiapan Detail', 'H-180', 'medium'],
  ['detail-guest-list', 'Menyusun daftar tamu', 'Susun daftar tamu awal dan kelompokkan berdasarkan keluarga atau pihak pengundang.', 'Perencanaan', 'Persiapan Detail', 'H-170', 'high'],
  ['detail-decoration-design', 'Menentukan desain dekorasi', 'Tinjau referensi dan sepakati warna, titik dekorasi, serta elemen yang diperlukan.', 'Dekorasi', 'Persiapan Detail', 'H-160', 'medium'],
  ['detail-rings', 'Memilih cincin nikah', 'Pilih desain dan ukuran cincin sesuai preferensi pasangan dan ketentuan yang berlaku.', 'Seserahan', 'Persiapan Detail', 'H-150', 'medium'],
  ['detail-mahar', 'Menentukan mahar', 'Diskusikan bentuk dan persiapan mahar bersama; sesuaikan dengan kesepakatan keluarga.', 'Seserahan', 'Persiapan Detail', 'H-145', 'high'],
  ['detail-gifts', 'Membeli barang seserahan', 'Tinjau daftar seserahan bersama dan tandai barang yang dibeli sesuai kebutuhan.', 'Seserahan', 'Persiapan Detail', 'H-135', 'medium'],
  ['detail-souvenirs', 'Memilih souvenir', 'Tentukan jenis, jumlah perkiraan, dan waktu pemesanan souvenir.', 'Undangan', 'Persiapan Detail', 'H-130', 'medium'],
  ['detail-family-attire', 'Menentukan busana keluarga', 'Koordinasikan pilihan busana keluarga secara sukarela dan sesuai kenyamanan masing-masing.', 'Busana', 'Persiapan Detail', 'H-120', 'medium'],
  ['detail-marriage-documents', 'Menyiapkan dokumen persyaratan pernikahan', 'Periksa persyaratan resmi yang berlaku dan konfirmasikan kepada instansi terkait.', 'Administrasi', 'Persiapan Detail', 'H-115', 'high'],
  ['detail-run-of-show-draft', 'Menentukan susunan acara awal', 'Buat draf urutan acara dan durasi untuk dibahas bersama keluarga dan vendor.', 'Perencanaan', 'Persiapan Detail', 'H-90', 'medium'],

  ['advanced-invitations', 'Mencetak atau menyiapkan undangan digital', 'Finalisasi materi undangan dan siapkan versi cetak atau digital sesuai kebutuhan.', 'Undangan', 'Persiapan Lanjutan', 'H-90', 'high'],
  ['advanced-distribution', 'Mulai mendistribusikan undangan sesuai jadwal', 'Rencanakan distribusi undangan dengan memperhatikan waktu dan daftar tamu.', 'Undangan', 'Persiapan Lanjutan', 'H-85', 'medium'],
  ['advanced-fitting', 'Melakukan fitting busana', 'Coba busana dan catat penyesuaian yang diperlukan kepada penjahit atau vendor.', 'Busana', 'Persiapan Lanjutan', 'H-80', 'high'],
  ['advanced-makeup-trial', 'Melakukan trial makeup jika diperlukan', 'Atur percobaan rias bila diinginkan; sepakati gaya dan produk yang nyaman.', 'Busana', 'Persiapan Lanjutan', 'H-75', 'medium'],
  ['advanced-menu', 'Memfinalisasi pilihan menu', 'Tinjau menu, jumlah porsi, kebutuhan khusus tamu, dan rincian layanan katering.', 'Catering', 'Persiapan Lanjutan', 'H-75', 'high'],
  ['advanced-souvenir-order', 'Memesan souvenir', 'Konfirmasikan jumlah akhir, desain, contoh produk, harga, serta jadwal pengiriman.', 'Undangan', 'Persiapan Lanjutan', 'H-70', 'medium'],
  ['advanced-decoration-confirm', 'Mengonfirmasi kebutuhan dekorasi', 'Tinjau kembali desain, lokasi pemasangan, waktu, dan kebutuhan teknis dekorasi.', 'Dekorasi', 'Persiapan Lanjutan', 'H-65', 'medium'],
  ['advanced-reception-list', 'Menyusun daftar penerima tamu', 'Tentukan susunan penerima tamu dan bagikan informasi kontak koordinatornya.', 'Perencanaan', 'Persiapan Lanjutan', 'H-65', 'medium'],
  ['advanced-pics', 'Menentukan penanggung jawab setiap bagian acara', 'Sepakati PIC untuk tiap bagian dan pastikan pembagian tugas dapat dijalankan.', 'Perencanaan', 'Persiapan Lanjutan', 'H-60', 'high'],

  ['final-admin', 'Memeriksa kelengkapan administrasi', 'Tinjau dokumen, tenggat, dan konfirmasi persyaratan kepada instansi terkait.', 'Administrasi', 'Finalisasi', 'H-60', 'urgent'],
  ['final-vendors', 'Memastikan seluruh vendor terkonfirmasi', 'Konfirmasikan jadwal, lokasi, layanan, kontak, dan kebutuhan teknis semua vendor.', 'Perencanaan', 'Finalisasi', 'H-55', 'urgent'],
  ['final-guests', 'Memperbarui jumlah tamu', 'Perbarui jumlah tamu berdasarkan konfirmasi kehadiran dan sampaikan ke katering.', 'Perencanaan', 'Finalisasi', 'H-45', 'high'],
  ['final-rundown', 'Menyusun rundown hari H', 'Finalisasi urutan acara, durasi, PIC, dan kontak koordinator.', 'Perencanaan', 'Finalisasi', 'H-40', 'urgent'],
  ['final-seating-layout', 'Menentukan layout meja dan kursi', 'Rencanakan tata tempat duduk sesuai kapasitas dan kebutuhan akses tamu.', 'Venue', 'Finalisasi', 'H-35', 'medium'],
  ['final-bills', 'Memeriksa pembayaran dan tagihan', 'Periksa catatan transaksi, tagihan yang belum lunas, serta jadwal pelunasannya.', 'Administrasi', 'Finalisasi', 'H-30', 'urgent'],
  ['final-mahar-rings', 'Memastikan mahar dan cincin tersedia', 'Periksa kesepakatan, kondisi, dan tempat penyimpanan mahar serta cincin.', 'Seserahan', 'Finalisasi', 'H-14', 'high'],
  ['final-gifts', 'Memastikan seserahan lengkap', 'Cocokkan barang dengan daftar dan sesuaikan isi dengan kesepakatan keluarga.', 'Seserahan', 'Finalisasi', 'H-14', 'high'],
  ['final-transport', 'Menyiapkan transportasi dan akomodasi', 'Konfirmasikan kendaraan, rute, jadwal, dan kebutuhan menginap jika diperlukan.', 'Lain-lain', 'Finalisasi', 'H-14', 'medium'],
  ['final-emergency-kit', 'Menyiapkan perlengkapan darurat', 'Susun kebutuhan darurat sederhana sesuai kondisi dan kebutuhan pasangan.', 'Lain-lain', 'Finalisasi', 'H-7', 'medium'],

  ['week-vendor-arrivals', 'Mengonfirmasi kedatangan vendor', 'Pastikan setiap vendor memahami waktu kedatangan, akses venue, dan PIC yang dihubungi.', 'Perencanaan', 'Minggu Pernikahan', 'H-7', 'urgent'],
  ['week-family-briefing', 'Melakukan briefing keluarga dan panitia', 'Bagikan pembagian tugas, titik kumpul, dan kontak koordinator kepada pihak terkait.', 'Perencanaan', 'Minggu Pernikahan', 'H-6', 'high'],
  ['week-rundown-share', 'Membagikan rundown kepada pihak terkait', 'Kirim rundown terbaru kepada vendor, keluarga, dan panitia yang memerlukannya.', 'Perencanaan', 'Minggu Pernikahan', 'H-5', 'high'],
  ['week-attire-accessories', 'Memeriksa busana dan aksesori', 'Cek kelengkapan, ukuran, aksesori, dan cara membawa busana ke lokasi acara.', 'Busana', 'Minggu Pernikahan', 'H-4', 'high'],
  ['week-rings-mahar', 'Memeriksa cincin dan mahar', 'Pastikan barang tersedia dan orang yang bertanggung jawab telah ditentukan.', 'Seserahan', 'Minggu Pernikahan', 'H-3', 'urgent'],
  ['week-gifts', 'Memeriksa isi seserahan', 'Cocokkan barang yang telah dikemas dengan daftar seserahan.', 'Seserahan', 'Minggu Pernikahan', 'H-3', 'high'],
  ['week-documents', 'Menyiapkan dokumen penting', 'Kumpulkan dokumen yang diperlukan dan tentukan orang yang menyimpannya.', 'Administrasi', 'Minggu Pernikahan', 'H-3', 'urgent'],
  ['week-cash', 'Menyiapkan uang tunai untuk kebutuhan darurat', 'Siapkan jumlah sewajarnya dan tentukan PIC penyimpanannya.', 'Administrasi', 'Minggu Pernikahan', 'H-2', 'medium'],
  ['week-transport', 'Memastikan transportasi siap', 'Konfirmasikan kendaraan, pengemudi, waktu keberangkatan, dan rute.', 'Lain-lain', 'Minggu Pernikahan', 'H-2', 'high'],

  ['eve-venue', 'Memeriksa venue', 'Tinjau akses, kebersihan, fasilitas, dan kesiapan area acara bersama PIC.', 'Venue', 'Sehari Sebelum Pernikahan', 'H-1', 'urgent'],
  ['eve-decoration', 'Memeriksa dekorasi dan perlengkapan', 'Pastikan pemasangan sesuai kesepakatan dan laporkan kekurangan kepada vendor.', 'Dekorasi', 'Sehari Sebelum Pernikahan', 'H-1', 'high'],
  ['eve-rehearsal', 'Melakukan rehearsal jika diperlukan', 'Lakukan latihan singkat prosesi bila diinginkan oleh pasangan dan keluarga.', 'Perencanaan', 'Sehari Sebelum Pernikahan', 'H-1', 'medium'],
  ['eve-attire', 'Menyiapkan busana dan perlengkapan pribadi', 'Letakkan busana dan barang pribadi yang akan digunakan di tempat yang mudah dijangkau.', 'Busana', 'Sehari Sebelum Pernikahan', 'H-1', 'high'],
  ['eve-rundown', 'Mengonfirmasi rundown final', 'Sampaikan perubahan terakhir kepada koordinator dan pihak yang terkait.', 'Perencanaan', 'Sehari Sebelum Pernikahan', 'H-1', 'urgent'],
  ['eve-packing', 'Memastikan seluruh barang penting sudah dikemas', 'Gunakan daftar periksa untuk dokumen, busana, aksesori, dan barang acara.', 'Perencanaan', 'Sehari Sebelum Pernikahan', 'H-1', 'high'],
  ['eve-pics', 'Memastikan semua PIC memahami tugasnya', 'Pastikan setiap PIC mengetahui tanggung jawab dan kontak koordinator.', 'Perencanaan', 'Sehari Sebelum Pernikahan', 'H-1', 'high'],
  ['eve-couple-needs', 'Menyiapkan kebutuhan pengantin untuk hari H', 'Siapkan air minum, perlengkapan pribadi, dan kebutuhan lain yang disepakati.', 'Busana', 'Sehari Sebelum Pernikahan', 'H-1', 'medium'],

  ['day-makeup', 'Persiapan makeup dan busana pengantin', 'Ikuti jadwal persiapan yang telah disepakati dengan MUA dan penata busana.', 'Busana', 'Hari Pernikahan', 'H', 'urgent'],
  ['day-coordinator', 'Briefing terakhir dengan koordinator', 'Tinjau rundown, PIC, perubahan, dan cara komunikasi selama acara.', 'Perencanaan', 'Hari Pernikahan', 'H', 'urgent'],
  ['day-vendors', 'Memastikan vendor tiba tepat waktu', 'Sambut dan arahkan vendor sesuai akses venue dan jadwal pemasangan.', 'Perencanaan', 'Hari Pernikahan', 'H', 'urgent'],
  ['day-guests', 'Menyiapkan penerimaan tamu', 'Pastikan penerima tamu mengetahui alur, daftar, dan lokasi yang diperlukan.', 'Perencanaan', 'Hari Pernikahan', 'H', 'high'],
  ['day-ceremony', 'Melaksanakan akad nikah atau prosesi utama', 'Jalankan prosesi utama sesuai pilihan dan susunan acara yang telah disepakati.', 'Administrasi', 'Hari Pernikahan', 'H', 'urgent'],
  ['day-family-photos', 'Melaksanakan sesi foto keluarga', 'Koordinasikan urutan foto keluarga agar sesi berjalan tertib dan nyaman.', 'Lain-lain', 'Hari Pernikahan', 'H', 'medium'],
  ['day-reception', 'Menjalankan resepsi', 'Ikuti susunan resepsi dengan bantuan koordinator dan PIC acara.', 'Perencanaan', 'Hari Pernikahan', 'H', 'urgent'],
  ['day-catering', 'Memantau konsumsi dan kebutuhan tamu', 'Koordinasikan kebutuhan konsumsi dan penanganan kebutuhan khusus dengan katering.', 'Catering', 'Hari Pernikahan', 'H', 'high'],
  ['day-timeline', 'Memastikan rundown berjalan', 'Pantau perubahan jadwal dan informasikan kepada koordinator serta pihak terkait.', 'Perencanaan', 'Hari Pernikahan', 'H', 'high'],
  ['day-gifts', 'Mengatur pengumpulan hadiah dan barang penting', 'Tentukan area aman dan PIC untuk mencatat serta menyimpan barang yang diterima.', 'Perencanaan', 'Hari Pernikahan', 'H', 'medium'],
  ['day-wrap-up', 'Memeriksa barang setelah acara selesai', 'Cek barang pribadi, dokumen, perlengkapan sewa, dan barang yang perlu dibawa pulang.', 'Perencanaan', 'Hari Pernikahan', 'H', 'high'],

  ['after-bills', 'Memeriksa tagihan yang tersisa', 'Cocokkan transaksi dengan tagihan vendor dan sepakati jadwal pembayaran sisa.', 'Administrasi', 'Setelah Pernikahan', 'H+1', 'high'],
  ['after-rentals', 'Mengembalikan barang sewaan', 'Periksa daftar barang sewaan, kondisi, jadwal, dan bukti pengembalian.', 'Lain-lain', 'Setelah Pernikahan', 'H+2', 'medium'],
  ['after-media', 'Mengonfirmasi penyerahan foto dan video', 'Konfirmasikan jadwal, format, dan cara menerima hasil dokumentasi.', 'Lain-lain', 'Setelah Pernikahan', 'H+14', 'medium'],
  ['after-thanks', 'Mengucapkan terima kasih kepada keluarga dan vendor', 'Sampaikan apresiasi kepada pihak yang membantu sesuai cara yang nyaman.', 'Perencanaan', 'Setelah Pernikahan', 'H+14', 'low'],
  ['after-expenses', 'Merekap seluruh pengeluaran', 'Bandingkan catatan anggaran dengan transaksi dan simpan rekap akhir.', 'Administrasi', 'Setelah Pernikahan', 'H+21', 'medium'],
  ['after-archive', 'Mengarsipkan dokumen pernikahan', 'Simpan dokumen resmi, kontrak, kuitansi, dan berkas penting di tempat aman.', 'Administrasi', 'Setelah Pernikahan', 'H+30', 'medium'],
  ['after-other', 'Menyelesaikan tugas pascapernikahan lainnya', 'Catat dan selesaikan kebutuhan pascaacara lain yang disepakati pasangan.', 'Lain-lain', 'Setelah Pernikahan', 'H+30', 'low'],
]

export const weddingPlanTaskSeed: ChecklistTask[] = mainTaskRows.map(task)

const optionalTaskRows: TaskRow[] = [
  ['optional-song-list', 'Menentukan daftar lagu', 'Pilih lagu yang ingin digunakan dan periksa hak penggunaan bila diperlukan.', 'Lain-lain', 'Opsional', 'H-30', 'low'],
  ['optional-playlist', 'Menyiapkan playlist acara', 'Susun playlist dan bagikan instruksi pemutaran kepada PIC atau vendor audio.', 'Lain-lain', 'Opsional', 'H-14', 'low'],
  ['optional-family-dress-code', 'Menentukan dress code keluarga', 'Diskusikan dress code secara sukarela dengan keluarga dan utamakan kenyamanan.', 'Busana', 'Opsional', 'H-60', 'low'],
  ['optional-guestbook', 'Menyiapkan buku tamu', 'Tentukan media dan lokasi buku tamu serta PIC yang bertugas.', 'Undangan', 'Opsional', 'H-14', 'low'],
  ['optional-gift-box', 'Menyiapkan kotak angpao atau tempat hadiah', 'Siapkan tempat yang aman dan tunjuk PIC penyimpanan sesuai kesepakatan.', 'Perencanaan', 'Opsional', 'H-7', 'medium'],
  ['optional-emergency-kit', 'Menyiapkan emergency kit', 'Pilih perlengkapan darurat sesuai kebutuhan pribadi dan kondisi acara.', 'Lain-lain', 'Opsional', 'H-7', 'low'],
  ['optional-seating-plan', 'Menentukan denah tempat duduk', 'Siapkan denah bila dibutuhkan dan pertimbangkan aksesibilitas para tamu.', 'Venue', 'Opsional', 'H-14', 'medium'],
  ['optional-emergency-contacts', 'Menyiapkan daftar kontak darurat', 'Bagikan kontak koordinator, keluarga, dan layanan penting kepada PIC terkait.', 'Perencanaan', 'Opsional', 'H-7', 'medium'],
  ['optional-children-elderly', 'Menyiapkan kebutuhan anak atau lansia', 'Tanyakan kebutuhan akses, tempat istirahat, atau pendampingan yang diperlukan.', 'Perencanaan', 'Opsional', 'H-14', 'medium'],
  ['optional-rain-plan', 'Menyiapkan rencana cadangan jika hujan', 'Diskusikan opsi lokasi atau perlindungan dengan venue dan vendor terkait.', 'Venue', 'Opsional', 'H-14', 'medium'],
  ['optional-ring-owner', 'Menentukan siapa yang membawa cincin dan mahar', 'Tentukan orang tepercaya dan waktu penyerahan barang penting.', 'Seserahan', 'Opsional', 'H-7', 'high'],
  ['optional-documents-owner', 'Menentukan siapa yang menyimpan dokumen penting', 'Tentukan PIC, tempat penyimpanan, dan cara membawa dokumen selama acara.', 'Administrasi', 'Opsional', 'H-7', 'high'],
]

export const optionalChecklistTaskSeed: ChecklistTask[] = optionalTaskRows.map(task)

export const weddingPlannerSeed = {
  seserahan: seserahanSeed,
  mahar: maharSeed,
  tasks: weddingPlanTaskSeed,
  optionalTasks: optionalChecklistTaskSeed,
}
