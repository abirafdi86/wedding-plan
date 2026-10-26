import { computed, reactive, ref, watch } from 'vue'
import type { ChecklistTask, PaymentTransaction, WeddingData, WeddingItem, WeddingSettings, Vendor } from '../types'
import { todayISO } from '../utils/format'
import { maharSeed, seserahanSeed, weddingPlanTaskSeed } from '../data/weddingPlannerSeed'

const STORAGE_KEY = 'wedding-plan-v1'
const DATA_SEED_VERSION = 1
const seedItems = [...seserahanSeed, ...maharSeed]
const defaultData = (): WeddingData => ({
  settings: { coupleNames: '', weddingDate: '', budgetTarget: 0, currency: 'IDR' },
  tasks: weddingPlanTaskSeed.map((task) => ({ ...task })),
  items: seedItems.map((item) => ({ ...item })),
  payments: [],
  vendors: [],
  seedVersion: DATA_SEED_VERSION,
})

function loadData(): WeddingData {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultData()
  try {
    const parsed = JSON.parse(saved) as Partial<WeddingData>
    const data: WeddingData = {
      ...defaultData(),
      ...parsed,
      settings: { ...defaultData().settings, ...parsed.settings },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      items: Array.isArray(parsed.items) ? parsed.items : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors : [],
      seedVersion: parsed.seedVersion ?? 0,
    }
    if ((data.seedVersion ?? 0) < DATA_SEED_VERSION) {
      for (const seed of seedItems) {
        const alreadyExists = data.items.some((item) => item.id === seed.id || (item.name === seed.name && item.category === seed.category))
        if (!alreadyExists) data.items.push({ ...seed })
      }
      for (const seed of weddingPlanTaskSeed) {
        const alreadyExists = data.tasks.some((task) => task.id === seed.id || (task.name === seed.name && task.phase === seed.phase))
        if (!alreadyExists) data.tasks.push({ ...seed })
      }
      data.seedVersion = DATA_SEED_VERSION
    }
    return data
  } catch (error) {
    console.error('Data Wedding Plan tidak dapat dibaca dari penyimpanan lokal.', error)
    return defaultData()
  }
}

const data = reactive<WeddingData>(loadData())
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(data, () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Data Wedding Plan gagal disimpan.', error)
    notify('Data gagal disimpan. Periksa ruang penyimpanan browser.', 'error')
  }
}, { deep: true })

function notify(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3200)
}

const paymentTotal = (itemId: string, excludeId?: string) =>
  data.payments.filter((payment) => payment.itemId === itemId && payment.id !== excludeId).reduce((sum, payment) => sum + payment.amount, 0)
const budgetFor = (item: WeddingItem) => (item.actualCost > 0 ? item.actualCost : item.estimatedCost) * Math.max(1, item.quantity || 1)
const paidFor = (item: WeddingItem) => paymentTotal(item.id)
const remainingFor = (item: WeddingItem) => Math.max(0, budgetFor(item) - paidFor(item))
const statusFor = (item: WeddingItem): 'Belum Bayar' | 'Cicilan' | 'Lunas' => {
  const paid = paidFor(item)
  if (paid <= 0) return 'Belum Bayar'
  return paid >= budgetFor(item) ? 'Lunas' : 'Cicilan'
}

function addTask(task: Omit<ChecklistTask, 'id'>) {
  data.tasks.push({ ...task, id: crypto.randomUUID() })
}
function updateTask(task: ChecklistTask) {
  const index = data.tasks.findIndex((entry) => entry.id === task.id)
  if (index >= 0) data.tasks[index] = { ...task }
}
function deleteTask(id: string) { data.tasks = data.tasks.filter((task) => task.id !== id) }

function addItem(item: Omit<WeddingItem, 'id'>) {
  data.items.push({ ...item, id: crypto.randomUUID() })
}
function updateItem(item: WeddingItem) {
  const index = data.items.findIndex((entry) => entry.id === item.id)
  if (index >= 0) data.items[index] = { ...item }
}
function deleteItem(id: string) {
  data.items = data.items.filter((item) => item.id !== id)
  data.payments = data.payments.filter((payment) => payment.itemId !== id)
}

function addPayment(payment: Omit<PaymentTransaction, 'id'>) {
  const item = data.items.find((entry) => entry.id === payment.itemId)
  if (!item) throw new Error('Kebutuhan yang dipilih tidak ditemukan.')
  if (payment.amount <= 0 || payment.amount + paidFor(item) > budgetFor(item)) {
    throw new Error('Nominal pembayaran melebihi sisa tagihan.')
  }
  data.payments.push({ ...payment, id: crypto.randomUUID() })
}
function updatePayment(payment: PaymentTransaction) {
  const item = data.items.find((entry) => entry.id === payment.itemId)
  if (!item) throw new Error('Kebutuhan yang dipilih tidak ditemukan.')
  if (payment.amount <= 0 || payment.amount + paymentTotal(item.id, payment.id) > budgetFor(item)) {
    throw new Error('Nominal pembayaran melebihi sisa tagihan.')
  }
  const index = data.payments.findIndex((entry) => entry.id === payment.id)
  if (index >= 0) data.payments[index] = { ...payment }
}
function deletePayment(id: string) { data.payments = data.payments.filter((payment) => payment.id !== id) }

function addVendor(vendor: Omit<Vendor, 'id'>) {
  data.vendors.push({ ...vendor, id: crypto.randomUUID() })
}
function updateVendor(vendor: Vendor) {
  const index = data.vendors.findIndex((entry) => entry.id === vendor.id)
  if (index >= 0) data.vendors[index] = { ...vendor }
}
function deleteVendor(id: string) { data.vendors = data.vendors.filter((vendor) => vendor.id !== id) }
function updateSettings(settings: WeddingSettings) { Object.assign(data.settings, settings) }
function resetData() {
  Object.assign(data, defaultData())
  notify('Seluruh data berhasil direset.')
}

export function useWeddingData() {
  const pendingTasks = computed(() => data.tasks.filter((task) => task.status !== 'Selesai').length)
  const dashboard = computed(() => {
    const estimated = data.items.reduce((sum, item) => sum + item.estimatedCost * Math.max(1, item.quantity || 1), 0)
    const actual = data.items.reduce((sum, item) => sum + budgetFor(item), 0)
    const paid = data.payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalTasks = data.tasks.length
    const completedTasks = data.tasks.filter((task) => task.status === 'Selesai').length
    const paidItems = data.items.filter((item) => statusFor(item) === 'Lunas').length
    const openItems = data.items.length - paidItems
    return {
      estimated, actual, paid, remaining: Math.max(0, actual - paid),
      paymentProgress: actual ? Math.min(100, Math.round((paid / actual) * 100)) : 0,
      preparationProgress: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      paidItems, openItems, completedTasks, totalTasks,
    }
  })
  const overdueTasks = computed(() => data.tasks.filter((task) => task.status !== 'Selesai' && task.deadline && task.deadline < todayISO()))
  return {
    data, settings: data.settings, toast, pendingTasks, dashboard, overdueTasks,
    paymentTotal, paidFor, budgetFor, remainingFor, statusFor,
    addTask, updateTask, deleteTask, addItem, updateItem, deleteItem,
    addPayment, updatePayment, deletePayment, addVendor, updateVendor, deleteVendor,
    updateSettings, resetData, notify,
  }
}
