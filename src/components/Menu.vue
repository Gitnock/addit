<template>
  <div class="menu-main">
    <div class="menu-content">
      <div class="app-title roboto-mono-b">ADD+IT</div>
      <div class="highscore roboto-mono-m">
        {{ store.getHighscore }}
      </div>
      <div class="bot-container">
        <div class="d-flex d-center-w input-tip">
          <div class="bx-flashing">press [space] to start, arrow keys to select</div>
        </div>
        <div class="buttons-container">
          <div class="btn-top">
            <div class="btn-wrapper flex-fill">
              <button class="btn-item btn-item-online btn-pop roboto-mono-m">
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
                @click="startGame()"
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
import { useStore } from "@/store/index";
import { ref, onUnmounted } from "vue";

import clickSfx from "../assets/normal_click.mp3";
import { Howl } from "howler";
const store = useStore();

const playMusic = () => {
  const playFound = new Howl({
    src: [clickSfx],
    volume: 0.01,
  });

  playFound.play();
};
const startGame = () => {
  store.updatePage("game");
  playMusic();
};
const keyboardEvents = () => {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      startGame();
    }
  });
};
window.addEventListener("keyup", keyboardEvents);
onUnmounted(() => {
  window.removeEventListener("keyup", keyboardEvents);
});
</script>
<style lang="scss" scoped>
.menu-main {
  height: 100%;
}
.app-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #00cd69;
  position: absolute;
  top: 20%;
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
  background-color: #25514d;
  color: #00cd69;
  font-size: 23px;
}
.btn-item-settings {
  width: 78px;
  background-color: #4b1b0f;
  color: #ff5441;
  font-size: 32px;
}
.btn-item {
  height: 78px;
  border-radius: 8px;
  border: none;
}
.flex-fill {
  flex-grow: 1;
}
</style>
