<template>
  <div class="nav-main d-flex d-center-w d-center-h">
     <button @click="startGame">start game</button>
  </div>
</template>
<script lang="ts" setup>
import { useStore} from '@/store/index';
let store = useStore();
const startGame = () => {
  store.updateOnlinePage('game');
}
</script>
<style lang="scss" scoped>

.nav-main {
  height: 72px;
  height: 100%;
}
</style>
