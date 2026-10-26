<script setup lang="ts">
import { computed, ref } from 'vue'
import { AlertCircle, Check, Circle, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import PageHeading from '../components/PageHeading.vue'
import StatusBadge from '../components/StatusBadge.vue'
import RecordDialog, { type FormField } from '../components/RecordDialog.vue'
import { useWeddingData } from '../composables/useWeddingData'
import { taskCategories, type ChecklistTask } from '../types'
import { formatDate, todayISO } from '../utils/format'

const { data, addTask, updateTask, deleteTask, notify } = useWeddingData()
const dialogOpen = ref(false)
const editing = ref<ChecklistTask | null>(null)
const categoryFilter = ref('')
const priorityFilter = ref('')
const statusFilter = ref('')
const fields: FormField[] = [
  { key: 'name', label: 'Nama tugas', required: true, placeholder: 'Apa yang perlu dipersiapkan?' },
  { key: 'category', label: 'Kategori', type: 'select', options: [...taskCategories], required: true },
  { key: 'deadline', label: 'Deadline', type: 'date', required: true },
  { key: 'priority', label: 'Prioritas', type: 'select', options: ['Rendah', 'Sedang', 'Tinggi'], required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Belum Mulai', 'Sedang Dikerjakan', 'Selesai'], required: true },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]
const filteredTasks = computed(() => data.tasks.filter((task) => (!categoryFilter.value || task.category === categoryFilter.value) && (!priorityFilter.value || task.priority === priorityFilter.value) && (!statusFilter.value || task.status === statusFilter.value)).sort((a, b) => {
  if (a.status === 'Selesai' && b.status !== 'Selesai') return 1
  if (b.status === 'Selesai' && a.status !== 'Selesai') return -1
  return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31')
}))
const completed = computed(() => data.tasks.filter((task) => task.status === 'Selesai').length)
const overdue = (task: ChecklistTask) => task.status !== 'Selesai' && task.deadline < todayISO()
function openNew() { editing.value = null; dialogOpen.value = true }
function openEdit(task: ChecklistTask) { editing.value = task; dialogOpen.value = true }
function submit(value: Record<string, string | number>) {
  const task = { name: String(value.name), category: String(value.category), deadline: String(value.deadline), priority: String(value.priority) as ChecklistTask['priority'], status: String(value.status) as ChecklistTask['status'], notes: String(value.notes || '') }
  if (editing.value) updateTask({ ...task, id: editing.value.id })
  else addTask(task)
  dialogOpen.value = false
  notify(editing.value ? 'Tugas berhasil diperbarui.' : 'Tugas berhasil ditambahkan.')
}
function toggleDone(task: ChecklistTask) {
  updateTask({ ...task, status: task.status === 'Selesai' ? 'Belum Mulai' : 'Selesai' })
  notify(task.status === 'Selesai' ? 'Tugas ditandai belum mulai.' : 'Selamat, tugas selesai!')
}
function remove(task: ChecklistTask) {
  if (window.confirm(`Hapus tugas "${task.name}"?`)) { deleteTask(task.id); notify('Tugas berhasil dihapus.') }
}
</script>

<template>
  <div class="page-content">
    <PageHeading title="Checklist Persiapan" description="Atur setiap detail, satu tugas pada satu waktu.">
      <button class="button button-primary" @click="openNew"><Plus :size="17" /> Tambah tugas</button>
    </PageHeading>
    <div class="summary-strip"><div><div class="summary-icon"><Check :size="17" /></div><span><strong>{{ completed }} / {{ data.tasks.length }}</strong><small>Tugas selesai</small></span></div><div class="summary-progress"><div class="progress-track"><div class="progress-fill" :style="{ width: `${data.tasks.length ? completed / data.tasks.length * 100 : 0}%` }"></div></div></div><span class="summary-count">{{ data.tasks.length ? Math.round(completed / data.tasks.length * 100) : 0 }}% selesai</span></div>
    <section class="panel">
      <div class="filter-toolbar"><div class="filter-title"><h3>Semua tugas</h3><span class="result-count">{{ filteredTasks.length }} tugas</span></div><div class="filters"><select v-model="categoryFilter" aria-label="Filter kategori"><option value="">Semua kategori</option><option v-for="category in taskCategories" :key="category">{{ category }}</option></select><select v-model="priorityFilter" aria-label="Filter prioritas"><option value="">Semua prioritas</option><option>Rendah</option><option>Sedang</option><option>Tinggi</option></select><select v-model="statusFilter" aria-label="Filter status"><option value="">Semua status</option><option>Belum Mulai</option><option>Sedang Dikerjakan</option><option>Selesai</option></select></div></div>
      <div v-if="filteredTasks.length" class="table-wrap"><table class="data-table"><thead><tr><th>TUGAS</th><th>KATEGORI</th><th>DEADLINE</th><th>PRIORITAS</th><th>STATUS</th><th class="actions-head">AKSI</th></tr></thead><tbody><tr v-for="task in filteredTasks" :key="task.id" :class="{ 'row-complete': task.status === 'Selesai' }"><td><div class="task-name-cell"><button class="check-toggle" :class="{ 'check-done': task.status === 'Selesai' }" :aria-label="task.status === 'Selesai' ? 'Tandai belum selesai' : 'Tandai selesai'" @click="toggleDone(task)"><Check v-if="task.status === 'Selesai'" :size="14" /><Circle v-else :size="18" /></button><div><strong>{{ task.name }}</strong><small v-if="task.notes">{{ task.notes }}</small></div><AlertCircle v-if="overdue(task)" class="overdue-icon" :size="15" /></div></td><td>{{ task.category }}</td><td><span :class="{ 'overdue-text': overdue(task) }">{{ formatDate(task.deadline) }}<small v-if="overdue(task)" class="overdue-label">Terlambat</small></span></td><td><StatusBadge :status="task.priority" /></td><td><StatusBadge :status="task.status" /></td><td><div class="table-actions"><button class="icon-button" aria-label="Edit tugas" @click="openEdit(task)"><Pencil :size="15" /></button><button class="icon-button danger-hover" aria-label="Hapus tugas" @click="remove(task)"><Trash2 :size="15" /></button></div></td></tr></tbody></table></div>
      <div v-else class="empty-state"><div class="empty-illustration"><Check :size="24" /></div><strong>{{ data.tasks.length ? 'Tidak ada tugas yang cocok' : 'Checklist kalian dimulai dari sini' }}</strong><span>{{ data.tasks.length ? 'Coba ubah filter untuk melihat tugas lainnya.' : 'Catat tugas pertama agar persiapan terasa lebih teratur.' }}</span><button v-if="!data.tasks.length" class="button button-outline" @click="openNew"><Plus :size="15" /> Tambah tugas</button></div>
    </section>
    <RecordDialog :open="dialogOpen" :title="editing ? 'Edit tugas' : 'Tambah tugas'" :fields="fields" :initial="editing || { status: 'Belum Mulai', priority: 'Sedang', deadline: todayISO() }" @close="dialogOpen = false" @submit="submit" />
  </div>
</template>
