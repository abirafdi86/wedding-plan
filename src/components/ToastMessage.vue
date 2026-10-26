<script setup lang="ts">
import { CircleCheck, CircleX } from 'lucide-vue-next'
import { useWeddingData } from '../composables/useWeddingData'
const { toast } = useWeddingData()
</script>

<template>
  <Transition name="toast"><div v-if="toast" class="toast-message" :class="`toast-${toast.type}`"><CircleCheck v-if="toast.type === 'success'" :size="18" /><CircleX v-else :size="18" />{{ toast.message }}</div></Transition>
</template>
