<template>
<div class="new-game">
    <h1>Welcome to YATZY!</h1>
    <p>Please enter the names of each player</p>
    <div v-for="(playerName, index) in playerNames" :key="index" class="names">
        <div>Player {{ index + 1 }}</div>
        <input type="text" :value="playerName" @change="updatePlayerName(index, $event)" />
    </div>
    <div class="add-player">
        <div>Player {{ playerNames.length + 1 }}</div>
        <input type="text" :value="newPlayerName" @change="addPlayer" />
    </div>
    <button class="start-button" @click="startGame">Start game</button>
</div>
</template>

<script setup lang="ts">
import gameStore from '@/store/game';
import { ref } from 'vue';

const playerNames = ref<string[]>([]);
const newPlayerName = ref('');

const addPlayer = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    playerNames.value.push(value);
    newPlayerName.value = '';
};

const updatePlayerName = (index: number, e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    // Remove player name if no value
    if (value === '') { 
        playerNames.value.splice(index, 1);
    } else {
        playerNames.value[index] = value;
    }
};

const startGame = () => {
    // Validate number of players
    if (playerNames.value.length < 2) {
        alert('Please enter at least two player names');
        return;
    }

    // Add players to store
    playerNames.value.forEach(name => {
        gameStore.addPlayer({
            name,
            yahtzee: false
        });
    });
}
</script>

<style lang="scss" scoped>
.new-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > .names, >.add-player {
        display: grid;
        grid-template-columns: auto 1fr;
        max-width: 20rem;
        margin-top: 0.5rem;

        > div {
            margin-right: 0.5rem;
        }
    }

    > .start-button {
        margin-top: 1rem;
    }
}
</style>