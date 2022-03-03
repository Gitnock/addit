<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header"></div>

        <div class="modal-body">
          <div class="body-content" id="scoreContainer">
            <div class="score-font roboto-mono-m">{{ props.score }}</div>
            <div class="combo-font roboto-mono-r">Combo:{{ props.combo }}</div>
            <!-- <button class="share-btn" @click="shareScore">Share</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from "vue";
const emitter: any = inject("emitter"); // Inject `emitter`
const props = defineProps({
  score: { type: Number, default: 0 },
  combo: { type: Number, default: 0 },
});
let timer: NodeJS.Timeout;
const shareData = {
  title: "Addit Score",
  text: `${props.score} on addit can you beat it?`,
  url: "https://addit.gg",
};
setTimeout(() => {
  emitter.emit("endGame", "end");
}, 1500);
const shareScore = () => {
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    alert("Your browser doesn't support the Share API");
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/modal.scss";

.body-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: 100%;
}
.modal-title {
  font-size: 23px;
  color: #fff;
}
.score-font {
  font-size: 52px;
  color: white;
  margin-top: 32px;
}
.combo-font {
  font-size: 26px;
  color: white;
  margin: 0 32px;
}
.share-btn {
  width: 240px;
  height: 60px;
  background-color: #253851;
  border: none;
  border-radius: 12px;
  color: #0076ec;
  font-size: 24px;
}
</style>
