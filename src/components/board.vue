<template>
<div class="board" :style="dynamicBoardStyle">
    <!-- Top rows -->
    <board-row title="Maximum" :value="playerNames" />
    <board-row :title="1" :maximum="5" player-value="aces" />
    <board-row :title="2" :maximum="10" player-value="twos" />
    <board-row :title="3" :maximum="15" player-value="threes" />
    <board-row :title="4" :maximum="20" player-value="fours" />
    <board-row :title="5" :maximum="25" player-value="fives" />
    <board-row :title="6" :maximum="30" player-value="sixes" />
    <board-row title="=" :value="sumPlayerTopRows" />
    <board-row title="Bonus" :maximum="50" :value="playerBonuses" />
    <board-row :title="66" :maximum="12" player-value="pair" />
    <board-row :title="6655" :maximum="22" player-value="twoPairs" />
    <board-row :title="333" :maximum="18" player-value="threeOfAKind" />
    <board-row :title="4444" :maximum="24" player-value="fourOfAKind" />
    <board-row :title="12345" :maximum="15" player-value="smallStraight" />
    <board-row :title="23456" :maximum="20" player-value="largeStraight" />
    <board-row :title="66444" :maximum="28" player-value="fullHouse" />
    <board-row title="Chance" :maximum="30" player-value="chance" />
    <board-row title="YATZY" :maximum="50" :value="playerYahtzee" />
    <board-row title="=" :value="playerTotalPoints" />
</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import gameStore, { Player } from '@/store/game';
import BoardRow from '@/components/board-row.vue';

interface Row {
    title: string;
    maximum?: string;
    values: (number | string | undefined)[];
}

const titleColumnWidth = '10rem';
const players = ref<Player[]>([]);
const topRows = ref<Row[]>([]);
const topTotals = ref<number[]>([]);
const bottomRows = ref<Row[]>([]);

const dynamicBoardStyle = ref({
    gridTemplateColumns: `${titleColumnWidth} 1fr`
});

const sumPlayerTopRows = (player: Player) => {
    if (player.aces == null || player.twos == null || player.threes == null || player.fours == null || player.fives == null || player.sixes == null) {
        return undefined;
    }
    return player.aces
        + player.twos
        + player.threes
        + player.fours
        + player.fives
        + player.sixes;
}

const playerNames = (player: Player) => {
    return player.name;
}

const playerBonuses = (player: Player) => {
    const topRowSum = sumPlayerTopRows(player);
    return topRowSum == null ? undefined
        : topRowSum >= 63 ? 50 : 0;
}
const playerYahtzee = (player: Player) => {
    return player.yahtzee;
}

const playerTotalPoints = (player: Player) => {
    if (player.aces == null || player.twos == null || player.threes == null || player.fours == null || player.fives == null || player.sixes == null
        || player.pair == null || player.twoPairs == null || player.threeOfAKind == null || player.fourOfAKind == null || player.smallStraight == null || player.largeStraight == null
        || player.fullHouse == null || player.chance == null) {
        return undefined;
    }

    return player.aces
        + player.twos
        + player.threes
        + player.fours
        + player.fives
        + player.sixes
        + player.pair
        + player.twoPairs
        + player.threeOfAKind
        + player.fourOfAKind
        + player.smallStraight
        + player.largeStraight
        + player.fullHouse
        + player.chance
        + (playerYahtzee(player) === true ? 50 : 0);
}

watchEffect(() => {
    players.value = gameStore.getPlayers();
    const playerCount = Math.max(players.value.length, 1);

    dynamicBoardStyle.value = {
        gridTemplateColumns: `${titleColumnWidth} repeat(${playerCount}, 1fr)`
    };
});

</script>

<style lang="scss" scoped>
.board {
    display: grid;
    gap: 0;
}
</style>