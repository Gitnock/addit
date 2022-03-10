<template>
  <div class="menu-main">
    <div class="menu-content">
      <a
        href="https://partyapp.gg/"
        class="party-alpha d-flex d-center-w no-link"
        v-if="false"
      >
        <p class="roboto-mono-m">don't click me for PartyApp</p>
      </a>
      <button
        class="btn-reset"
        @click="isReset = !isReset"
        aria-label="reset game button"
      >
        <i class="bx bx-reset"></i>
      </button>
      <div class="app-title roboto-mono-b">ADD+IT</div>
      <div class="d-flex-column d-center-h">
        <div class="highscore roboto-mono-m">
          {{ store.getHighscore }}
        </div>
        <div class="comboscore roboto-mono-m">Combo: {{ store.getCombo }}</div>
      </div>

      <div class="bot-container">
        <div class="d-flex d-center-w input-tip">
          <div class="bx-flashing">press [space] to start, arrow keys to select</div>
        </div>
        <div class="buttons-container">
          <div class="btn-top">
            <div class="btn-wrapper flex-fill" id="online">
              <button
                class="btn-item btn-item-online btn-pop roboto-mono-m"
                aria-label="play online button"
                @click="onOnline()"
              >
                online soon...
              </button>
            </div>
            <div class="btn-wrapper">
              <button
                class="btn-item btn-item-settings btn-pop roboto-mono-m"
                @click="shareScore"
                aria-label="share highscore button"
              >
                <i class="bx bx-share-alt"></i>
              </button>
            </div>
          </div>
          <div class="btn-bot">
            <div class="btn-wrapper-full" id="start">
              <button
                class="btn-item btn-item-start btn-pop roboto-mono-r"
                @click="startGame()"
                aria-label="start game button"
              >
                start
              </button>
            </div>
          </div>
        </div>
      </div>
      <p class="versionTxt roboto-mono-m">v-0.2.3</p>
    </div>
    <teleport to="body">
      <resetScore v-if="isReset" />
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from "@/store/index";
import { ref, onUnmounted, inject } from "vue";

import clickSfx from "../assets/normal-click.mp3";
import { Howl } from "howler";
import resetScore from "@/modals/resetHigh.vue";
const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;
const store = useStore();
let sound: any = null;
let isReset = ref(false);
let timer: NodeJS.Timeout;
const shareData = {
  title: "Addit",
  text: `${store.getHighscore} on addit can you beat it?`,
  url: "https://addit.gg",
};
const onOnline = () => {
  addBtnAnim("online");
};

const playMusic = () => {
  sound.play();
};

function addBtnAnim(id: string) {
  clearTimeout(timer);
  const element = document.getElementById(id);
  if (element != null) {
    element.classList.add("btn-active");
    timer = setTimeout(() => {
      element.classList.remove("btn-active");
    }, 50);
  }
}

const initSound = () => {
  sound = new Howl({
    src: [clickSfx],
    preload: true,
    volume: 0.5,
  });
};
const shareScore = () => {
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    alert("Your browser doesn't support the Share API");
  }
};
const startGame = () => {
  addBtnAnim("start");
  playMusic();
  store.updatePage("game");
};

const keyboardEvents = (e: KeyboardEvent) => {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  if (e.key === " ") {
    startGame();
  }
};

//init menu
initSound();
//event bus
const emitter: any = inject("emitter");
emitter.on("onScore", () => {
  store.updateHighScore(0);
  isReset.value = false;
});
emitter.on("onModal", () => {
  isReset.value = false;
});

if (!isMobile) window.addEventListener("keydown", keyboardEvents, false);
onUnmounted(() => {
  window.removeEventListener("keydown", keyboardEvents, false);
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
.comboscore {
  font-size: 18px;
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
  background-color: #253851;
  color: #0076ec;
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
.versionTxt {
  position: absolute;
  bottom: 15px;
  right: 45%;
  font-size: 14px;
  color: gray;
}
.party-alpha {
  position: absolute;
  top: 20px;
  // left: 50%;
  width: 300px;
  border-radius: 12px;
  padding: 0 12px;
  color: white;
  background-color: #ff5e63;
}

.btn-reset {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 32px;
}
</style>
