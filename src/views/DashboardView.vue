<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDownRight, ArrowRight, CalendarDays, Check, CircleDollarSign, Clock3, HandCoins, Heart, Plus, Wallet } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import RecordDialog, { type FormField } from '../components/RecordDialog.vue'
import { useWeddingData } from '../composables/useWeddingData'
import { formatDate, formatRupiah, todayISO } from '../utils/format'
import { itemCategories } from '../types'

const router = useRouter()
const { data, dashboard, addItem, addPayment, notify, statusFor } = useWeddingData()
const dialog = ref<'item' | 'payment' | null>(null)
const weddingCountdown = computed(() => {
  if (!data.settings.weddingDate) return 'Atur tanggal pernikahan'
  const days = Math.ceil((new Date(`${data.settings.weddingDate}T00:00:00`).getTime() - new Date(`${todayISO()}T00:00:00`).getTime()) / 86400000)
  return days < 0 ? 'Hari istimewa telah berlalu' : days === 0 ? 'Hari ini adalah hari istimewa!' : `${days} hari lagi`
})
const upcoming = computed(() => data.items.filter((item) => item.deadline && item.deadline >= todayISO() && item.deadline <= new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) && statusFor(item) !== 'Lunas').sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4))
const categories = computed(() => itemCategories.map((category) => ({
  name: category,
  total: data.items.filter((item) => item.category === category || (category === 'Seserahan' && ['Perlengkapan ibadah', 'Pakaian dan aksesori', 'Perawatan tubuh dan kosmetik', 'Tas dan sepatu', 'Perhiasan', 'Makanan atau buah', 'Perlengkapan lainnya'].includes(item.category))).reduce((sum, item) => sum + (item.actualCost || item.estimatedCost) * Math.max(1, item.quantity || 1), 0),
})).filter((entry) => entry.total > 0).sort((a, b) => b.total - a.total).slice(0, 4))
const itemFields: FormField[] = [
  { key: 'name', label: 'Nama kebutuhan', required: true, placeholder: 'Contoh: Sewa gedung' },
  { key: 'category', label: 'Kategori', type: 'select', options: [...itemCategories], required: true },
  { key: 'vendor', label: 'Vendor atau toko' },
  { key: 'estimatedCost', label: 'Estimasi biaya', type: 'number', min: 0, required: true },
  { key: 'actualCost', label: 'Biaya aktual', type: 'number', min: 0 },
  { key: 'deadline', label: 'Deadline pembayaran', type: 'date' },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]
const paymentFields = computed<FormField[]>(() => [
  { key: 'itemId', label: 'Kebutuhan', type: 'select', options: data.items.map((item) => ({ value: item.id, label: item.name })), required: true },
  { key: 'name', label: 'Nama pembayaran', required: true, placeholder: 'Contoh: DP gedung' },
  { key: 'date', label: 'Tanggal transaksi', type: 'date', required: true },
  { key: 'amount', label: 'Nominal', type: 'number', min: 1, required: true },
  { key: 'method', label: 'Metode', type: 'select', options: ['Transfer', 'Tunai', 'E-wallet', 'Lainnya'], required: true },
  { key: 'type', label: 'Jenis transaksi', type: 'select', options: ['DP', 'Cicilan', 'Pelunasan'], required: true },
])
function submitItem(value: Record<string, string | number>) {
  addItem({ name: String(value.name), category: String(value.category), vendor: String(value.vendor || ''), estimatedCost: Number(value.estimatedCost), actualCost: Number(value.actualCost || 0), quantity: 1, purchaseStatus: 'Belum Dibeli', deadline: String(value.deadline || ''), notes: String(value.notes || '') })
  dialog.value = null
  notify('Kebutuhan berhasil ditambahkan.')
}
function submitPayment(value: Record<string, string | number>) {
  try {
    const item = data.items.find((entry) => entry.id === value.itemId)
    if (!item) throw new Error('Pilih kebutuhan yang tersedia.')
    addPayment({ itemId: item.id, name: String(value.name), date: String(value.date), amount: Number(value.amount), method: String(value.method) as 'Transfer' | 'Tunai' | 'E-wallet' | 'Lainnya', type: String(value.type) as 'DP' | 'Cicilan' | 'Pelunasan', notes: '' })
    dialog.value = null
    notify('Pembayaran berhasil dicatat.')
  } catch (error) { notify(error instanceof Error ? error.message : 'Pembayaran gagal disimpan.', 'error') }
}
</script>

<template>
  <div class="page-content">
    <PageHeading eyebrow="SENANG BISA MERENCANAKAN BERSAMA" title="Dashboard" description="Satu langkah kecil hari ini, semakin dekat ke hari bahagia." />
    <section class="welcome-banner">
      <div class="welcome-copy"><span class="welcome-tag"><Heart :size="13" /> OUR WEDDING JOURNEY</span><h2>{{ data.settings.coupleNames || 'Kisah kalian, hari istimewa kalian' }}</h2><p>Semua persiapan pernikahan, dalam satu tempat yang terasa lebih ringan.</p><RouterLink to="/pengaturan" class="banner-link">Lengkapi detail pernikahan <ArrowRight :size="15" /></RouterLink></div>
      <div class="wedding-date-card"><div class="date-icon"><CalendarDays :size="20" /></div><span>MENUJU HARI PERNIKAHAN</span><strong>{{ weddingCountdown }}</strong><small>{{ formatDate(data.settings.weddingDate) }}</small></div>
    </section>
    <div class="stats-grid">
      <StatCard label="Total estimasi" :value="formatRupiah(dashboard.estimated)" helper="Dari seluruh kebutuhan" :icon="CircleDollarSign" tone="tone-blush" />
      <StatCard label="Total aktual" :value="formatRupiah(dashboard.actual)" helper="Estimasi digunakan jika belum ada aktual" :icon="Wallet" tone="tone-gold" />
      <StatCard label="Sudah dibayar" :value="formatRupiah(dashboard.paid)" helper="Dari transaksi yang tercatat" :icon="HandCoins" tone="tone-green" />
      <StatCard label="Sisa pembayaran" :value="formatRupiah(dashboard.remaining)" :helper="`${dashboard.paidItems} lunas · ${dashboard.openItems} belum lunas`" :icon="ArrowDownRight" tone="tone-blue" />
    </div>
    <section class="progress-panel">
      <div class="progress-heading"><div><span class="section-kicker">PROGRES PEMBAYARAN</span><h3>Anggaran yang sudah terbayar</h3></div><strong>{{ dashboard.paymentProgress }}%</strong></div>
      <div class="progress-track"><div class="progress-fill" :style="{ width: `${dashboard.paymentProgress}%` }"></div></div>
      <div class="progress-footer"><span>{{ formatRupiah(dashboard.paid) }} terbayar</span><span>{{ formatRupiah(dashboard.remaining) }} tersisa</span></div>
    </section>
    <div class="dashboard-columns">
      <section class="panel">
        <div class="panel-heading"><div><span class="section-kicker">JANGAN SAMPAI TERLEWAT</span><h3>Pembayaran mendatang</h3></div><RouterLink to="/anggaran" class="text-link">Lihat semua <ArrowRight :size="14" /></RouterLink></div>
        <div v-if="upcoming.length" class="list-stack">
          <div v-for="item in upcoming" :key="item.id" class="simple-list-row"><div class="list-avatar avatar-blush"><Clock3 :size="17" /></div><div class="list-main"><strong>{{ item.name }}</strong><span>{{ item.vendor || item.category }} · {{ formatDate(item.deadline) }}</span></div><div class="list-end"><strong>{{ formatRupiah(item.actualCost || item.estimatedCost) }}</strong><StatusBadge :status="statusFor(item)" /></div></div>
        </div>
        <div v-else class="empty-state compact"><div class="empty-illustration"><CalendarDays :size="21" /></div><strong>Belum ada pembayaran dekat</strong><span>Tambahkan deadline di kebutuhan agar pengingat muncul di sini.</span><button class="text-link" @click="router.push('/anggaran')">Kelola kebutuhan <ArrowRight :size="14" /></button></div>
      </section>
      <section class="panel">
        <div class="panel-heading"><div><span class="section-kicker">LANGKAH BERIKUTNYA</span><h3>Checklist persiapan</h3></div><RouterLink to="/checklist" class="text-link">Lihat semua <ArrowRight :size="14" /></RouterLink></div>
        <div v-if="data.tasks.some((task) => task.status !== 'Selesai')" class="list-stack">
          <div v-for="task in data.tasks.filter((entry) => entry.status !== 'Selesai').slice(0,4)" :key="task.id" class="simple-list-row"><div class="task-check"><Check :size="13" /></div><div class="list-main"><strong>{{ task.name }}</strong><span>{{ task.category }} · {{ formatDate(task.deadline) }}</span></div><StatusBadge :status="task.priority" /></div>
        </div>
        <div v-else class="empty-state compact"><div class="empty-illustration"><Check :size="21" /></div><strong>Checklist masih kosong</strong><span>Mulai catat persiapan agar semua berjalan tenang.</span><RouterLink to="/checklist" class="text-link">Tambah tugas <ArrowRight :size="14" /></RouterLink></div>
      </section>
    </div>
    <div class="dashboard-columns lower-columns">
      <section class="panel"><div class="panel-heading"><div><span class="section-kicker">RINGKASAN</span><h3>Pengeluaran per kategori</h3></div><RouterLink to="/anggaran" class="text-link">Detail <ArrowRight :size="14" /></RouterLink></div>
        <div v-if="categories.length" class="category-stack"><div v-for="(category, index) in categories" :key="category.name" class="category-row"><div class="category-line"><span><i class="category-dot" :class="`dot-${index}`"></i>{{ category.name }}</span><strong>{{ formatRupiah(category.total) }}</strong></div><div class="progress-track slim"><div class="progress-fill" :style="{ width: `${dashboard.actual ? (category.total / dashboard.actual) * 100 : 0}%` }"></div></div></div></div>
        <div v-else class="empty-state compact"><strong>Belum ada pengeluaran</strong><span>Ringkasan kategori muncul setelah kebutuhan ditambahkan.</span></div>
      </section>
      <section class="panel quick-panel"><div><span class="section-kicker">MULAI DARI SINI</span><h3>Tambah dengan cepat</h3><p>Catat kebutuhan atau pembayaran tanpa berpindah halaman.</p></div><div class="quick-actions"><button class="button button-primary" @click="dialog = 'item'"><Plus :size="16" /> Kebutuhan baru</button><button class="button button-outline" :disabled="!data.items.length" @click="dialog = 'payment'"><Plus :size="16" /> Catat pembayaran</button></div><div class="mini-summary"><span><Check :size="14" /> {{ dashboard.completedTasks }} dari {{ dashboard.totalTasks }} tugas selesai</span><span><ArrowRight :size="14" /> {{ formatRupiah(data.settings.budgetTarget) }} target anggaran</span></div></section>
    </div>
    <RecordDialog :open="dialog === 'item'" title="Tambah kebutuhan" :fields="itemFields" @close="dialog = null" @submit="submitItem" />
    <RecordDialog :open="dialog === 'payment'" title="Catat pembayaran" :fields="paymentFields" :initial="{ date: todayISO() }" @close="dialog = null" @submit="submitPayment" />
  </div>
</template>
