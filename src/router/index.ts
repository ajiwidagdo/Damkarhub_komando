import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      { path: '', name: 'login', component: () => import('../pages/LoginPage.vue') },
    ],
    meta: { guest: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { auth: true },
    children: [
      { path: '', name: 'overview', component: () => import('../pages/OverviewPage.vue') },
      { path: 'reports', name: 'reports', component: () => import('../pages/ReportListPage.vue') },
      { path: 'reports/:id', name: 'report-detail', component: () => import('../pages/ReportDetailPage.vue') },
      { path: 'personnel', name: 'personnel', component: () => import('../pages/PersonnelListPage.vue') },
      { path: 'fleet', name: 'fleet', component: () => import('../pages/FleetPage.vue') },
      { path: 'survey', name: 'survey', component: () => import('../pages/SurveyPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('../pages/SettingsPage.vue') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Mock auth guard — flag di localStorage (tanpa auth beneran)
router.beforeEach((to) => {
  const loggedIn = localStorage.getItem('komando_auth') === '1'
  if (to.meta.auth && !loggedIn) return { name: 'login' }
  if (to.meta.guest && loggedIn) return { name: 'overview' }
  return true
})

export default router
