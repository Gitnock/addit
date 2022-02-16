<template>
  <div class="menu-main">
    <div class="menu-content">
      <div class="highscore roboto-mono-m">
        {{ store.getHighscore }}
      </div>
      <div class="bot-container">
        <div class="d-center-w input-tip">
          <div class="bx-flashing">
            press [space] to start, arrow keys to select
          </div>
        </div>
        <div class="buttons-container">
          <div class="btn-top">
            <div class="btn-wrapper flex-fill">
              <button
                class="btn-item btn-item-online btn-pop roboto-mono-m"
                @click=""
              >
                play online
              </button>
            </div>
            <div class="btn-wrapper">
              <button
                class="btn-item btn-item-settings btn-pop roboto-mono-m"
                @click="store.updateHighScore(0)"
              >
                <i class="bx bx-reset"></i>
              </button>
            </div>
          </div>
          <div class="btn-bot">
            <div class="btn-wrapper-full">
              <button
                class="btn-item btn-item-start btn-pop roboto-mono-r"
                @click="store.updatePage('game')"
              >
                start
              </button>
            </div>
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
  width: 100%;
}
.buttons-container {
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn-top {
  width: 100%;
  display: flex;
  max-width: 378px;
}
.btn-bot {
  width: 100%;
  max-width: 378px;
}
.btn-item-start {
  width: 100%;
  background-color: #262526;
  color: white;
  font-size: 32px;
}
.btn-item-online {
  width: 100%;
  background-color: #25514D;
  color: #00CD69;
  font-size: 23px;
}
.btn-item-settings {
  width: 78px;
  background-color: #4B1B0F;
  color: #FF5441;
  font-size: 32px;
}
.btn-item {
  height: 78px;
  border-radius: 8px;
  border: none;
}
.flex-fill{
  flex-grow: 1;
}
</style>
