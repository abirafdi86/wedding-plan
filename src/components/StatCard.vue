<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{ label: string; value: string; helper?: string; icon: Component; tone?: string }>()
</script>

<template>
  <article class="stat-card">
    <div class="stat-top"><span>{{ label }}</span><div class="stat-icon" :class="tone"><component :is="icon" :size="18" /></div></div>
    <strong class="stat-value">{{ value }}</strong>
    <span v-if="helper" class="stat-helper">{{ helper }}</span>
  </article>
</template>
