<template>
<div class="title" :class="{ simple: maximum == null}">
    <div class="text">
        <dice v-if="titleIsNumber">{{ title }}</dice>
        <span v-else>{{ title }}</span>
    </div>
    <div class="maximum" v-if="maximum != null">{{ maximum }}</div>
</div>
<div v-if="players.length < 1" class="value">&nbsp;</div>
<div v-for="(player, index) in players" :key="index" class="value">
    <input v-if="playerValue != null" type="number" inputmode="numeric" :max="maximum" :min="0" maxlength="2" :value="getPlayerValue" @change="setPlayerValue(player, $event)" />
    <template v-if="value != null">
        <template v-if="typeof value(player) === 'boolean'"><input type="checkbox" v-model="player.yahtzee"/></template>
        <template v-else>{{ value(player) }}</template>
    </template>
</div>
</template>

<script setup lang="ts">
import gameStore, { Player } from '@/store/game';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
    title?: string | number;
    maximum?: number;
    playerValue?: string;
    value?: (player: Player) => string | number | undefined | boolean;
}>();

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

    > input {
        width: 100%;
        height: 100%;
        background-color: $color-background;
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