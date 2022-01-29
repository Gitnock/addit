<template>
  <div class="game-main">
    <div class="game-content">
      <div class="bar-container">
        <div
          class="bar"
          ref="sumbitBar"
          :style="{ width: (count / 2) * 100 + '%' }"
        ></div>
      </div>
      <div class="f-question roboto-mono-m">{{ quest }}</div>
      <div class="buttons-container">
        <div class="btn-wrapper" id="btn1">
          <button class="btn-item roboto-mono-r" @click="input = btn1" >{{ btn1 }} </button>
        </div>
        <div class="btn-wrapper" id="btn2">
          <button class="btn-item roboto-mono-r" @click="input = btn2" >{{ btn2 }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store/index';
import { onUnmounted } from 'vue';
import { ref } from 'vue';
const store = useStore();
let count = ref(0);
let quest = ref('');
let input = ref(0);
let btn1 = ref(0);
let btn2 = ref(0);
let ans = ref(0);
let score = ref(0);
let isStart = ref(true);
let interval: any;
let level: number = 1;
let gLoop: any = null;

// this function return a rundom number between min and max (both included)
function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function countDown() {
  count.value = 2;
  // interval = setInterval(() => {
  //   count.value--;
  //   if (count.value === 0) {
  //     clearInterval(interval);
  //   }
  // }, 1000);
}

function gameLoop() {
  //GAME LOOP contents here
  if (input.value !== 0) {
    check(input.value);
    input.value = 0;
  }

  if (count.value === 0) {
    endGame();
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

function check(num: number) {
  if (num === ans.value) {
    score.value++;
    init(level++);
  } else {
    endGame();
  }
  if (isStart.value === true) {
    isStart.value = false;
  }
}
function endGame() {
  window.cancelAnimationFrame(gLoop);
  gLoop = null;
  clearInterval(interval);
  if (score.value > store.getHighscore) {
    store.updateHighscore(score.value);
  }

  store.updatePage('home');
}

function addBtnAnim(id: string) {
  const element = document.getElementById(id);
  if (element != null) {
    element.classList.add('btn-active');
    setTimeout(() => {
      element.classList.remove('btn-active');
    }, 100);
  }
}

//keyup events
window.addEventListener(
  'keydown', (event)=> {
    // if (event.defaultPrevented) {
    //   return; // Do nothing if the event was already processed
    // }

    switch (event.key) {
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        input.value = btn1.value;
        addBtnAnim('btn1');
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        input.value = btn2.value;
        addBtnAnim('btn2');
        break;
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        // Do something for "esc" key press.
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  false,
);

//start game
gLoop = window.requestAnimationFrame(gameLoop);

init(level);

onUnmounted(() => {
  window.cancelAnimationFrame(gLoop);
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
  width: 10%;
  height: 100%;
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
