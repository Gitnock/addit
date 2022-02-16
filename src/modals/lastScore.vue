<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header"></div>

          <div class="modal-body">
            <div class="body-content">
              <div class="modal-title roboto-mono-m">your just got</div>
              <div class="score-font roboto-mono-m">{{props.score}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { inject } from 'vue';
const emitter: any = inject('emitter'); // Inject `emitter`
const props = defineProps({
  score: Number,
});
setTimeout(() => {
  emitter.emit('endGame', 'end');
}, 500);
</script>
<style lang="scss" scoped>
@import '@/assets/styles/modal.scss';

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
}
</style>
