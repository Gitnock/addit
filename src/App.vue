<script setup lang="ts">
import '@fontsource/roboto-mono/400.css'; // Weight 400
import '@fontsource/roboto-mono/500.css'; // Weight 500.
import '@fontsource/roboto-mono/700.css'; // weight 700.
import { useStore } from '@/store/index';
let store = useStore();
if(localStorage.getItem('highscore') === null) {
  localStorage.setItem('highscore', '0');
}else {
  const hightscore = localStorage.getItem('highscore');
  if (typeof hightscore === 'string'){
    store.updateHighScore(parseInt(hightscore));
  }
  
}

import Menu from './components/Menu.vue';
import Game from './components/Game.vue';
</script>

<template>
  <div class="main-phone">
    <div class="content-container">
      <Menu v-if="store.getPage === 'home'" />
      <Game v-else-if="store.getPage === 'game'" />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/init.scss';

#app {
  background-color: grey;
  height: 100%;
}
body,
html {
  margin: 0;
  height: 100%;
}
.main-phone {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-container {
  max-width: 400px;
  width: 100%;
  height: 100%;
  background-color: #161516;
}

@media only screen and (max-width: 668px) {
  .main-phone {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content-container {
    max-width: 100%;
    width: 100%;
    height: 100%;
    background-color: #161516;
  }
}
</style>
