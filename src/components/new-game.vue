<script setup lang="ts">
import gameStore from '../store/game';
import { ref } from 'vue';

const playerNames = ref<string[]>(['']);

const updatePlayerName = (index: number, e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    // Remove player name if no value
    if (value === '') { 
        playerNames.value.splice(index, 1);
    } else {
        playerNames.value[index] = value;
    }

    // Add empty input if no empty input element
    if (playerNames.value.length < 6 && playerNames.value.find(name => name === '') == null) {
        playerNames.value.push('');
    }
};

const startGame = () => {
    // Validate number of players
    if (playerNames.value.length < 2) {
        alert('Please enter at least two player names');
        return;
    }

    // Add players to store
    for (const playerName of playerNames.value.filter(x => x != null && x !== '')) {
        gameStore.addPlayer({
            name: playerName
        });
    }
}
</script>

<template>
<div class="new-game">
    <h1>Welcome to YATZY!</h1>
    <p>Please enter the names of each player</p>
    <div v-for="(playerName, index) in playerNames" :key="index" class="names" :class="{ empty: playerName === '' || playerName == null}">
        <div>Player {{ index + 1 }}</div>
        <input placeholder="Add player" type="text" maxlength="7" :value="playerName" @input="updatePlayerName(index, $event)" />
    </div>
    <!-- <div class="add-player">
        <div>Player {{ playerNames.length + 1 }}</div>
        <input type="text" maxlength="7" :value="newPlayerName" @input="addPlayer" />
    </div> -->
    <button class="start-button" @click="startGame" :disabled="playerNames.length < 2">Start game</button>
</div>
</template>

<style scoped>
.new-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > .names {
        display: grid;
        grid-template-columns: auto 1fr;
        max-width: 20rem;
        margin-top: 0.5rem;

        > div {
            margin-right: 0.5rem;
        }

        &.empty {
            opacity: 0.5;
        }
    }

    > .start-button {
        margin-top: 1rem;
    }
}
</style>