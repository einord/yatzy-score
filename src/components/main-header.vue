<script setup lang="ts">
import { computed } from 'vue';
import gameStore from '../store/game';


const title = computed(() => gameStore.isMaxi() ? 'MAXI-YATZY' : 'YATZY');

const reset = () => {
    if (confirm('Are you sure you want to reset the game?')) {
        gameStore.clearGame();
    }
}
</script>

<template>
<div class="main-header">
    <button @click="reset">Reset</button>
    <div class="title">{{ title }}</div>
    <div>&nbsp;</div>
</div>
</template>

<style scoped>
.main-header {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    flex-direction: row;
    align-items: center;

    > .title {
        font-size: 1.5rem;
        font-weight: bold;
    }
}
</style>