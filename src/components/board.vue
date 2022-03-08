<template>
<div class="board" :style="dynamicBoardStyle">
    <!-- Top rows -->
    <board-row title="" :value="playerNames" :current-player-index="currentPlayerIndex" />
    <board-row :title="1" :maximum="5" player-value="aces" :current-player-index="currentPlayerIndex" />
    <board-row :title="2" :maximum="10" player-value="twos" :current-player-index="currentPlayerIndex" />
    <board-row :title="3" :maximum="15" player-value="threes" :current-player-index="currentPlayerIndex" />
    <board-row :title="4" :maximum="20" player-value="fours" :current-player-index="currentPlayerIndex" />
    <board-row :title="5" :maximum="25" player-value="fives" :current-player-index="currentPlayerIndex" />
    <board-row :title="6" :maximum="30" player-value="sixes" :current-player-index="currentPlayerIndex" />
    <board-row title="=" :value="sumPlayerTopRows" :current-player-index="currentPlayerIndex" sum />
    <board-row title="Bonus (63+)" :maximum="50" :value="playerBonuses" :current-player-index="currentPlayerIndex" />
    <board-row :title="66" :maximum="12" player-value="pair" :current-player-index="currentPlayerIndex" />
    <board-row :title="6655" :maximum="22" player-value="twoPairs" :current-player-index="currentPlayerIndex" />
    <board-row :title="333" :maximum="18" player-value="threeOfAKind" :current-player-index="currentPlayerIndex" />
    <board-row :title="4444" :maximum="24" player-value="fourOfAKind" :current-player-index="currentPlayerIndex" />
    <board-row :title="12345" :maximum="15" player-value="smallStraight" :current-player-index="currentPlayerIndex" checkbox />
    <board-row :title="23456" :maximum="20" player-value="largeStraight" :current-player-index="currentPlayerIndex" checkbox />
    <board-row :title="66444" :maximum="28" player-value="fullHouse" :current-player-index="currentPlayerIndex" />
    <board-row title="Chance" :maximum="30" player-value="chance" :current-player-index="currentPlayerIndex" />
    <board-row title="YATZY" :maximum="50" player-value="yahtzee" :current-player-index="currentPlayerIndex" checkbox />
    <board-row title="=" :value="playerTotalPoints" :current-player-index="currentPlayerIndex" sum />
</div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import gameStore, { Player } from '@/store/game';
import BoardRow from '@/components/board-row.vue';

interface Row {
    title: string;
    maximum?: string;
    values: (number | string | undefined)[];
}

const titleColumnWidth = '7rem';
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

const playerHas = (player: Player, field: keyof Player) => {
    const value = player[field];
    if (value == null || value != value || value === false) {
        return false;
    }

    return true;
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
        + (playerHas(player, 'smallStraight') ? 15 : 0)
        + (playerHas(player, 'largeStraight') ? 20 : 0)
        + player.fullHouse!
        + player.chance!
        + (playerHas(player, 'yahtzee') ? 50 : 0);
};

const countPlayerUndefinedProps = (player: Player) => {
    let count = 0;
    count = count + (player.aces == null ? 1 : 0);
    count = count + (player.twos == null ? 1 : 0);
    count = count + (player.threes == null ? 1 : 0);
    count = count + (player.fours == null ? 1 : 0);
    count = count + (player.fives == null ? 1 : 0);
    count = count + (player.sixes == null ? 1 : 0);
    count = count + (player.pair == null ? 1 : 0);
    count = count + (player.twoPairs == null ? 1 : 0);
    count = count + (player.threeOfAKind == null ? 1 : 0);
    count = count + (player.fourOfAKind == null ? 1 : 0);
    count = count + (player.smallStraight == null ? 1 : 0);
    count = count + (player.largeStraight == null ? 1 : 0);
    count = count + (player.fullHouse == null ? 1 : 0);
    count = count + (player.chance == null ? 1 : 0);
    count = count + (player.yahtzee == null ? 1 : 0);
    
    return count;
}

const currentPlayerIndex = computed(() => {
    const allPlayers = gameStore.getPlayers();
    if (allPlayers.length == 0) { return undefined; }
    
    // Return the first player with the most undefined properties
    let currentIndex = 0;
    let currentUndefinedProps = countPlayerUndefinedProps(allPlayers[0]);
    for (let i = 1; i < allPlayers.length; i++) {
        const player = allPlayers[i];
        const undefinedProps = countPlayerUndefinedProps(player);
        if (undefinedProps > currentUndefinedProps) {
            currentIndex = i;
            currentUndefinedProps = undefinedProps;
        }
    }

    // Return the player that has the next turn
    return currentIndex;
});

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
    overflow: auto;
}
</style>