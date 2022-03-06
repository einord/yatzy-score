<template>
<div class="board" :style="dynamicBoardStyle">
    <!-- Top rows -->
    <board-row title="" :value="playerNames" />
    <board-row :title="1" :maximum="5" player-value="aces" />
    <board-row :title="2" :maximum="10" player-value="twos" />
    <board-row :title="3" :maximum="15" player-value="threes" />
    <board-row :title="4" :maximum="20" player-value="fours" />
    <board-row :title="5" :maximum="25" player-value="fives" />
    <board-row :title="6" :maximum="30" player-value="sixes" />
    <board-row title="=" :value="sumPlayerTopRows" sum />
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
    <board-row title="=" :value="playerTotalPoints" sum />
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

const dynamicBoardStyle = ref({
    gridTemplateColumns: `${titleColumnWidth} 1fr`
});

const getPlayerTopValues = (player: Player) => {
    return [
        player.aces,
        player.twos,
        player.threes,
        player.fours,
        player.fives,
        player.sixes
    ];
};

const getPlayerBottomValues = (player: Player) => {
    return [
        player.pair,
        player.twoPairs,
        player.threeOfAKind,
        player.fourOfAKind,
        player.smallStraight,
        player.largeStraight,
        player.fullHouse,
        player.chance
    ];
};

const allValuesAreNumbers = (numbers: any[]) => {
    for (const value of numbers) {
        if (value == null || typeof value !== 'number' || value !== value) {
            return false;
        }
    }

    return true;
}

const sumPlayerTopRows = (player: Player) => {
    if (!allValuesAreNumbers(getPlayerTopValues(player))) {
        return undefined;
    }

    return player.aces!
        + player.twos!
        + player.threes!
        + player.fours!
        + player.fives!
        + player.sixes!;
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
    if (!allValuesAreNumbers([...getPlayerTopValues(player), ...getPlayerBottomValues(player)])) {
        return undefined;
    }

    return player.aces!
        + player.twos!
        + player.threes!
        + player.fours!
        + player.fives!
        + player.sixes!
        + player.pair!
        + player.twoPairs!
        + player.threeOfAKind!
        + player.fourOfAKind!
        + player.smallStraight!
        + player.largeStraight!
        + player.fullHouse!
        + player.chance!
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
    padding-bottom: 2rem;
}
</style>