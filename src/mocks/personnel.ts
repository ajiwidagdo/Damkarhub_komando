import type { Personnel, FleetUnit, SurveyRating, LeaderboardEntry } from '../types'

export const mockPersonnel: Personnel[] = [
  { id: 'p01', nama: 'Andi Pratama', pangkat: 'Pengatur', jabatan: 'Komandan Regu', regu: 'Regu 1', no_hp: '081234567890', dispatch_active: true, total_laporan: 42 },
  { id: 'p02', nama: 'Budi Santoso', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 1', no_hp: '081234567891', dispatch_active: true, total_laporan: 38 },
  { id: 'p03', nama: 'Citra Dewi', pangkat: 'Penata Muda', jabatan: 'Anggota', regu: 'Regu 1', no_hp: '081234567892', dispatch_active: true, total_laporan: 35 },
  { id: 'p04', nama: 'Dedi Kurniawan', pangkat: 'Pengatur', jabatan: 'Komandan Regu', regu: 'Regu 2', no_hp: '081234567893', dispatch_active: true, total_laporan: 40 },
  { id: 'p05', nama: 'Eka Putri', pangkat: 'Penata Muda', jabatan: 'Anggota', regu: 'Regu 2', no_hp: '081234567894', dispatch_active: true, total_laporan: 31 },
  { id: 'p06', nama: 'Fajar Nugroho', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 2', no_hp: '081234567895', dispatch_active: false, total_laporan: 29 },
  { id: 'p07', nama: 'Gita Lestari', pangkat: 'Penata', jabatan: 'Komandan Regu', regu: 'Regu 3', no_hp: '081234567896', dispatch_active: true, total_laporan: 44 },
  { id: 'p08', nama: 'Hendra Gunawan', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 3', no_hp: '081234567897', dispatch_active: true, total_laporan: 33 },
  { id: 'p09', nama: 'Irfan Maulana', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 3', no_hp: '081234567898', dispatch_active: true, total_laporan: 27 },
  { id: 'p10', nama: 'Joko Susilo', pangkat: 'Penata Muda', jabatan: 'Sopir', regu: 'Regu 1', no_hp: '081234567899', dispatch_active: true, total_laporan: 36 },
  { id: 'p11', nama: 'Kartika Sari', pangkat: 'Pengatur', jabatan: 'Operator', regu: 'Regu 2', no_hp: '081234567900', dispatch_active: false, total_laporan: 22 },
  { id: 'p12', nama: 'Lukman Hakim', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 3', no_hp: '081234567901', dispatch_active: true, total_laporan: 30 },
  { id: 'p13', nama: 'Maya Anggraini', pangkat: 'Penata Muda', jabatan: 'Anggota', regu: 'Regu 1', no_hp: '081234567902', dispatch_active: true, total_laporan: 25 },
  { id: 'p14', nama: 'Nanda Pratama', pangkat: 'Pengatur', jabatan: 'Anggota', regu: 'Regu 2', no_hp: '081234567903', dispatch_active: false, total_laporan: 19 },
  { id: 'p15', nama: 'Rina Wulandari', pangkat: 'Penata', jabatan: 'Admin', regu: '-', no_hp: '081234567904', dispatch_active: false, total_laporan: 0 },
]

export const mockFleet: FleetUnit[] = [
  { id: 'f01', nama: 'Unit Pancar 1', jenis: 'Mobil Pancar', plat: 'Z 8001 A', status: 'siap', keterangan: 'Kondisi prima' },
  { id: 'f02', nama: 'Unit Pancar 2', jenis: 'Mobil Pancar', plat: 'Z 8002 A', status: 'tugas', keterangan: 'Sedang di lokasi Kebakaran Lahan' },
  { id: 'f03', nama: 'Unit Rescue', jenis: 'Mobil Rescue', plat: 'Z 8003 A', status: 'siap', keterangan: 'Peralatan lengkap' },
  { id: 'f04', nama: 'Unit Tangga', jenis: 'Mobil Tangga', plat: 'Z 8004 A', status: 'perawatan', keterangan: 'Servis hidrolik' },
  { id: 'f05', nama: 'Unit Ambulans', jenis: 'Ambulans', plat: 'Z 8005 A', status: 'siap', keterangan: 'BBM penuh' },
  { id: 'f06', nama: 'Motor Trail 1', jenis: 'Motor', plat: 'Z 6001 A', status: 'siap', keterangan: 'Akses gang sempit' },
]

export const mockRatings: SurveyRating[] = [
  { rating: 5, count: 48 },
  { rating: 4, count: 27 },
  { rating: 3, count: 12 },
  { rating: 2, count: 5 },
  { rating: 1, count: 3 },
]

export const mockPopular: LeaderboardEntry[] = [
  { nama: 'Gita Lestari', detail: 'Regu 3 — 44 laporan', votes: 36 },
  { nama: 'Andi Pratama', detail: 'Regu 1 — 42 laporan', votes: 31 },
  { nama: 'Dedi Kurniawan', detail: 'Regu 2 — 40 laporan', votes: 24 },
  { nama: 'Budi Santoso', detail: 'Regu 1 — 38 laporan', votes: 18 },
  { nama: 'Joko Susilo', detail: 'Regu 1 — Sopir', votes: 12 },
]

export const mockFunniest: LeaderboardEntry[] = [
  { nama: 'Evakuasi Ular Kobra', detail: '2 Okt — Siti Aminah', votes: 22 },
  { nama: 'Kucing di Atap Ruko', detail: '28 Sep — Jl. Pahlawan', votes: 17 },
  { nama: 'Sarung Nyangkut di Pohon', detail: '20 Sep — Kel. Banjar', votes: 11 },
]
