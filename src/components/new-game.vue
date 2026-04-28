<script setup lang="ts">
import gameStore, { GameMode } from '../store/game';
import { computed, ref } from 'vue';

const playerNames = ref<string[]>(['']);

const filledNames = computed(() => playerNames.value.filter(x => x != null && x !== ''));
const canStart = computed(() => filledNames.value.length >= 2);

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

const startGame = (mode: GameMode) => {
    if (!canStart.value) {
        alert('Please enter at least two player names');
        return;
    }

    gameStore.setMode(mode);
    for (const playerName of filledNames.value) {
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
    <div class="start-buttons">
        <button class="start-button" @click="startGame('yatzy')" :disabled="!canStart">Start YATZY</button>
        <button class="start-button maxi" @click="startGame('maxi')" :disabled="!canStart">Start MAXI</button>
    </div>
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

    > .start-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1.25rem;
        width: min(14rem, 100%);

        > .start-button {
            font-size: 1rem;
            font-weight: 600;
            padding: 0.65rem 1rem;
            border-radius: 8px;
            background-color: var(--color-primary);
            color: white;
            cursor: pointer;
            transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

            &:hover:not(:disabled),
            &:focus-visible:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
                outline: none;
            }

            &:active:not(:disabled) {
                transform: translateY(0);
            }

            &:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            &.maxi {
                background-color: var(--color-grey);
                color: var(--color-text);
            }
        }
    }
}
</style>