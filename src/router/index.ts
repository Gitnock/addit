import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import assetlinks from '../../.well-known/assetlinks.json';

const routes: Array<RouteRecordRaw> = [

    // {
    //     path: '/.well-known/assetlinks.json',
    //     name: 'assetlinks',
    //     component: assetlinks,
    // }
]

export default createRouter({
  history: createWebHistory(),
  routes
});
