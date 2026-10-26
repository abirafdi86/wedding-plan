export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0)

export const formatDate = (date: string) => {
  if (!date) return 'Belum ditentukan'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? 'Tanggal tidak valid' : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed)
}

export const todayISO = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
