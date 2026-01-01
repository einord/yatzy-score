<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import gameStore, { Player, ScoreField } from '../store/game';
import BoardRow from './board-row.vue';

const titleColumnWidth = '7rem';
const players = ref<Player[]>([]);

const dynamicBoardStyle = ref({
    gridTemplateColumns: `${titleColumnWidth} 1fr`
});

const score = (value: any): number | undefined => {
    if (value == null || value !== value) { return undefined; }
    if (Array.isArray(value)) {
        if (value.length === 0) { return undefined; }
        const sum = value.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
        return sum;
    }
    return typeof value === 'number' ? value : undefined;
};

const valueFor = (player: Player, field: ScoreField) => {
    if (player.struck?.[field]) { return 0; }
    return score((player as any)[field]);
};

const getPlayerTopValues = (player: Player) => {
    return [
        valueFor(player, 'aces'),
        valueFor(player, 'twos'),
        valueFor(player, 'threes'),
        valueFor(player, 'fours'),
        valueFor(player, 'fives'),
        valueFor(player, 'sixes')
    ];
};

const getPlayerBottomValues = (player: Player) => {
    return [
        valueFor(player, 'pair'),
        valueFor(player, 'twoPairs'),
        valueFor(player, 'threeOfAKind'),
        valueFor(player, 'fourOfAKind'),
        valueFor(player, 'fullHouse'),
        valueFor(player, 'chance')
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
    const topValues = getPlayerTopValues(player);
    if (!allValuesAreNumbers(topValues)) {
        return undefined;
    }

    return topValues[0]!
        + topValues[1]!
        + topValues[2]!
        + topValues[3]!
        + topValues[4]!
        + topValues[5]!;
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

    // Add the top row value points
    let points = valueFor(player, 'aces')! 
        + valueFor(player, 'twos')! 
        + valueFor(player, 'threes')!
        + valueFor(player, 'fours')! 
        + valueFor(player, 'fives')! 
        + valueFor(player, 'sixes')!;

    // Add bonus if top values are 63 or more
    if (points >= 63) {
        points += 50;
    }

    // Add the rest of the points
    points += valueFor(player, 'pair')!
        + valueFor(player, 'twoPairs')!
        + valueFor(player, 'threeOfAKind')!
        + valueFor(player, 'fourOfAKind')!
        + (playerHas(player, 'smallStraight') ? 15 : 0)
        + (playerHas(player, 'largeStraight') ? 20 : 0)
        + valueFor(player, 'fullHouse')!
        + valueFor(player, 'chance')!
        + (playerHas(player, 'yahtzee') ? 50 : 0);
    
    return points;
};

const hasValue = (value: any, struck?: boolean) => {
    if (struck) { return true; }
    if (Array.isArray(value)) { return value.length > 0; }
    if (typeof value === 'number') { return value === value; }
    return value != null && value !== false;
};

const countPlayerUndefinedProps = (player: Player) => {
    let count = 0;
    count = count + (hasValue(player.aces, player.struck?.aces) ? 0 : 1);
    count = count + (hasValue(player.twos, player.struck?.twos) ? 0 : 1);
    count = count + (hasValue(player.threes, player.struck?.threes) ? 0 : 1);
    count = count + (hasValue(player.fours, player.struck?.fours) ? 0 : 1);
    count = count + (hasValue(player.fives, player.struck?.fives) ? 0 : 1);
    count = count + (hasValue(player.sixes, player.struck?.sixes) ? 0 : 1);
    count = count + (hasValue(player.pair, player.struck?.pair) ? 0 : 1);
    count = count + (hasValue(player.twoPairs, player.struck?.twoPairs) ? 0 : 1);
    count = count + (hasValue(player.threeOfAKind, player.struck?.threeOfAKind) ? 0 : 1);
    count = count + (hasValue(player.fourOfAKind, player.struck?.fourOfAKind) ? 0 : 1);
    count = count + (hasValue(player.smallStraight) ? 0 : 1);
    count = count + (hasValue(player.largeStraight) ? 0 : 1);
    count = count + (hasValue(player.fullHouse, player.struck?.fullHouse) ? 0 : 1);
    count = count + (hasValue(player.chance, player.struck?.chance) ? 0 : 1);
    count = count + (hasValue(player.yahtzee) ? 0 : 1);
    
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

<template>
<div class="board" :style="dynamicBoardStyle">
    <!-- Top rows -->
    <board-row :value="playerNames" :current-player-index="currentPlayerIndex" />
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

<style scoped>
.board {
    display: grid;
    gap: 0;
    padding-bottom: 2rem;
    overflow: auto;
}
</style>
