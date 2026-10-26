<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pencil, Plus, Search, Store, Trash2 } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import StatusBadge from '../components/StatusBadge.vue'
import RecordDialog, { type FormField } from '../components/RecordDialog.vue'
import { useWeddingData } from '../composables/useWeddingData'
import type { Vendor } from '../types'
import { formatRupiah } from '../utils/format'

const { data, addVendor, updateVendor, deleteVendor, notify } = useWeddingData()
const search = ref('')
const category = ref('')
const dialogOpen = ref(false)
const editing = ref<Vendor | null>(null)
const vendorCategories = ['Venue dan dekorasi', 'Catering', 'Busana dan makeup', 'Fotografi dan videografi', 'Undangan dan souvenir', 'Hiburan', 'Transportasi dan akomodasi', 'Lain-lain']
const fields: FormField[] = [
  { key: 'name', label: 'Nama vendor', required: true },
  { key: 'category', label: 'Kategori layanan', type: 'select', options: vendorCategories, required: true },
  { key: 'contact', label: 'Nama kontak' },
  { key: 'phone', label: 'Nomor telepon', type: 'tel' },
  { key: 'quote', label: 'Harga penawaran', type: 'number', min: 0, required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Dalam Pertimbangan', 'Dihubungi', 'Booking', 'Selesai', 'Dibatalkan'], required: true },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]
const rows = computed(() => data.vendors.filter((vendor) => (!category.value || vendor.category === category.value) && (!search.value || `${vendor.name} ${vendor.contact}`.toLowerCase().includes(search.value.toLowerCase()))))
function openNew() { editing.value = null; dialogOpen.value = true }
function openEdit(vendor: Vendor) { editing.value = vendor; dialogOpen.value = true }
function save(value: Record<string, string | number>) {
  const vendor = { name: String(value.name), category: String(value.category), contact: String(value.contact || ''), phone: String(value.phone || ''), quote: Number(value.quote), status: String(value.status) as Vendor['status'], notes: String(value.notes || '') }
  if (editing.value) updateVendor({ ...vendor, id: editing.value.id })
  else addVendor(vendor)
  dialogOpen.value = false
  notify(editing.value ? 'Vendor berhasil diperbarui.' : 'Vendor berhasil ditambahkan.')
}
function remove(vendor: Vendor) {
  if (window.confirm(`Hapus vendor "${vendor.name}"?`)) { deleteVendor(vendor.id); notify('Vendor berhasil dihapus.') }
}
</script>

<template>
  <div class="page-content">
    <PageHeading title="Daftar Vendor" description="Simpan kontak dan pantau vendor pilihan kalian."><button class="button button-primary" @click="openNew"><Plus :size="17" /> Tambah vendor</button></PageHeading>
    <section class="panel">
      <div class="filter-toolbar"><div class="filter-title"><h3>Vendor pernikahan</h3><span class="result-count">{{ rows.length }} vendor</span></div><div class="filters"><label class="search-field"><Search :size="16" /><input v-model="search" placeholder="Cari vendor..." /></label><select v-model="category" aria-label="Filter kategori"><option value="">Semua kategori</option><option v-for="option in vendorCategories" :key="option">{{ option }}</option></select></div></div>
      <div v-if="rows.length" class="table-wrap"><table class="data-table"><thead><tr><th>NAMA VENDOR</th><th>KATEGORI</th><th>KONTAK</th><th>HARGA PENAWARAN</th><th>STATUS</th><th class="actions-head">AKSI</th></tr></thead><tbody><tr v-for="vendor in rows" :key="vendor.id"><td><div class="entity-primary"><strong>{{ vendor.name }}</strong><small>{{ vendor.notes || 'Belum ada catatan' }}</small></div></td><td><span class="category-pill">{{ vendor.category }}</span></td><td><div class="entity-primary"><strong>{{ vendor.contact || '—' }}</strong><small>{{ vendor.phone || 'Nomor belum dicatat' }}</small></div></td><td><strong class="money-cell">{{ formatRupiah(vendor.quote) }}</strong></td><td><StatusBadge :status="vendor.status" /></td><td><div class="table-actions"><button class="icon-button" aria-label="Edit vendor" @click="openEdit(vendor)"><Pencil :size="15" /></button><button class="icon-button danger-hover" aria-label="Hapus vendor" @click="remove(vendor)"><Trash2 :size="15" /></button></div></td></tr></tbody></table></div>
      <div v-else class="empty-state"><div class="empty-illustration"><Store :size="24" /></div><strong>{{ data.vendors.length ? 'Vendor tidak ditemukan' : 'Belum ada vendor tersimpan' }}</strong><span>{{ data.vendors.length ? 'Coba ubah kata kunci atau kategori.' : 'Simpan vendor favorit agar detail kontak mudah ditemukan.' }}</span><button v-if="!data.vendors.length" class="button button-outline" @click="openNew"><Plus :size="15" /> Tambah vendor</button></div>
    </section>
    <RecordDialog :open="dialogOpen" :title="editing ? 'Edit vendor' : 'Tambah vendor'" :fields="fields" :initial="editing || { status: 'Dalam Pertimbangan', quote: 0 }" @close="dialogOpen = false" @submit="save" />
  </div>
</template>
