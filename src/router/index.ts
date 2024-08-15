import { createRouter, createWebHistory } from 'vue-router'

// pages
import AuthorizationView from '../views/AuthorizationView.vue'
import BuildView from '../views/BuildView.vue'
import IndexView from '../views/IndexView.vue'
import UserProfileSettingsView from '../views/UserProfileSettingsView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import SearchResultView from '../views/SearchResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/user/:userID(\\d+)',
      component: UserProfileView
    },
    {
      path: '/auth',
      component: AuthorizationView
    },
    {
      path: '/settings/profile',
      component: UserProfileSettingsView
    },
    {
      path: '/search',
      component: SearchResultView
    },
    {
      path: '/build',
      component: BuildView
    }
  ]
})

export default router
