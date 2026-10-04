export type IncidentCategory = 'darurat' | 'penyelamatan' | 'terjadwal' | 'lainnya'

export interface Incident {
  id: string
  category: IncidentCategory
  title: string
  address: string
  time: string
  lat: number
  lng: number
  cluster: number
  phone: string
  coords: string
}

export const mockIncidents: Incident[] = [
  { id: 'i01', category: 'darurat', title: 'Kebakaran Rumah', address: 'Jl. Merdeka No. 12, Banjar', time: '10:18', lat: -7.362, lng: 108.528, cluster: 3, phone: '081234567890', coords: '-7.3542, 108.3351' },
  { id: 'i02', category: 'penyelamatan', title: 'Evakuasi Hewan Liar', address: 'Jl. Ahmad Yani, Banjar', time: '09:42', lat: -7.371, lng: 108.532, cluster: 1, phone: '081234567891', coords: '-7.3710, 108.5320' },
  { id: 'i03', category: 'terjadwal', title: 'Sosialisasi Sekolah', address: 'SMPN 2 Banjar', time: '08:15', lat: -7.368, lng: 108.541, cluster: 0, phone: '081234567892', coords: '-7.3680, 108.5410' },
  { id: 'i04', category: 'darurat', title: 'Kebakaran Lahan', address: 'Desa Neglasari, Banjar', time: '07:50', lat: -7.385, lng: 108.519, cluster: 2, phone: '081234567893', coords: '-7.3850, 108.5190' },
  { id: 'i05', category: 'penyelamatan', title: 'Evakuasi Korban Banjir', address: 'Kec. Purwaharja, Banjar', time: '06:30', lat: -7.355, lng: 108.545, cluster: 1, phone: '081234567894', coords: '-7.3550, 108.5450' },
  { id: 'i06', category: 'lainnya', title: 'Pohon Tumbang', address: 'Jl. Raya Banjar - Ciamis', time: '05:24', lat: -7.375, lng: 108.515, cluster: 0, phone: '081234567895', coords: '-7.3750, 108.5150' },
  { id: 'i07', category: 'darurat', title: 'Kebakaran Gudang', address: 'Jl. Letjen Suwarto, Banjar', time: '04:12', lat: -7.366, lng: 108.522, cluster: 4, phone: '081234567896', coords: '-7.3660, 108.5220' },
  { id: 'i08', category: 'penyelamatan', title: 'Evakuasi Korban Kecelakaan', address: 'Jl. Pahlawan, Banjar', time: '02:36', lat: -7.38, lng: 108.535, cluster: 1, phone: '081234567897', coords: '-7.3800, 108.5350' },
]

export const categoryMeta: Record<IncidentCategory, { label: string; color: string; bg: string }> = {
  darurat: { label: 'DARURAT', color: '#dc2626', bg: '#dc2626' },
  penyelamatan: { label: 'PENYELAMATAN', color: '#f59e0b', bg: '#f59e0b' },
  terjadwal: { label: 'TERJADWAL', color: '#2563eb', bg: '#2563eb' },
  lainnya: { label: 'LAINNYA', color: '#64748b', bg: '#64748b' },
}
