<template>
  <div class="menu-main">
    <div class="menu-content">
      <div class="highscore roboto-mono-m">
        {{ store.getHighscore }}
      </div>
      <div class="bot-container">
        <div class="d-center-w input-tip">
          <div class='bx-flashing' >press [space] to start, arrow keys to select</div>
        </div>
        <div class="buttons-container">
          <div class="btn-wrapper">
            <button
              class="btn-item btn-pop roboto-mono-r"
              @click="store.updatePage('game')"
            >
              start
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store/index';
import { ref } from 'vue';
const store = useStore();

window.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    store.updatePage('game');
  }
});
</script>
<style lang="scss" scoped>
.menu-main {
  height: 100%;
}
.menu-content {
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
}
.highscore {
  font-size: 101px;
}

.bot-container {
  position: absolute;
  bottom: 4rem;
}
.buttons-container {
  // position: absolute;
  // bottom: 4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-item {
  width: 169px;
  height: 78px;
  background-color: #262526;
  color: white;
  border-radius: 16px;
  font-size: 32px;
  border: none;
}
</style>
