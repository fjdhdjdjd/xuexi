import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children:[
      {
        path:'all',
        name:'all',
        component:() => import('../views/all.vue')
      },
      {
        path:'active',
        name:'active',
        component: () => import('../views/active.vue')
      },
      {
        path:'completed',
        name:'completed',
        component: () => import('../views/completed.vue')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
