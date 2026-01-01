<script setup lang="ts">
import gameStore, { Player, ScoreField } from '../store/game';
import { computed, ref } from 'vue';
import Checkbox from './checkbox.vue';
import DicePickerModal from './dice-picker-modal.vue';

const props = withDefaults(defineProps<{
    title?: string | number;
    maximum?: number;
    playerValue?: string;
    value?: (player: Player) => string | number | undefined | boolean;
    sum?: boolean;
    checkbox?: boolean;
    currentPlayerIndex?: number;
    isHeader?: boolean;
}>(), {
    sum: false,
    checkbox: false,
    maximum: 0,
    isHeader: false
});

const players = computed<Player[]>(() => gameStore.getPlayers());
const titleIsNumber = computed(() => typeof props.title === 'number');

const fieldKey = computed<ScoreField | undefined>(() => props.playerValue as ScoreField | undefined);

const score = (value: any): number | undefined => {
    if (value == null || value !== value) { return undefined; }
    if (Array.isArray(value)) {
        if (value.length === 0) { return undefined; }
        return value.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
    }
    return typeof value === 'number' ? value : undefined;
};

const getPlayerValue = (player: any) => {
    if (fieldKey.value == null) { return undefined; }
    if (player?.struck?.[fieldKey.value]) { return 0; }
    const value = player[fieldKey.value];
    return score(value);
};

const getPlayerDice = (player: any): number[] | undefined => {
    if (fieldKey.value == null) { return undefined; }
    if (player?.struck?.[fieldKey.value]) { return []; }
    const value = player[fieldKey.value];
    if (Array.isArray(value)) { return value; }
    if (typeof value === 'number') {
        // Fallback: greedy split legacy value
        let remaining = value;
        const dice: number[] = [];
        for (const face of [6,5,4,3,2,1]) {
            while (remaining - face >= 0 && dice.length < 5) {
                dice.push(face);
                remaining -= face;
            }
        }
        return dice;
    }
    return undefined;
};

const setPlayerValue = (player: any, dice: number[] | undefined) => {
    if (fieldKey.value == null) { return; }

    if (dice == null || dice.length === 0) {
        player[fieldKey.value] = undefined;
        if (player.struck) {
            delete player.struck[fieldKey.value];
        }
        return;
    }

    let total = score(dice) ?? 0;
    if (props.maximum != null) {
        total = total > props.maximum ? props.maximum : total;
        total = total < 0 ? 0 : total;
    }

    // Store the dice values so we can rehydrate exact combination.
    player[fieldKey.value] = dice.slice(0, 5);
    if (player.struck) {
        delete player.struck[fieldKey.value];
    }
};

const getCellColor = (player: Player, index: number) => {
    if (props.isHeader === true && index === props.currentPlayerIndex) { return 'var(--color-current-player-background)'; }

    let value: number | undefined = undefined;
    if (props.checkbox === true && props.playerValue != null) {
        const checkboxValue = (player as any)[props.playerValue];
        value = checkboxValue === true ? props.maximum
            : checkboxValue === false ? 0
            : undefined;
    } else {
        value = getPlayerValue(player);
        if (fieldKey.value && player?.struck?.[fieldKey.value]) {
            return 'var(--color-text)';
        }
    }

    // No value is set yet, skip color calculation
    if (value == null || value !== value) { return 'var(--color-cell-no-value)'; }

    // Zero value is always inverted color
    if (value === 0) {
        return 'var(--color-text)';
    }

    // Return color depending on percentage of maximum
    const percentage = value / props.maximum!;
    const color = `hsl(${(percentage * 100)}, var(--color-cell-saturation), var(--color-cell-lightness))`; // Red to green
    return color;
}

const modalOpen = ref(false);
const editingIndex = ref<number | null>(null);
const draftDice = ref<number[] | undefined>(undefined);

const openPicker = (playerIndex: number) => {
    if (props.playerValue == null || props.checkbox) { return; }
    editingIndex.value = playerIndex;
    draftDice.value = getPlayerDice(players.value[playerIndex]);
    modalOpen.value = true;
};

const closePicker = () => {
    modalOpen.value = false;
    editingIndex.value = null;
};

const confirmPicker = (dice: number[] | undefined) => {
    if (editingIndex.value == null || props.playerValue == null) {
        closePicker();
        return;
    }
    const player = players.value[editingIndex.value];
    setPlayerValue(player, dice);
    closePicker();
};

const strikeCell = () => {
    if (editingIndex.value == null || fieldKey.value == null) {
        closePicker();
        return;
    }
    const player = players.value[editingIndex.value];
    player[fieldKey.value] = 0;
    player.struck = player.struck ?? {};
    player.struck[fieldKey.value] = true;
    closePicker();
};

const isStruck = (player: any) => fieldKey.value != null && player?.struck?.[fieldKey.value] === true;
</script>

<template>
<div class="title" :class="{ simple: maximum == null, sum}">
    <div class="text">
        <dice v-if="titleIsNumber" class="dice-value">{{ title }}</dice>
        <span v-else>{{ title }}</span>
    </div>
    <div v-if="maximum != null && sum === false && title != null" class="maximum">{{ maximum }}</div>
</div>
<div v-if="players.length < 1" class="value" :class="{ sum }">&nbsp;</div>
<div
    v-for="(player, index) in players"
    :key="index"
    class="value"
    :class="{ sum, current : currentPlayerIndex === index, struck: isStruck(player), player: value != null }"
    :style="{ backgroundColor: getCellColor(player, index) }"
>
    <checkbox v-if="checkbox === true && playerValue != null" v-model="(player as any)[playerValue]" :value="maximum" />
    <button
        v-else-if="playerValue != null"
        type="button"
        class="value-button"
        @click="openPicker(index)"
    >
        {{ getPlayerValue(player) ?? ' ' }}
    </button>
    <template v-else-if="value != null">{{ value(player) ?? ' ' }}</template>
    <template v-else>&nbsp;</template>
</div>

<dice-picker-modal
    :open="modalOpen"
    :initial-dice="draftDice"
    :category="fieldKey"
    @cancel="closePicker"
    @confirm="confirmPicker"
    @strike="strikeCell"
/>
</template>

<style scoped>
.title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 0.25rem;
    box-shadow: 0 0 0 0.5px var(--color-grey) inset;
    padding: 0.1rem 0.3rem;
    font-size: 0.75rem;

    &.simple {
        justify-content: flex-end;
    }

    &.sum {
        background-color: var(--color-grey);
        border-top: 1px solid var(--color-light-grey);
        border-bottom: 1px solid var(--color-light-grey);
        box-shadow: none;
        text-align: right;

        >.text {
            margin-left: auto;
            font-size: 1rem;
            font-weight: bold;
        }
    }

    > .maximum {
        font-size: 0.75em;
        width: 1rem;
    }
}

.value {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 0 0 0.5px var(--color-grey) inset;

    &.sum {
        background-color: var(--color-grey);
        border-top: 1px solid var(--color-light-grey);
        border-bottom: 1px solid var(--color-light-grey);
        box-shadow: none;
        font-weight: bold;
    }

    &.player.current {
        color: var(--color-current-player-color);
    }

    > .checkbox {
        width: 100%;
        height: 100%;
        background-color: transparent;
        color: var(--color-text);
        border: 0;
        text-align: center;
        font-size: inherit;
    }

    .value-button {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        font-size: inherit;
        cursor: pointer;
        padding: 0.5rem 0.25rem;
        transition: transform 120ms ease, background-color 120ms ease;

        &:hover,
        &:focus-visible {
            transform: translateY(-1px);
            background-color: rgba(0, 0, 0, 0.05);
            outline: none;
        }

        &:active {
            transform: translateY(0);
        }
    }
}
</style>
