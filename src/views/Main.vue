<template>
  <div class="main">
    <Menu v-if="store.getPage === 'home'" />
    <Game v-else-if="store.getPage === 'game'" />
  </div>
</template>
<script lang="ts" setup>
import Menu from "@/components/Menu.vue";
import Game from "@/components/Game.vue";
import { useStore } from "@/store/index";
let store = useStore();
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
}
</style>
