import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/workers',
    name: 'Workers',
    component: () => import('../views/Workers.vue')
  },
  {
    path: '/manuscripts',
    name: 'Manuscripts',
    component: () => import('../views/Manuscripts.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
