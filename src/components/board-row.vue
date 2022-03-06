<template>
<div class="title" :class="{ simple: maximum == null, sum}">
    <div class="text">
        <dice v-if="titleIsNumber">{{ title }}</dice>
        <span v-else>{{ title }}</span>
    </div>
    <div class="maximum" v-if="maximum != null">{{ maximum }}</div>
</div>
<div v-if="players.length < 1" class="value" :class="{ sum }">&nbsp;</div>
<div v-for="(player, index) in players" :key="index" class="value" :class="{ sum }" :style="{ boxShadow: `0 0 1px 1px ${getCellColor(player)} inset` }">
    <checkbox v-if="checkbox === true && playerValue != null" v-model="(player as any)[playerValue]" :value="maximum" />
    <input v-else-if="playerValue != null" type="number" inputmode="numeric" :max="maximum" :min="0" maxlength="2" :value="getPlayerValue(player)" @change="setPlayerValue(player, $event)" />
    <template v-else-if="value != null">{{ value(player) ?? ' ' }}</template>
    <template v-else>&nbsp;</template>
</div>
</template>

<script setup lang="ts">
import gameStore, { Player } from '@/store/game';
import { computed, ref, watchEffect } from 'vue';

const props = withDefaults(defineProps<{
    title?: string | number;
    maximum?: number;
    playerValue?: string;
    value?: (player: Player) => string | number | undefined | boolean;
    sum?: boolean;
    checkbox?: boolean;
}>(), {
    sum: false,
    checkbox: false
});

const players = ref<Player[]>([]);
const titleIsNumber = computed(() => typeof props.title === 'number');

const getPlayerValue = (player: any) => {
    if (props.playerValue == null) { return undefined; }

    const value = player[props.playerValue];
    if (typeof value === 'number') { return value; }
    else { return undefined; }
};

const setPlayerValue = (player: any, e: Event) => {
    if (props.playerValue == null) { return; }

    const newValueString = (e.target as HTMLInputElement).value;
    let newValue = parseInt(newValueString);

    // Dont let the new value exeed maximum (if set)
    if (props.maximum != null) {
        newValue = newValue > props.maximum ? props.maximum : newValue;
        newValue = newValue < 0 ? 0 : newValue;
        (e.target as HTMLInputElement).value = newValue.toString();
    }

    player[props.playerValue] = newValue;
}

const getCellColor = (player: any) => {
    let value: number | undefined = undefined;
    if (props.checkbox === true && props.playerValue != null) {
        const checkboxValue = (player as any)[props.playerValue];
        value = checkboxValue === true ? props.maximum
            : checkboxValue === false ? 0
            : undefined;
    } else {
        value = getPlayerValue(player);
    }

    // No value is set yet, skip color calculation
    if (value == null) { return 'transparent'; }

    // Return color depending on percentage of maximum
    const percentage = value / props.maximum!;
    // const color = `hsl(0, 100%, ${(percentage * 70) + 30}%)`; // Red to white
    const color = `hsl(${(percentage * 100)}, 100%, 40%)`; // Red to green
    return color;
}

watchEffect(() => {
    players.value = gameStore.getPlayers();
})
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid $color-grey;
    padding: 0.1rem 0.5rem;

    &.simple {
        justify-content: flex-end;
    }

    &.sum {
        background-color: $color-grey;
        border-top: 1px solid $color-light-grey;
        border-bottom: 1px solid $color-light-grey;
    }

    > .maximum {
        font-size: 0.65em;
    }
}

.value {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid $color-grey;
    border-top: 1px solid $color-grey;
    font-size: 1rem;

    &.sum {
        background-color: $color-grey;
        border-top: 1px solid $color-light-grey;
        border-bottom: 1px solid $color-light-grey;
    }

    > input, > .checkbox {
        width: 100%;
        height: 100%;
        background-color: transparent;
        color: $color-text;
        border: 0;
        text-align: center;
        font-size: inherit;
        
        &:focus {
            outline: none;
        }
    }
}
</style>