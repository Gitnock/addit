<script setup lang="ts">
import { useStore } from '@/store/index'
let store = useStore();
import Menu from './components/Menu.vue'
import Game from './components/Game.vue'
</script>

<template>
  
  <Menu v-if="store.getPage === 'home'"/>
  <Game v-else-if="store.getPage === 'game'"/>
</template>

<style lang="scss">
@import '@/assets/styles/init.scss';

#app {
  background-color: #FFA2A2;
  height: 100%;
}
body,html{
  margin: 0;
  height: 100%;
}
</style>
