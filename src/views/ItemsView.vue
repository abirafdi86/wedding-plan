<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CircleDollarSign, HandCoins, Package, Pencil, Plus, Search, Trash2, Wallet } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import RecordDialog, { type FormField } from '../components/RecordDialog.vue'
import { useWeddingData } from '../composables/useWeddingData'
import { giftCategories, itemCategories, type WeddingItem } from '../types'
import { formatRupiah } from '../utils/format'

const props = defineProps<{ mode: 'seserahan' | 'anggaran' }>()
const { data, addItem, updateItem, deleteItem, paidFor, remainingFor, statusFor, notify } = useWeddingData()
const gifts = computed(() => props.mode === 'seserahan')
const title = computed(() => gifts.value ? 'Daftar Seserahan' : 'Anggaran & Kebutuhan')
const description = computed(() => gifts.value ? 'Catat barang seserahan dari daftar hingga lunas terbeli.' : 'Pantau kebutuhan, estimasi, dan biaya aktual dalam satu tempat.')
const categoryOptions = computed(() => gifts.value ? [...giftCategories] : [...itemCategories])
const search = ref('')
const categoryFilter = ref('')
const dialogOpen = ref(false)
const editing = ref<WeddingItem | null>(null)
const giftFormFields: FormField[] = [
  { key: 'name', label: 'Nama barang', required: true },
  { key: 'category', label: 'Kategori', type: 'select', options: [...giftCategories], required: true },
  { key: 'quantity', label: 'Jumlah', type: 'number', min: 1, required: true },
  { key: 'estimatedCost', label: 'Estimasi harga', type: 'number', min: 0, required: true },
  { key: 'actualCost', label: 'Harga aktual', type: 'number', min: 0 },
  { key: 'vendor', label: 'Toko atau tempat pembelian' },
  { key: 'productLink', label: 'Link produk (opsional)', type: 'url' },
  { key: 'purchaseStatus', label: 'Status pembelian', type: 'select', options: ['Belum Dibeli', 'Sudah Dibeli'], required: true },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]
const budgetFormFields: FormField[] = [
  { key: 'name', label: 'Nama kebutuhan', required: true },
  { key: 'category', label: 'Kategori', type: 'select', options: [...itemCategories], required: true },
  { key: 'vendor', label: 'Vendor atau toko' },
  { key: 'estimatedCost', label: 'Estimasi biaya', type: 'number', min: 0, required: true },
  { key: 'actualCost', label: 'Biaya aktual', type: 'number', min: 0 },
  { key: 'deadline', label: 'Deadline pembayaran', type: 'date' },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]
const fields = computed(() => gifts.value ? giftFormFields : budgetFormFields)
const rows = computed(() => data.items.filter((item) => {
  const giftCategory = giftCategories.includes(item.category as typeof giftCategories[number])
  const belongsToPage = !gifts.value || item.category === 'Seserahan' || giftCategory
  const belongsToCategory = !categoryFilter.value || item.category === categoryFilter.value || (categoryFilter.value === 'Seserahan' && giftCategory)
  return belongsToPage && belongsToCategory && (!search.value || `${item.name} ${item.vendor}`.toLowerCase().includes(search.value.toLowerCase()))
}))
const totals = computed(() => {
  const items = data.items.filter((item) => gifts.value ? item.category === 'Seserahan' || giftCategories.includes(item.category as typeof giftCategories[number]) : true)
  return { estimated: items.reduce((sum, item) => sum + item.estimatedCost * Math.max(1, item.quantity || 1), 0), actual: items.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost) * Math.max(1, item.quantity || 1), 0), paid: items.reduce((sum, item) => sum + paidFor(item), 0), remaining: items.reduce((sum, item) => sum + remainingFor(item), 0) }
})
function openNew() { editing.value = null; dialogOpen.value = true }
function openEdit(item: WeddingItem) { editing.value = item; dialogOpen.value = true }
function submit(value: Record<string, string | number>) {
  const category = String(value.category)
  const item: Omit<WeddingItem, 'id'> = {
    name: String(value.name), category, vendor: String(value.vendor || ''),
    estimatedCost: Number(value.estimatedCost), actualCost: Number(value.actualCost || 0),
    quantity: gifts.value ? Number(value.quantity || 1) : 1,
    purchaseStatus: String(value.purchaseStatus || 'Belum Dibeli') as WeddingItem['purchaseStatus'],
    deadline: String(value.deadline || ''), notes: String(value.notes || ''),
    ...(gifts.value ? { productLink: String(value.productLink || '') } : {}),
  }
  if (editing.value) updateItem({ ...item, id: editing.value.id })
  else addItem(item)
  dialogOpen.value = false
  notify(editing.value ? 'Kebutuhan berhasil diperbarui.' : 'Kebutuhan berhasil ditambahkan.')
}
function remove(item: WeddingItem) {
  const payments = data.payments.filter((payment) => payment.itemId === item.id)
  const warning = payments.length ? ` Kebutuhan ini memiliki ${payments.length} transaksi; seluruh transaksi tersebut juga akan dihapus.` : ''
  if (window.confirm(`Hapus "${item.name}"?${warning}`)) { deleteItem(item.id); notify('Kebutuhan dan transaksi terkait berhasil dihapus.') }
}
</script>

<template>
  <div class="page-content">
    <PageHeading :title="title" :description="description"><button class="button button-primary" @click="openNew"><Plus :size="17" /> {{ gifts ? 'Tambah seserahan' : 'Tambah kebutuhan' }}</button></PageHeading>
    <div class="stats-grid four-stats">
      <StatCard :label="gifts ? 'Total estimasi seserahan' : 'Total estimasi'" :value="formatRupiah(totals.estimated)" :icon="Package" tone="tone-blush" />
      <StatCard label="Total biaya aktual" :value="formatRupiah(totals.actual)" :icon="CircleDollarSign" tone="tone-gold" />
      <StatCard label="Total pembayaran" :value="formatRupiah(totals.paid)" :icon="HandCoins" tone="tone-green" />
      <StatCard label="Sisa pembayaran" :value="formatRupiah(totals.remaining)" :icon="Wallet" tone="tone-blue" />
    </div>
    <section class="panel">
      <div class="filter-toolbar"><div class="filter-title"><h3>{{ gifts ? 'Daftar barang' : 'Semua kebutuhan' }}</h3><span class="result-count">{{ rows.length }} item</span></div><div class="filters"><label class="search-field"><Search :size="16" /><input v-model="search" placeholder="Cari nama atau vendor..." /></label><select v-model="categoryFilter" aria-label="Filter kategori"><option value="">Semua kategori</option><option v-for="category in categoryOptions" :key="category">{{ category }}</option></select></div></div>
      <div v-if="rows.length" class="table-wrap"><table class="data-table"><thead><tr><th>KEBUTUHAN</th><th>KATEGORI</th><th>{{ gifts ? 'JUMLAH' : 'ESTIMASI / AKTUAL' }}</th><th>TERBAYAR</th><th>SISA</th><th>STATUS BAYAR</th><th v-if="gifts">PEMBELIAN</th><th class="actions-head">AKSI</th></tr></thead><tbody><tr v-for="item in rows" :key="item.id"><td><div class="entity-primary"><strong>{{ item.name }}</strong><small>{{ item.vendor || 'Vendor belum ditentukan' }}</small></div></td><td><span class="category-pill">{{ item.category }}</span></td><td><div class="entity-primary"><strong>{{ formatRupiah(item.actualCost || item.estimatedCost) }}</strong><small>{{ item.actualCost ? 'Biaya aktual' : 'Estimasi biaya' }}</small></div></td><td>{{ formatRupiah(paidFor(item)) }}</td><td>{{ formatRupiah(remainingFor(item)) }}</td><td><StatusBadge :status="statusFor(item)" /></td><td v-if="gifts"><StatusBadge :status="item.purchaseStatus" /></td><td><div class="table-actions"><button class="icon-button" aria-label="Edit kebutuhan" @click="openEdit(item)"><Pencil :size="15" /></button><button class="icon-button danger-hover" aria-label="Hapus kebutuhan" @click="remove(item)"><Trash2 :size="15" /></button></div></td></tr></tbody></table></div>
      <div v-else class="empty-state"><div class="empty-illustration"><Package :size="24" /></div><strong>{{ search || categoryFilter ? 'Tidak ada hasil yang cocok' : gifts ? 'Daftar seserahan masih kosong' : 'Belum ada kebutuhan tercatat' }}</strong><span>{{ search || categoryFilter ? 'Coba kata kunci atau kategori lain.' : 'Tambahkan kebutuhan pertama untuk mulai mengatur anggaran.' }}</span><button v-if="!search && !categoryFilter" class="button button-outline" @click="openNew"><Plus :size="15" /> Tambah {{ gifts ? 'seserahan' : 'kebutuhan' }}</button></div>
    </section>
    <div class="footnote"><ArrowRight :size="15" /> Status pembayaran dan sisa tagihan dihitung otomatis dari seluruh transaksi yang tercatat. <RouterLink to="/pembayaran">Lihat riwayat pembayaran</RouterLink></div>
    <RecordDialog :open="dialogOpen" :title="editing ? (gifts ? 'Edit seserahan' : 'Edit kebutuhan') : (gifts ? 'Tambah seserahan' : 'Tambah kebutuhan')" :fields="fields" :initial="editing || { quantity: 1, purchaseStatus: 'Belum Dibeli' }" @close="dialogOpen = false" @submit="submit" />
  </div>
</template>
