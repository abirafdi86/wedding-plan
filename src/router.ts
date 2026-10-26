import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import ChecklistView from './views/ChecklistView.vue'
import ItemsView from './views/ItemsView.vue'
import PaymentsView from './views/PaymentsView.vue'
import VendorsView from './views/VendorsView.vue'
import SettingsView from './views/SettingsView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/checklist', component: ChecklistView },
    { path: '/seserahan', component: ItemsView, props: { mode: 'seserahan' } },
    { path: '/anggaran', component: ItemsView, props: { mode: 'anggaran' } },
    { path: '/pembayaran', component: PaymentsView },
    { path: '/vendor', component: VendorsView },
    { path: '/pengaturan', component: SettingsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
