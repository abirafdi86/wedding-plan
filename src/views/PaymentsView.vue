<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownUp, CircleCheck, HandCoins, Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import RecordDialog, { type FormField } from '../components/RecordDialog.vue'
import { useWeddingData } from '../composables/useWeddingData'
import type { PaymentTransaction } from '../types'
import { formatDate, formatRupiah, todayISO } from '../utils/format'

const { data, addPayment, updatePayment, deletePayment, statusFor, budgetFor, paidFor, notify } = useWeddingData()
const dialogOpen = ref(false)
const editing = ref<PaymentTransaction | null>(null)
const statusFilter = ref('')
const categoryFilter = ref('')
const periodFilter = ref('')
const search = ref('')
const fields = computed<FormField[]>(() => [
  { key: 'itemId', label: 'Kebutuhan', type: 'select', options: data.items.map((item) => ({ value: item.id, label: item.name })), required: true },
  { key: 'name', label: 'Nama pembayaran', required: true, placeholder: 'Contoh: DP dekorasi' },
  { key: 'date', label: 'Tanggal transaksi', type: 'date', required: true },
  { key: 'amount', label: 'Nominal pembayaran', type: 'number', min: 1, required: true },
  { key: 'method', label: 'Metode pembayaran', type: 'select', options: ['Transfer', 'Tunai', 'E-wallet', 'Lainnya'], required: true },
  { key: 'type', label: 'Jenis transaksi', type: 'select', options: ['DP', 'Cicilan', 'Pelunasan'], required: true },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
])
const filtered = computed(() => data.payments.filter((payment) => {
  const item = data.items.find((entry) => entry.id === payment.itemId)
  const matchesSearch = !search.value || `${payment.name} ${item?.name || ''}`.toLowerCase().includes(search.value.toLowerCase())
  const matchesStatus = !statusFilter.value || (item && statusFor(item) === statusFilter.value)
  const matchesCategory = !categoryFilter.value || item?.category === categoryFilter.value
  const matchesPeriod = !periodFilter.value || payment.date.slice(0, 7) === periodFilter.value
  return matchesSearch && matchesStatus && matchesCategory && matchesPeriod
}).sort((a, b) => b.date.localeCompare(a.date)))
const totalPaid = computed(() => data.payments.reduce((sum, payment) => sum + payment.amount, 0))
const settledItems = computed(() => data.items.filter((item) => statusFor(item) === 'Lunas').length)
const remainingTotal = computed(() => data.items.reduce((sum, item) => sum + Math.max(0, budgetFor(item) - paidFor(item)), 0))
const periods = computed(() => [...new Set(data.payments.map((payment) => payment.date.slice(0, 7)))].sort().reverse())
function openNew() { editing.value = null; dialogOpen.value = true }
function openEdit(payment: PaymentTransaction) { editing.value = payment; dialogOpen.value = true }
function save(value: Record<string, string | number>) {
  const item = data.items.find((entry) => entry.id === value.itemId)
  if (!item) { notify('Kebutuhan yang dipilih tidak ditemukan.', 'error'); return }
  const payment: PaymentTransaction = {
    id: editing.value?.id || '', itemId: item.id, name: String(value.name), date: String(value.date),
    amount: Number(value.amount), method: String(value.method) as PaymentTransaction['method'],
    type: String(value.type) as PaymentTransaction['type'], notes: String(value.notes || ''),
  }
  try {
    if (editing.value) updatePayment(payment)
    else addPayment(payment)
    dialogOpen.value = false
    notify(editing.value ? 'Transaksi berhasil diperbarui.' : 'Pembayaran berhasil dicatat.')
  } catch (error) { notify(error instanceof Error ? error.message : 'Transaksi gagal disimpan.', 'error') }
}
function remove(payment: PaymentTransaction) {
  if (window.confirm(`Hapus transaksi "${payment.name}" sebesar ${formatRupiah(payment.amount)}?`)) { deletePayment(payment.id); notify('Transaksi berhasil dihapus.') }
}
function itemName(itemId: string) { return data.items.find((item) => item.id === itemId)?.name || 'Kebutuhan telah dihapus' }
function paymentStatus(itemId: string) {
  const item = data.items.find((entry) => entry.id === itemId)
  return item ? statusFor(item) : 'Belum Bayar'
}
</script>

<template>
  <div class="page-content">
    <PageHeading title="Pembayaran & Cicilan" description="Semua transaksi tercatat rapi, sisa tagihan terhitung otomatis."><button class="button button-primary" :disabled="!data.items.length" @click="openNew"><Plus :size="17" /> Catat pembayaran</button></PageHeading>
    <div class="stats-grid three-stats">
      <StatCard label="Total transaksi dibayar" :value="formatRupiah(totalPaid)" :helper="`${data.payments.length} transaksi tercatat`" :icon="HandCoins" tone="tone-green" />
      <StatCard label="Sisa seluruh tagihan" :value="formatRupiah(remainingTotal)" helper="Berdasarkan biaya aktual atau estimasi" :icon="ArrowDownUp" tone="tone-gold" />
      <StatCard label="Kebutuhan lunas" :value="`${settledItems} / ${data.items.length}`" helper="Status dihitung dari pembayaran" :icon="CircleCheck" tone="tone-blush" />
    </div>
    <section class="panel">
      <div class="filter-toolbar"><div class="filter-title"><h3>Riwayat transaksi</h3><span class="result-count">{{ filtered.length }} transaksi</span></div><div class="filters"><label class="search-field"><Search :size="16" /><input v-model="search" placeholder="Cari transaksi..." /></label><select v-model="statusFilter" aria-label="Filter status"><option value="">Semua status</option><option>Belum Bayar</option><option>Cicilan</option><option>Lunas</option></select><select v-model="categoryFilter" aria-label="Filter kategori"><option value="">Semua kategori</option><option v-for="category in [...new Set(data.items.map((item) => item.category))]" :key="category">{{ category }}</option></select><select v-model="periodFilter" aria-label="Filter periode"><option value="">Semua periode</option><option v-for="period in periods" :key="period" :value="period">{{ new Date(`${period}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) }}</option></select></div></div>
      <div v-if="filtered.length" class="table-wrap"><table class="data-table"><thead><tr><th>TANGGAL</th><th>PEMBAYARAN</th><th>KEBUTUHAN</th><th>METODE</th><th>JENIS</th><th>NOMINAL</th><th>STATUS</th><th class="actions-head">AKSI</th></tr></thead><tbody><tr v-for="payment in filtered" :key="payment.id"><td>{{ formatDate(payment.date) }}</td><td><div class="entity-primary"><strong>{{ payment.name }}</strong><small v-if="payment.notes">{{ payment.notes }}</small></div></td><td>{{ itemName(payment.itemId) }}</td><td>{{ payment.method }}</td><td><span class="category-pill">{{ payment.type }}</span></td><td><strong class="money-cell">{{ formatRupiah(payment.amount) }}</strong></td><td><StatusBadge :status="paymentStatus(payment.itemId)" /></td><td><div class="table-actions"><button class="icon-button" aria-label="Edit transaksi" @click="openEdit(payment)"><Pencil :size="15" /></button><button class="icon-button danger-hover" aria-label="Hapus transaksi" @click="remove(payment)"><Trash2 :size="15" /></button></div></td></tr></tbody></table></div>
      <div v-else class="empty-state"><div class="empty-illustration"><HandCoins :size="24" /></div><strong>{{ data.payments.length ? 'Tidak ada transaksi yang cocok' : 'Belum ada pembayaran tercatat' }}</strong><span>{{ data.payments.length ? 'Coba ubah filter yang dipilih.' : 'Catat pembayaran pertama agar progres anggaran selalu akurat.' }}</span><button v-if="!data.payments.length && data.items.length" class="button button-outline" @click="openNew"><Plus :size="15" /> Catat pembayaran</button><RouterLink v-if="!data.items.length" to="/anggaran" class="button button-outline">Tambah kebutuhan terlebih dahulu</RouterLink></div>
    </section>
    <div class="footnote">Status pembayaran diperbarui otomatis saat transaksi ditambah, diedit, atau dihapus.</div>
    <RecordDialog :open="dialogOpen" :title="editing ? 'Edit transaksi' : 'Catat pembayaran'" :fields="fields" :initial="editing ? { ...editing } : { date: todayISO(), method: 'Transfer', type: 'DP' }" @close="dialogOpen = false" @submit="save" />
  </div>
</template>
