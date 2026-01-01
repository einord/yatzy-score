<script setup lang="ts">
import NewGame from './components/new-game.vue';
import MainHeader from './components/main-header.vue';
import Board from './components/board.vue';
import gameStore from './store/game';
import { computed } from 'vue';

const noGame = computed(() => gameStore.hasPlayers() === false);
</script>

<template>
  <new-game v-if="noGame" />
  <template v-else>
      <main-header />
      <board class="board" />
  </template> 
</template>

<style>
#app {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    > .board {
        flex: 1 1;
    }
}
</style>
