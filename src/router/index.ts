import {createRouter,createWebHistory,RouteRecordRaw} from 'vue-router'
const routes:Array<RouteRecordRaw> = [{
  path:'/home',
  name:'',
  component:()=> import('../pages/Home.vue')
}]
const router = createRouter({
  history:createWebHistory(),
  routes
})
export default router