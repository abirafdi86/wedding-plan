<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description: string }>()
</script>

<template>
  <div class="page-heading">
    <div><span class="eyebrow">{{ eyebrow || 'PERSIAPAN PERNIKAHAN' }}</span><h1>{{ title }}</h1><p>{{ description }}</p></div>
    <div class="heading-slot"><slot /></div>
  </div>
</template>
