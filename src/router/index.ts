import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '@/views/Main.vue';
import Online from '@/views/Online.vue';
const routes: Array<RouteRecordRaw> = [

    {
        path: '/',
        name: 'home',
        component: Main,
    }
    ,
    {
      path: '/online',
      name: 'online',
      component: Online,
    }
]

export default createRouter({
  history: createWebHistory(),
  routes
});
