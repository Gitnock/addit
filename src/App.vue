<script setup lang="ts">
import "@fontsource/roboto-mono/400.css"; // Weight 400
import "@fontsource/roboto-mono/500.css"; // Weight 500.
import "@fontsource/roboto-mono/700.css"; // weight 700.
import ReloadPrompt from "./ReloadPrompt.vue";
import { useStore } from "@/store/index";
let store = useStore();
if (localStorage.getItem("highscore") === null) {
  localStorage.setItem("highscore", "0");
} else {
  const hightscore = localStorage.getItem("highscore");
  if (typeof hightscore === "string") {
    store.updateHighScore(parseInt(hightscore));
  }
}
if (localStorage.getItem("combo") === null) {
  localStorage.setItem("combo", "0");
} else {
  const combo = localStorage.getItem("combo");
  if (typeof combo === "string") {
    store.updateCombo(parseInt(combo));
  }
}
</script>

<template>
  <div
    class="main-phone"
    oncontextmenu="return false"
    onselectstart="return false"
    ondragstart="return false"
  >
    <div class="content-container">
      <router-view></router-view>
    </div>
    <ReloadPrompt />
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/init.scss";

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
  touch-action: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
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
