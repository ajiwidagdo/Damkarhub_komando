import type { Report } from '../types'

const T = '06622c4b-2610-427e-9ee4-cce5a80ad1f1'
const O = '2a3c0925-9bda-41b8-aea3-da41e493c417'

function base(id: string, module: Report['module'], data: Partial<Report['data']> & { tanggal: string; pukul: string; jenis: string }): Report {
  return {
    id,
    module,
    data: {
      id,
      data_schema_version: '1.0',
      tglTerima: data.tanggal, jamTerima: data.pukul,
      lokasiDetail: '', dusun: '', rtrw: '', kel: 'Banjar', kec: 'Banjar', kabkota: 'Kota Banjar',
      koordinat: '', kronologi: '', tindakan: '', kendala: [], unsur: '',
      regu: 'Regu 1', personil: 'Andi Pratama\nBudi Santoso', keterangan: '',
      ...data,
    } as Report['data'],
    deleted: false,
    updated_at: `${data.tanggal}T${data.pukul}:00+07:00`,
    owner: O,
    tenant_id: T,
    status: 'DONE',
    incident_at: `${data.tanggal} ${data.pukul}:00+07`,
    report_received_at: `${data.tanggal} ${data.pukul}:00+07`,
  }
}

export const mockReports: Report[] = [
  base('a1b2c3d4-0001-4000-8000-000000000001', 'k', {
    tanggal: '2026-10-01', pukul: '09:00', jenis: 'Kebakaran Rumah',
    lokasiDetail: 'Jl. Merdeka No. 12', pNama: 'H. Sulaeman', penyebab: 'Korsleting listrik',
    objekTerbakar: 'Atap Rumah / Plafon', kronologi: 'Api berasal dari lantai 2.',
    tindakan: 'Pemadaman total dan pendinginan.', kendala: ['Akses jalan sempit'],
  }),
  base('a1b2c3d4-0002-4000-8000-000000000002', 'k', {
    tanggal: '2026-10-02', pukul: '14:30', jenis: 'Kebakaran Lahan',
    lokasiDetail: 'Kebun kosong Kel. Banjar', penyebab: 'Pembakaran sampah',
    kronologi: 'Api merambat ke lahan kosong.', tindakan: 'Pemadaman dengan 2 unit.',
  }),
  base('a1b2c3d4-0003-4000-8000-000000000003', 'k', {
    tanggal: '2026-10-03', pukul: '20:15', jenis: 'Kebakaran Ruko',
    lokasiDetail: 'Jl. Pahlawan No. 8', pNama: 'Toko Barokah', penyebab: 'Kompor gas',
    kronologi: 'Kebakaran dapur ruko.', tindakan: 'Pemadaman + evakuasi barang.',
    kendala: ['Cuaca panas'],
  }),
  base('b1b2c3d4-0001-4000-8000-000000000001', 'nk', {
    tanggal: '2026-10-02', pukul: '10:00', jenis: 'Evakuasi Ular',
    lokasiDetail: 'Rumah warga', idNama: 'Siti Aminah', idUsia: '45',
    kronologi: 'Ular kobra ±2 meter di kamar mandi.', tindakan: 'Evakuasi dengan penjepit.',
  }),
  base('b1b2c3d4-0002-4000-8000-000000000002', 'nk', {
    tanggal: '2026-10-04', pukul: '08:20', jenis: 'Pohon Tumbang',
    lokasiDetail: 'Jl. Raya Banjar KM 3',
    kronologi: 'Pohon tumbang menutup jalan.', tindakan: 'Pemotongan + pembersihan.',
  }),
  base('b1b2c3d4-0003-4000-8000-000000000003', 'nk', {
    tanggal: '2026-10-05', pukul: '16:45', jenis: 'Banjir',
    lokasiDetail: 'Kel. Mekarsari', kronologi: 'Genangan 40cm setelah hujan deras.',
    tindakan: 'Penyedotan air + evakuasi warga.',
  }),
  base('b1b2c3d4-0004-4000-8000-000000000004', 'nk', {
    tanggal: '2026-10-06', pukul: '11:10', jenis: 'Kecelakaan Lalu Lintas',
    lokasiDetail: 'Perempatan Alun-alun', idNama: 'Dedi Kurniawan',
    kronologi: 'Tabrakan motor vs mobil.', tindakan: 'Evakuasi korban ke RS.',
  }),
  base('c1b2c3d4-0001-4000-8000-000000000001', 'sos', {
    tanggal: '2026-10-03', pukul: '08:00', jenis: 'Sosialisasi',
    tempat: 'SMPN 2 Banjar', kategori: 'EDU - Sektor Pendidikan (Sekolah / Kampus)',
    kronologi: 'Materi bahaya kebakaran + simulasi APAR.', tindakan: '150 siswa peserta.',
  }),
  base('c1b2c3d4-0002-4000-8000-000000000002', 'sos', {
    tanggal: '2026-10-05', pukul: '09:00', jenis: 'Sosialisasi',
    tempat: 'Balai Desa Karyamukti', kategori: 'MAS - Masyarakat (Pemukiman / Warga)',
    kronologi: 'Penyuluhan pencegahan kebakaran rumah tangga.', tindakan: '80 warga hadir.',
  }),
  base('c1b2c3d4-0003-4000-8000-000000000003', 'sos', {
    tanggal: '2026-10-06', pukul: '13:00', jenis: 'Sosialisasi',
    tempat: 'PT Maju Jaya', kategori: 'DUN - Dunia Usaha (Perusahaan / Pabrik)',
    kronologi: 'Pelatihan APAR karyawan.', tindakan: '45 karyawan peserta.',
  }),
]
