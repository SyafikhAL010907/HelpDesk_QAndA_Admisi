import { CannedResponse } from './chatTypes';

export const cannedResponses: CannedResponse[] = [
  {
    id: 'c1',
    category: 'Pendaftaran',
    keyword: 'CARA DAFTAR',
    question: 'Cara daftar Admin Admisi UNJ?',
    response: 'Untuk pendaftaran, silakan buka portal resmi Admisi UNJ, buat akun menggunakan email aktif, lalu lengkapi biodata dan unggah dokumen yang diminta.',
  },
  {
    id: 'c2',
    category: 'Pendaftaran',
    keyword: 'JADWAL',
    question: 'Kapan jadwal pendaftaran dibuka?',
    response: 'Jadwal pendaftaran Admisi UNJ 2026 dapat dilihat pada menu Jadwal Ujian di halaman beranda atau melalui media sosial resmi UNJ.',
  },
  {
    id: 'c3',
    category: 'Dokumen',
    keyword: 'KTP',
    question: 'Apakah KTP harus dilegalisir?',
    response: 'Berkas KTP tidak perlu dilegalisir. Cukup unggah hasil scan asli yang berwarna dan pastikan seluruh teks terbaca dengan jelas.',
  },
  {
    id: 'c4',
    category: 'Dokumen',
    keyword: 'IJAZAH',
    question: 'Bagaimana jika Ijazah belum terbit?',
    response: 'Jika Ijazah belum terbit, Anda dapat menggunakan Surat Keterangan Lulus (SKL) yang mencantumkan nilai rapor atau nilai ujian sekolah.',
  },
  {
    id: 'c5',
    category: 'Pembayaran',
    keyword: 'METODE BAYAR',
    question: 'Bagaimana cara membayar biaya pendaftaran?',
    response: 'Pembayaran dapat dilakukan melalui Virtual Account Bank Mandiri, BNI, atau BTN. Panduan lengkap tersedia di menu Biaya UKT.',
  },
  {
    id: 'c6',
    category: 'Pembayaran',
    keyword: 'KONFIRMASI',
    question: 'Apakah harus konfirmasi setelah bayar?',
    response: 'Sistem akan melakukan verifikasi otomatis dalam 1x24 jam. Jika status belum berubah setelah 24 jam, silakan hubungi admin dengan melampirkan bukti bayar.',
  },
  {
    id: 'c7',
    category: 'Teknis',
    keyword: 'GANTI PASSWORD',
    question: 'Lupa password akun?',
    response: 'Silakan gunakan fitur "Lupa Password" di halaman login. Tautan pengaturan ulang password akan dikirimkan ke email Anda.',
  },
  {
    id: 'c8',
    category: 'Teknis',
    keyword: 'ERROR SISTEM',
    question: 'Halaman web tidak bisa diakses?',
    response: 'Pastikan koneksi internet stabil dan gunakan browser Google Chrome versi terbaru. Bersihkan cache browser jika masalah berlanjut.',
  },
];
