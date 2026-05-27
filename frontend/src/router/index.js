import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Portal',
    // 采用路由懒加载，优化首屏性能
    component: () => import('../views/Portal/index.vue')
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('../views/Workspace/index.vue')
  },
]

const router = createRouter({
  // 使用 HTML5 模式，URL 更干净，没有 #
  history: createWebHistory(),
  routes
})

export default router