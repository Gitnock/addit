<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header"></div>

        <div class="modal-body">
          <div class="body-content" id="scoreContainer">
            <div class="score-font roboto-mono-m">Reset highscore?</div>
            <div class="d-flex gap">
              <button class="btn yes-btn" @click="resetScore">Yes</button>
              <button class="btn no-btn" @click="closeModal">No</button>
            </div>
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

const resetScore = () => {
  emitter.emit("onScore", "reset");
};
const closeModal = () => {
  emitter.emit("onModal", "close");
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
  font-size: 16px;
  color: white;
}

.share-btn {
  width: 240px;
  height: 60px;
  background-color: #253851;
  border: none;
  border-radius: 12px;

  font-size: 24px;
}
.gap {
  gap: 12px;
}
.btn {
  width: 92px;
  height: 60px;
  border: none;
  border-radius: 12px;
  font-size: 24px;
}
.yes-btn {
  color: #0076ec;
  background-color: #253851;
}
.no-btn {
  color: #ff5441;
  background-color: #4b1b0f;
}
</style>
