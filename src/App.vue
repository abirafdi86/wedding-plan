<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  CalendarDays, CheckSquare, ChevronDown, CircleDollarSign, Flower2,
  HandCoins, LayoutDashboard, Menu, Package, Settings, Store, X,
} from 'lucide-vue-next'
import { useWeddingData } from './composables/useWeddingData'
import ToastMessage from './components/ToastMessage.vue'

const route = useRoute()
const { settings } = useWeddingData()
const mobileOpen = ref(false)
const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Checklist', to: '/checklist', icon: CheckSquare },
  { label: 'Seserahan', to: '/seserahan', icon: Package },
  { label: 'Anggaran', to: '/anggaran', icon: CircleDollarSign },
  { label: 'Pembayaran', to: '/pembayaran', icon: HandCoins },
  { label: 'Vendor', to: '/vendor', icon: Store },
  { label: 'Pengaturan', to: '/pengaturan', icon: Settings },
]
const pageTitle = computed(() => navItems.find((item) => item.to === route.path)?.label ?? 'Dashboard')
</script>

<template>
  <div class="app-shell">
    <div v-if="mobileOpen" class="mobile-scrim" @click="mobileOpen = false"></div>
    <aside class="sidebar" :class="{ 'sidebar-open': mobileOpen }">
      <div class="brand">
        <div class="brand-mark"><Flower2 :size="21" /></div>
        <div><strong>Wedding Plan</strong><span>Rencanakan bersama</span></div>
        <button class="icon-button sidebar-close" aria-label="Tutup menu" @click="mobileOpen = false"><X :size="18" /></button>
      </div>
      <div class="sidebar-caption">MENU UTAMA</div>
      <nav class="nav-list">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-active': route.path === item.to }"
          @click="mobileOpen = false"
        >
          <component :is="item.icon" :size="18" :stroke-width="1.8" />
          <span>{{ item.label }}</span>
          <span v-if="item.to === '/checklist'" class="nav-count">{{ useWeddingData().pendingTasks.value }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-note">
          <div class="note-icon"><CalendarDays :size="18" /></div>
          <p>Setiap langkah kecil membawa kalian lebih dekat ke hari istimewa.</p>
          <span>♡ Dengan penuh cinta</span>
        </div>
        <div class="profile">
          <div class="profile-avatar">♡</div>
          <div class="profile-names"><strong>{{ settings.coupleNames || 'Pasangan bahagia' }}</strong><span>Perjalanan menuju hari H</span></div>
          <ChevronDown :size="16" class="profile-chevron" />
        </div>
      </div>
    </aside>
    <main class="main-panel">
      <header class="topbar">
        <button class="icon-button mobile-menu" aria-label="Buka menu" @click="mobileOpen = true"><Menu :size="21" /></button>
        <div class="breadcrumb"><span>Wedding Plan</span><span class="crumb-slash">/</span><strong>{{ pageTitle }}</strong></div>
        <div class="topbar-right"><span class="today-label">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span><div class="topbar-avatar">♡</div></div>
      </header>
      <RouterView />
    </main>
    <ToastMessage />
  </div>
</template>
