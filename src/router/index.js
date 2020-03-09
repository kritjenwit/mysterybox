import Vue from 'vue'
import VueRouter from 'vue-router'
import Games from '@/views/Games'
import EachGamesV3 from '@/views/EachGameV3'
import Login from '@/components/Login'
import ErrorPage from '@/components/ErrorPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Games',
    component: Games
  },
  {
    path : '/login',
    name : 'Login',
    component : Login
  },
  {
    path : '/box/:id',
    name : 'EachBox',
    component : EachGamesV3
  },
  {
    path : '/error',
    name : 'Error',
    component : ErrorPage
  }
]

const router = new VueRouter({
  routes
})

export default router
