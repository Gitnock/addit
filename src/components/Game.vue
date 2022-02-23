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
      <div class="combo-bar-container" v-if="isCombo">
        <div
          class="combo-bar"
          :style="{
            backgroundColor: randomColor,
          }"
          id="combo-bar"
        ></div>
      </div>
      <div class="f-question roboto-mono-m">{{ quest }}</div>
      <div class="buttons-container">
        <div class="btn-wrapper" id="btn1">
          <button
            class="btn-item roboto-mono-r"
            aria-label="left answer button"
            @click="handleClick(btn1)"
          >
            {{ btn1 }}
          </button>
        </div>
        <div class="btn-wrapper" id="btn2">
          <button
            class="btn-item roboto-mono-r"
            aria-label="right answer button"
            @click="handleClick(btn2)"
          >
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
import clickSfx from "../assets/normal-click.mp3";
import aceSfx from "../assets/ace-click.mp3";
import wrongSfx from "../assets/wrong-click.mp3";
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
let sound2: any = null;
let wrongSound: any = null;
let playRate = ref(1);
let randomColor = ref("");
//combo
let comboTimer: NodeJS.Timeout;
let comboCount = ref(0);
let comboNum = ref(0);
let isCombo = ref(false);
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
    comboHandler();
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
const initSound = () => {
  sound = new Howl({
    src: [clickSfx],
    preload: true,
    volume: 0.5,
  });
  sound2 = new Howl({
    src: [aceSfx],
    preload: true,
    volume: 0.5,
  });
  wrongSound = new Howl({
    src: [wrongSfx],
    preload: true,
    volume: 1,
  });
};

function gameOver() {
  isGameOver.value = true;
  clearInterval(interval);
  clearTimeout(timer);
  window.cancelAnimationFrame(gLoop);
  gLoop = null;
  if (score.value > store.getHighscore) {
    store.updateHighScore(score.value);
  }
  playWrong();
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
function addColorAnim(id: string) {
  clearTimeout(timer);
  const element = document.getElementById(id);
  if (element != null) {
    element.classList.add("add-RainBow");
    timer = setTimeout(() => {
      element.classList.remove("add-RainBow");
    }, 200);
  }
}
const comboHandler = () => {
  if (comboNum.value > 1) {
    randomColor.value = "hsla(" + ~~(360 * Math.random()) + "," + "70%," + "80%,1)";
    isCombo.value = true;
  } else {
    isCombo.value = false;
  }
};

const startTimer = () => {
  comboTimer = setTimeout(() => {
    playRate.value = 1;
    comboCount.value = 0;
    comboNum.value = 0;
    comboHandler();
  }, 1000);
};
const increaseRate = () => {
  clearTimeout(comboTimer);
  if (comboCount.value < 8) {
    comboCount.value = comboCount.value + 1;
  } else {
    comboCount.value = 0;
  }
  comboNum.value = comboNum.value + 1;
  if (playRate.value < 1.4) playRate.value = playRate.value + 0.05;
  else playRate.value = playRate.value + 0.01;
};

const playCorrect = () => {
  sound.rate(playRate.value);
  if (comboCount.value < 8) sound.play();
  else {
    sound2.rate(1.3);
    sound2.play();
    addColorAnim("combo-bar");
  }
  increaseRate();
  startTimer();
};

const playWrong = () => {
  wrongSound.play();
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
initSound();
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
  if (sound2 != null) {
    sound2.unload();
    sound2 = null;
  }
  if (wrongSound != null) {
    wrongSound.unload();
    wrongSound = null;
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
//bars
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

.combo-bar-container {
  width: 137px;
  height: 8px;
  background-color: #262526;
  overflow: hidden;
  position: absolute;
  border-radius: 8px;
  bottom: 180px;
  // left: 50%;
}
.combo-bar {
  width: 100%;
  height: 100%;
  transition: width 100ms linear;
  background-color: #ffdd00;
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

@media only screen and (max-width: 361px) {
  .f-question {
    font-size: 42px;
  }
  .btn-item {
    width: 152px;
  }
  // .buttons-container {
  //   position: absolute;
  //   bottom: 4rem;
  //   width: 100%;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   gap: 8px;
  // }
}
</style>
