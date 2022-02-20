<template>
  <div class="game-main">
    <div class="game-content">
      <div class="bar-container">
        <div
          class="bar"
          ref="sumbitBar"
          :style="{ width: (100 / 2000) * count + '%' }"
        ></div>
      </div>
      <div class="f-question roboto-mono-m">{{ quest }}</div>
      <div class="buttons-container">
        <div class="btn-wrapper" id="btn1">
          <button class="btn-item roboto-mono-r" @click="handleClick(btn1)">
            {{ btn1 }}
          </button>
        </div>
        <div class="btn-wrapper" id="btn2">
          <button class="btn-item roboto-mono-r" @click="handleClick(btn2)">
            {{ btn2 }}
          </button>
        </div>
      </div>
    </div>
    <teleport to="body">
      <lastScoreVue :score="score" v-if="isGameOver" />
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import lastScoreVue from "@/modals/lastScore.vue";
import { useStore } from "@/store/index";
import { onUnmounted, inject } from "vue";
import { ref } from "vue";
import clickSfx from "../assets/normal_click.mp3";
import { Howl } from "howler";
const store = useStore();
let count = ref(0);
let quest = ref("");
let input = ref(0);
let btn1 = ref(0);
let btn2 = ref(0);
let ans = ref(0);
let score = ref(0);
let isStart = ref(true);
let isGameOver = ref(false);
let interval: any;
let level: number = 1;
let gLoop: any = null;
let timer: NodeJS.Timeout;
let sound: any = null;

//combo
let comboTimer: NodeJS.Timeout;
let playRate = ref(1);
let comboCount = ref(0);
// this function return a rundom number between min and max (both included)
function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function countDown() {
  count.value = 2000;
  interval = setInterval(() => {
    count.value -= 100;
    if (count.value === 0) {
      gameOver();
    }
  }, 100);
}

function gameLoop() {
  //GAME LOOP contents here
  if (input.value !== 0) {
    check(input.value);
    input.value = 0;
  }
  if (gLoop != null) {
    window.requestAnimationFrame(gameLoop);
  }
}

function init(max: number) {
  clearInterval(interval);
  countDown();
  const num1 = getRndInteger(1, max);
  const num2 = getRndInteger(1, max);
  ans.value = num1 + num2;
  quest.value = `${num1} + ${num2}`;
  if (getRndInteger(0, 1) === 0) {
    btn1.value = ans.value;
    btn2.value = getRndInteger(1, max);
  } else {
    btn1.value = getRndInteger(1, max);
    btn2.value = ans.value;
  }
}

function gameOver() {
  isGameOver.value = true;
  clearInterval(interval);
  clearTimeout(timer);
  window.cancelAnimationFrame(gLoop);
  gLoop = null;
  if (score.value > store.getHighscore) {
    store.updateHighScore(score.value);
  }
}

function check(num: number) {
  if (num === ans.value) {
    score.value++;
    playCorrect();
    init(level++);
  } else {
    gameOver();
  }
  if (isStart.value === true) {
    isStart.value = false;
  }
}
function endGame() {
  store.updatePage("home");
}
const handleClick = (ans: number) => {
  input.value = ans;
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

const startTimer = () => {
  comboTimer = setTimeout(() => {
    playRate.value = 1;
    comboCount.value = 0;
  }, 1000);
};
const increaseRate = () => {
  clearTimeout(comboTimer);
  // if (comboCount.value < 5) {
  //   comboCount.value = comboCount.value + 1;
  // } else {
  //   console.log("Combo", comboCount.value);
  //   playRate.value = 1;
  //   comboCount.value = 0;
  // }
  if (playRate.value < 1.4) playRate.value = playRate.value + 0.1;
};

const playCorrect = () => {
  sound = new Howl({
    src: [clickSfx],
    volume: 0.09,
    rate: playRate.value,
  });

  sound.play();
  increaseRate();
  startTimer();
};
const keyboardEvents = (event: KeyboardEvent) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
      input.value = btn1.value;
      addBtnAnim("btn1");
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
      input.value = btn2.value;
      addBtnAnim("btn2");
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
};
//keyup events
window.addEventListener("keydown", keyboardEvents, false);

//start game
gLoop = window.requestAnimationFrame(gameLoop);
init(level);

//event bus
const emitter: any = inject("emitter");
emitter.on("endGame", () => {
  endGame();
});

onUnmounted(() => {
  window.cancelAnimationFrame(gLoop);
  window.removeEventListener("keydown", keyboardEvents, false);

  if (sound != null) {
    sound.unload();
    sound = null;
  }
});
</script>
<style lang="scss" scoped>
.game-main {
  height: 100%;
}
.game-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
//bar
.bar-container {
  width: 100%;
  height: 24px;
  background-color: transparent;
  overflow: hidden;
  position: absolute;
  top: 0;
}
.bar {
  width: 100%;
  height: 100%;
  transition: width 100ms linear;
  background-color: whitesmoke;
}
//question
.f-question {
  font-size: 82px;
  color: white;
}
//buttons
.buttons-container {
  position: absolute;
  bottom: 4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
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
