<template>
  <div class="main">
    <!-- <h1>users: {{ inRoom }}</h1>
    <h1>isLeader: {{ isLeader }}</h1> -->
    <lobby v-if="store.getOnlinePage === 'lobby'" />
    <OnlineGame v-else-if="store.getOnlinePage === 'game'" />
  </div>
</template>

<script lang="ts" setup>
import lobby from '@/components/OnlineMenu.vue';
import OnlineGame from '@/components/OnlineGame.vue';
import { useStore } from '@/store/index';
import { useRouter, useRoute } from 'vue-router';
import { joinRoom, getOccupants } from 'trystero/firebase';
import { onUnmounted, ref } from 'vue';


const config = { appId: import.meta.env.VITE_APP_DATABASE_URL };
const route = useRoute();
const store = useStore();

const roomId = route.params.id;
let room: any = null;
let num = 0;
let numOut = ref(0);
const roomMax = 3;
let inRoom = ref(0);
let isLeader = ref(false);



const initLobby = async () => {
  
  console.log(roomId);
  
  if (route.params.id && route.params.id !== 'lobby') {
    inRoom.value = (await getOccupants(config, roomId)).length;
    if (inRoom.value < roomMax) {
      room = joinRoom(config, roomId);
      roomEvents();
    }
  }
};



const roomEvents = () => {
  const [sendClick, getClick] = room.makeAction('click');
  room.onPeerJoin((id: string) => {
    console.log(`${id} joined`);
     console.log(room.getPeers().length);
  });

  room.onPeerLeave((id: string) => {
    console.log(`${id} left`);
    isFirst();
  });
};

const isFirst = () => {
  isLeader.value = room.getPeers().length === 0;
  console.log("isLeader: " + isLeader.value);
};

initLobby();
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
}
</style>
