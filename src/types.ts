export const itemCategories = [
  'Seserahan', 'Venue dan dekorasi', 'Catering', 'Busana dan makeup',
  'Fotografi dan videografi', 'Undangan dan souvenir', 'Mahar',
  'Administrasi pernikahan', 'Transportasi dan akomodasi', 'Hiburan', 'Lain-lain',
] as const

export const giftCategories = [
  'Perlengkapan ibadah', 'Perawatan diri', 'Busana dan aksesori',
  'Perlengkapan pribadi', 'Makanan dan buah',
  'Mahar dan perlengkapan simbolis', 'Perlengkapan hantaran',
] as const

export const taskCategories = [
  'Perencanaan', 'Venue', 'Catering', 'Dekorasi', 'Administrasi',
  'Busana', 'Undangan', 'Seserahan', 'Lain-lain',
] as const

export type PaymentStatus = 'Belum Bayar' | 'Cicilan' | 'Lunas'
export type ChecklistStatus = 'Belum Mulai' | 'Sedang Dikerjakan' | 'Selesai'

export interface WeddingSettings {
  coupleNames: string
  weddingDate: string
  budgetTarget: number
  currency: 'IDR'
}

export interface ChecklistTask {
  id: string
  name: string
  category: string
  deadline: string
  priority: 'Rendah' | 'Sedang' | 'Tinggi'
  status: ChecklistStatus
  notes: string
  description?: string
  phase?: string
  relativeDeadline?: string
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
}

export interface WeddingItem {
  id: string
  name: string
  category: string
  collection?: 'seserahan' | 'mahar'
  vendor: string
  estimatedCost: number
  actualCost: number
  quantity: number
  purchaseStatus: 'Belum Dibeli' | 'Sudah Dibeli'
  deadline: string
  notes: string
  productLink?: string
  description?: string
  unit?: string
  status?: 'planned' | 'to_buy' | 'purchased' | 'packed' | 'handed_over'
  personInCharge?: string
}

export interface PaymentTransaction {
  id: string
  itemId: string
  name: string
  date: string
  amount: number
  method: 'Transfer' | 'Tunai' | 'E-wallet' | 'Lainnya'
  type: 'DP' | 'Cicilan' | 'Pelunasan'
  notes: string
  receipt?: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  contact: string
  phone: string
  quote: number
  status: 'Dalam Pertimbangan' | 'Dihubungi' | 'Booking' | 'Selesai' | 'Dibatalkan'
  notes: string
}

export interface WeddingData {
  settings: WeddingSettings
  tasks: ChecklistTask[]
  items: WeddingItem[]
  payments: PaymentTransaction[]
  vendors: Vendor[]
  seedVersion?: number
}
