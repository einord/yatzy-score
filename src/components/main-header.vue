<script setup lang="ts">
import gameStore from '../store/game';


const reset = () => {
    if (confirm('Are you sure you want to reset the game?')) {
        gameStore.clearGame();
    }
}
</script>

<template>
<div class="main-header">
    <button @click="reset">Reset</button>
    <div class="title">YATZY</div>
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