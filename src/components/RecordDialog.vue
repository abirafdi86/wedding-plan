<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'

export interface FormField {
  key: string
  label: string
  type?: 'text' | 'date' | 'number' | 'url' | 'tel' | 'select' | 'textarea'
  options?: (string | { value: string; label: string })[]
  required?: boolean
  min?: number
  step?: number
  placeholder?: string
}

const props = defineProps<{
  open: boolean
  title: string
  fields: FormField[]
  initial?: Record<string, string | number>
  submitLabel?: string
}>()
const emit = defineEmits<{ close: []; submit: [value: Record<string, string | number>] }>()
const draft = reactive<Record<string, string | number>>({})
const visible = computed(() => props.open)

watch([() => props.open, () => props.initial], () => {
  if (!props.open) return
  for (const key of Object.keys(draft)) delete draft[key]
  for (const field of props.fields) draft[field.key] = props.initial?.[field.key] ?? (field.type === 'number' ? 0 : '')
}, { immediate: true })

function save() {
  const value = { ...draft }
  for (const field of props.fields) {
    if (field.type === 'number') value[field.key] = Number(value[field.key] || 0)
  }
  emit('submit', value)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-backdrop" @click.self="emit('close')">
      <form class="dialog-card" @submit.prevent="save">
        <div class="dialog-heading"><div><span class="eyebrow">WEDDING PLAN</span><h2>{{ title }}</h2></div><button type="button" class="icon-button" aria-label="Tutup" @click="emit('close')"><X :size="19" /></button></div>
        <div class="dialog-fields">
          <label v-for="field in fields" :key="field.key" class="form-field" :class="{ 'field-wide': field.type === 'textarea' }">
            <span>{{ field.label }}<b v-if="field.required" class="required-mark"> *</b></span>
            <select v-if="field.type === 'select'" v-model="draft[field.key]" :required="field.required">
              <option v-if="!field.required" value="">Pilih {{ field.label.toLowerCase() }}</option>
              <option v-for="option in field.options" :key="typeof option === 'string' ? option : option.value" :value="typeof option === 'string' ? option : option.value">{{ typeof option === 'string' ? option : option.label }}</option>
            </select>
            <textarea v-else-if="field.type === 'textarea'" v-model="draft[field.key]" rows="3" :placeholder="field.placeholder" />
            <input v-else v-model="draft[field.key]" :type="field.type || 'text'" :min="field.min" :step="field.step" :required="field.required" :placeholder="field.placeholder" />
          </label>
        </div>
        <div class="dialog-actions"><button type="button" class="button button-quiet" @click="emit('close')">Batal</button><button type="submit" class="button button-primary">{{ submitLabel || 'Simpan' }}</button></div>
      </form>
    </div>
  </Teleport>
</template>
