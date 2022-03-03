import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import mitt from 'mitt';
import VueGtag from 'vue-gtag';
const emitter = mitt();

const app = createApp(App);
app.use(VueGtag, {
  config: { id: import.meta.env.VITE_MEASUREMENT_ID },
  params: {
    anonymize_ip: true,
  },
});
app.use(createPinia());
app.provide('emitter', emitter);
app.mount('#app');
