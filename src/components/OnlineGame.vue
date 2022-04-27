<template>
  <div class="game-main">
    <div class="game-content">
      <div class="bars">
        <div class="bar-container">
          <div class="bar" ref="sumbitBar" :style="{ width: 100 + '%' }"></div>
        </div>
        <div class="online-bars-">
          <div
            class="online-bars d-flex d-center-h"
            v-for="(item, index) in testItems"
            :key="index"
          >
            <div class="online-circle d-flex d-center-h d-center-w">
              <div class="roboto-mono-m">G</div>
            </div>
            <div class="online-bar-container d-flex d-center-h">
              <div class="online-bar"></div>
            </div>
            <div class="online-finish-bar"></div>
          </div>
        </div>
      </div>

      <div style="color: white" v-if="false">{{ fps }}</div>
      <div class="combo-bar-container" v-if="isCombo">
        <div
          class="combo-bar"
          :style="{ backgroundColor: randomColor }"
          id="combo-bar"
        />
      </div>
      <div class="f-question roboto-mono-m">{{ quest }}</div>
      <div class="buttons-container">
        <div class="btn-wrapper" id="btn1">
          <button
            class="btn-item roboto-mono-r"
            aria-label="left answer button"
            @click="handleClick(btn1, 'btn1')"
          >
            {{ btn1 }}
          </button>
        </div>
        <div class="btn-wrapper" id="btn2">
          <button
            class="btn-item roboto-mono-r"
            aria-label="right answer button"
            @click="handleClick(btn2, 'btn2')"
          >
            {{ btn2 }}
          </button>
        </div>
      </div>
    </div>
    <teleport to="body">
      <lastScoreVue :score="score" :combo="comboHighScore" v-if="isGameOver" />
    </teleport>
  </div>
</template>
<script lang="ts" setup>
import lastScoreVue from '@/modals/lastScore.vue';
import { useStore } from '@/store/index';
import { ref, onUnmounted, inject } from 'vue';
import clickSfx from '../assets/normal-click.mp3';
import aceSfx from '../assets/ace-click.mp3';
import wrongSfx from '../assets/wrong-click.mp3';
import highscoreSfx from '../assets/highscore.mp3';
import { Howl } from 'howler';
import confetti from 'canvas-confetti';
confetti.Promise = new Promise<void>((resolve, reject) => {
  resolve();
});
const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;
const store = useStore();
let count = ref(0);
let quest = ref('');
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
let barTimer: NodeJS.Timeout;
let sound: any = null;
let sound2: any = null;
let wrongSound: any = null;
let highscoreSound: any = null;
let playRate = 1;
let randomColor = ref('');
let testItems = ref(['a', 'b']);
//combo
let comboTimer: NodeJS.Timeout;
let comboCount = 0;
let comboNum = ref(0);
let comboHighScore = ref(0);
let isCombo = ref(false);
//fps test
let fps = ref(0);
let initTime = Date.now();
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
  // fpsTest();
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
  let wrong: number = 0;
  if (getRndInteger(0, 1) === 0) {
    btn1.value = ans.value;
    do {
      if (ans.value > 11) wrong = wrongAlgro();
      else
        wrong = getRndInteger(
          ans.value - 3 > 1 ? ans.value - 3 : 1,
          ans.value + 3,
        );
    } while (wrong <= 0 || wrong === ans.value);
    btn2.value = wrong;
  } else {
    btn2.value = ans.value;
    do {
      if (ans.value > 11) wrong = wrongAlgro();
      else
        wrong = getRndInteger(
          ans.value - 3 > 1 ? ans.value - 3 : 1,
          ans.value + 3,
        );
    } while (wrong <= 0 || wrong === ans.value);
    btn1.value = wrong;
  }
}
const wrongAlgro = () => {
  let wrongAns: number = 0;
  const ansLength = ans.value.toString().length;
  if (getRndInteger(0, 1)) {
    switch (ansLength) {
      case 2:
        const tenth = Math.floor((ans.value / 10) % 10);
        if (tenth > 3)
          wrongAns =
            getRndInteger(tenth - 2 > 1 ? tenth - 2 : 1, tenth + 2) * 10 +
            (ans.value % 10);
        else
          wrongAns =
            getRndInteger(tenth - 1 > 1 ? tenth - 1 : 1, tenth + 1) * 10 +
            (ans.value % 10);
        break;
      case 3:
        wrongAns = getRndInteger(ans.value - 10, ans.value + 10);
        break;
      default:
        wrongAns = getRndInteger(ans.value - 10, ans.value + 10);
        break;
    }
  } else {
    wrongAns = getRndInteger(ans.value - 3, ans.value + 3);
  }
  return wrongAns;
};

const initConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
  playHighscore();
};
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
  highscoreSound = new Howl({
    src: [highscoreSfx],
    preload: true,
    volume: 0.5,
  });
};

function gameOver() {
  isGameOver.value = true;
  clearInterval(interval);
  clearTimeout(timer);
  clearTimeout(barTimer);
  window.cancelAnimationFrame(gLoop);
  gLoop = null;
  if (score.value > store.getHighscore) {
    store.updateHighScore(score.value);
    initConfetti();
  } else {
    playWrong();
  }
  if (comboHighScore.value > store.getCombo) {
    store.updateCombo(comboHighScore.value);
  }
}

function check(num: number) {
  if (num === ans.value) {
    playCorrect();
    score.value++;
    init(level++);
  } else {
    gameOver();
  }
  if (isStart.value === true) {
    isStart.value = false;
  }
}
function endGame() {
  store.updatePage('home');
}
const handleClick = (ans: number, id: string) => {
  input.value = ans;
  addBtnAnim(id);
};

function addBtnAnim(id: string) {
  clearTimeout(timer);
  const element = document.getElementById(id);
  if (element != null) {
    element.classList.add('btn-active');
    timer = setTimeout(() => {
      element.classList.remove('btn-active');
    }, 50);
  }
}
function addColorAnim(id: string) {
  clearTimeout(barTimer);
  const element = document.getElementById(id);
  if (element != null) {
    element.classList.add('add-RainBow');
    barTimer = setTimeout(() => {
      element.classList.remove('add-RainBow');
    }, 200);
  }
}
// function addActive(id: string) {
//   clearTimeout(timer);
//   const element = document.getElementById(id);
//   if (element != null) {
//     element.classList.add("active");
//     timer = setTimeout(() => {
//       element.classList.remove("active");
//     }, 50);
//   }
// }
const comboHandler = () => {
  if (comboNum.value > 1) {
    randomColor.value =
      'hsla(' + ~~(360 * Math.random()) + ',' + '70%,' + '80%,1)';
    isCombo.value = true;
  } else {
    isCombo.value = false;
  }
};

const startTimer = () => {
  comboTimer = setTimeout(() => {
    playRate = 1;
    comboCount = 0;
    comboNum.value = 0;
    comboHandler();
  }, 1000);
};
const increaseRate = () => {
  clearTimeout(comboTimer);
  if (comboCount < 8) {
    comboCount = comboCount + 1;
  } else {
    comboCount = 0;
  }
  comboNum.value = comboNum.value + 1;
  if (comboNum.value > comboHighScore.value)
    comboHighScore.value = comboNum.value;

  if (playRate < 1.4) playRate = playRate + 0.05;
  else playRate = playRate + 0.01;
};

const playCorrect = () => {
  sound.rate(playRate);
  if (comboCount < 8) sound.play();
  else {
    sound2.rate(1.3);
    sound2.play();
    addColorAnim('combo-bar');
  }
  increaseRate();
  startTimer();
};

const playWrong = () => {
  wrongSound.play();
};
const playHighscore = () => {
  highscoreSound.play();
};

const keyboardEvents = (event: KeyboardEvent) => {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

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
};
//keyup events
if (!isMobile) window.addEventListener('keydown', keyboardEvents, false);

const fpsTest = () => {
  let now = Date.now();
  fps.value = Math.round(1000 / (now - initTime));
  initTime = now;
};
//start game
initSound();
// gLoop = window.requestAnimationFrame(gameLoop);
// init(level);

//event bus
const emitter: any = inject('emitter');
emitter.on('endGame', () => {
  endGame();
});

onUnmounted(() => {
  window.cancelAnimationFrame(gLoop);
  window.removeEventListener('keydown', keyboardEvents, false);

  // if (sound != null) {
  //   sound.unload();
  //   sound = null;
  // }
  // if (sound2 != null) {
  //   sound2.unload();
  //   sound2 = null;
  // }
  // if (wrongSound != null) {
  //   wrongSound.unload();
  //   wrongSound = null;
  // }
  // if (highscoreSound != null) {
  //   highscoreSound.unload();
  //   highscoreSound = null;
  // }
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
.online-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #262526;
  color: white;
  margin: 4px 0px;
}
.online-bars {
  padding: 0 12px;
  gap: 8px;
}
.bars {
  overflow: hidden;
  width: 100%;
  position: absolute;
  top: 0;
}
.bar-container {
  width: 100%;
  height: 24px;
  background-color: transparent;
}
.bar {
  width: 100%;
  height: 100%;
  transition: width 100ms linear;
  background-color: whitesmoke;
}
.online-bar-container {
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden;
  border-radius: 4px;
}
.online-bar {
  width: 100%;
  height: 4px;
  background-color: whitesmoke;
}
.online-finish-bar {
  width: 4px;
  height: 17px;
  background-color: #2BD231;
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
}
@media only screen and (max-height: 668px) {
  .f-question {
    font-size: 42px;
  }
  .btn-item {
    width: 152px;
  }
}
</style>
