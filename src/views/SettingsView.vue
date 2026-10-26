<script setup lang="ts">
import { ref, watch } from 'vue'
import { AlertTriangle, Heart, Save, Settings, Trash2 } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import { useWeddingData } from '../composables/useWeddingData'
import { formatDate } from '../utils/format'

const { data, updateSettings, resetData, notify } = useWeddingData()
const coupleNames = ref(data.settings.coupleNames)
const weddingDate = ref(data.settings.weddingDate)
const budgetTarget = ref(data.settings.budgetTarget)
watch(() => data.settings, (settings) => {
  coupleNames.value = settings.coupleNames
  weddingDate.value = settings.weddingDate
  budgetTarget.value = settings.budgetTarget
})
function saveSettings() {
  if (Number(budgetTarget.value) < 0) { notify('Target anggaran tidak boleh negatif.', 'error'); return }
  updateSettings({ coupleNames: coupleNames.value.trim(), weddingDate: weddingDate.value, budgetTarget: Number(budgetTarget.value) || 0, currency: 'IDR' })
  notify('Pengaturan berhasil disimpan.')
}
function confirmReset() {
  if (window.confirm('Reset seluruh data Wedding Plan? Semua checklist, kebutuhan, transaksi, vendor, dan pengaturan akan dihapus permanen dari browser ini.')) resetData()
}
</script>

<template>
  <div class="page-content settings-page">
    <PageHeading title="Pengaturan" description="Atur detail pernikahan dan preferensi kalian." />
    <section class="panel settings-panel"><div class="panel-heading settings-panel-heading"><div class="settings-heading-icon"><Heart :size="18" /></div><div><h3>Detail pernikahan</h3><p>Informasi dasar untuk perjalanan istimewa kalian.</p></div></div>
      <form class="settings-form" @submit.prevent="saveSettings">
        <label class="form-field"><span>Nama pasangan</span><input v-model="coupleNames" type="text" placeholder="Contoh: Dinda & Raka" /></label>
        <label class="form-field"><span>Tanggal pernikahan</span><input v-model="weddingDate" type="date" /></label>
        <label class="form-field"><span>Target anggaran</span><div class="input-with-prefix"><span>Rp</span><input v-model.number="budgetTarget" type="number" min="0" placeholder="0" /></div></label>
        <label class="form-field"><span>Mata uang</span><input value="Rupiah (IDR)" disabled /></label>
        <div class="settings-actions"><button class="button button-primary" type="submit"><Save :size="16" /> Simpan pengaturan</button></div>
      </form>
    </section>
    <section class="panel settings-summary"><div class="summary-icon"><Settings :size="17" /></div><div><strong>Ringkasan hari istimewa</strong><span>{{ coupleNames || 'Nama pasangan belum diisi' }} · {{ formatDate(weddingDate) }}</span></div></section>
    <section class="panel danger-zone"><div class="danger-icon"><AlertTriangle :size="19" /></div><div class="danger-copy"><h3>Reset seluruh data</h3><p>Hapus checklist, daftar kebutuhan, transaksi, vendor, dan detail pengaturan dari browser ini.</p></div><button class="button button-danger" @click="confirmReset"><Trash2 :size="15" /> Reset data</button></section>
  </div>
</template>
