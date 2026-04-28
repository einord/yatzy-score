import { ScoreField } from '../store/game';

export interface DiceRulesResult {
    disabledFaces: Set<number>;
    maxDice: number;
    addCount: number;
    autoFill: number[];
    isValid: boolean;
}

const faceCounts = (dice: number[]) => {
    const counts: Record<number, number> = {};
    for (const die of dice) {
        counts[die] = (counts[die] ?? 0) + 1;
    }
    return counts;
};

const numericCategories = new Set<ScoreField>(['aces', 'twos', 'threes', 'fours', 'fives', 'sixes']);

const numericTarget = (category: ScoreField): number | null => {
    switch (category) {
        case 'aces': return 1;
        case 'twos': return 2;
        case 'threes': return 3;
        case 'fours': return 4;
        case 'fives': return 5;
        case 'sixes': return 6;
        default: return null;
    }
};

const computeFullHouseAutoFill = (counts: Record<number, number>, total: number): number[] => {
    const distinct = Object.keys(counts).length;
    if (total >= 5 || distinct !== 2) { return []; }

    const entries = Object.entries(counts).map(([face, count]) => ({ face: Number(face), count }));

    // 4 dice as 3+1 → fill with 1 more of the singleton face (only deterministic case)
    if (total === 4) {
        const trio = entries.find(e => e.count === 3);
        const single = entries.find(e => e.count === 1);
        if (trio && single) { return [single.face]; }
    }

    return [];
};

const computeHouseAutoFill = (counts: Record<number, number>, total: number): number[] => {
    const distinct = Object.keys(counts).length;
    if (total >= 6 || distinct !== 2) { return []; }

    // With two distinct faces in a 3+3 game, the result is always determined: each face must reach 3.
    const result: number[] = [];
    for (const [face, count] of Object.entries(counts)) {
        const needed = 3 - count;
        for (let i = 0; i < needed; i++) { result.push(Number(face)); }
    }
    return result;
};

const computeTowerAutoFill = (counts: Record<number, number>, total: number): number[] => {
    if (total >= 6) { return []; }

    const entries = Object.entries(counts).map(([face, count]) => ({ face: Number(face), count }));

    // As soon as one face reaches 3, it must become the four-of-a-kind. Bump it to 4 (and bump the singleton to 2 if present).
    const trio = entries.find(e => e.count === 3);
    if (trio) {
        const result: number[] = [trio.face];
        const single = entries.find(e => e.count === 1);
        if (single) { result.push(single.face); }
        return result;
    }

    // 4 + 1 → singleton must become 2
    if (total === 5) {
        const four = entries.find(e => e.count === 4);
        const single = entries.find(e => e.count === 1);
        if (four && single) { return [single.face]; }
    }

    return [];
};

export function diceRules(category: ScoreField, selected: number[], maxi: boolean = false): DiceRulesResult {
    const counts = faceCounts(selected);
    const distinct = Object.keys(counts).length;
    const total = selected.length;

    const totalDice = maxi ? 6 : 5;

    const maxDice = (() => {
        switch (category) {
            case 'pair': return 2;
            case 'twoPairs': return 4;
            case 'threePairs': return 6;
            case 'threeOfAKind': return 3;
            case 'fourOfAKind': return 4;
            case 'fiveOfAKind': return 5;
            case 'fullHouse': return 5;
            case 'house': return 6;
            case 'tower': return 6;
            default: return totalDice;
        }
    })();

    const addCount = (() => {
        switch (category) {
            case 'pair': return 2;
            case 'twoPairs': return 2;
            case 'threePairs': return 2;
            case 'threeOfAKind': return 3;
            case 'fourOfAKind': return 4;
            case 'fiveOfAKind': return 5;
            default: return 1;
        }
    })();

    const disabledFaces = new Set<number>();

    for (let face = 1; face <= 6; face++) {
        const current = counts[face] ?? 0;
        let allowed = true;

        if (numericCategories.has(category)) {
            const target = numericTarget(category);
            allowed = face === target && total < maxDice;
        } else if (category === 'chance') {
            allowed = total < maxDice;
        } else if (category === 'pair') {
            allowed = total === 0;
        } else if (category === 'twoPairs') {
            allowed = total < maxDice && current < 2;
        } else if (category === 'threePairs') {
            allowed = total < maxDice && current < 2;
        } else if (category === 'threeOfAKind') {
            allowed = total === 0;
        } else if (category === 'fourOfAKind') {
            allowed = total === 0;
        } else if (category === 'fiveOfAKind') {
            allowed = total === 0;
        } else if (category === 'fullHouse') {
            allowed = total < maxDice
                && current < 3
                && (distinct < 2 || current > 0);
        } else if (category === 'house') {
            allowed = total < maxDice
                && current < 3
                && (distinct < 2 || current > 0);
        } else if (category === 'tower') {
            allowed = total < maxDice
                && current < 4
                && (distinct < 2 || current > 0);
        }

        if (!allowed) { disabledFaces.add(face); }
    }

    const autoFill = (() => {
        if (category === 'fullHouse') { return computeFullHouseAutoFill(counts, total); }
        if (category === 'house') { return computeHouseAutoFill(counts, total); }
        if (category === 'tower') { return computeTowerAutoFill(counts, total); }
        return [];
    })();

    const isValid = (() => {
        if (numericCategories.has(category)) {
            const target = numericTarget(category);
            return total >= 1 && Object.keys(counts).every(f => Number(f) === target);
        }
        switch (category) {
            case 'chance': return total === totalDice;
            case 'pair': return total === 2 && distinct === 1;
            case 'twoPairs': return total === 4 && distinct === 2 && Object.values(counts).every(c => c === 2);
            case 'threePairs': return total === 6 && distinct === 3 && Object.values(counts).every(c => c === 2);
            case 'threeOfAKind': return total === 3 && distinct === 1;
            case 'fourOfAKind': return total === 4 && distinct === 1;
            case 'fiveOfAKind': return total === 5 && distinct === 1;
            case 'fullHouse': {
                if (total !== 5 || distinct !== 2) { return false; }
                const values = Object.values(counts).sort();
                return values[0] === 2 && values[1] === 3;
            }
            case 'house': {
                if (total !== 6 || distinct !== 2) { return false; }
                return Object.values(counts).every(c => c === 3);
            }
            case 'tower': {
                if (total !== 6 || distinct !== 2) { return false; }
                const values = Object.values(counts).sort();
                return values[0] === 2 && values[1] === 4;
            }
            default: return false;
        }
    })();

    return { disabledFaces, maxDice, addCount, autoFill, isValid };
}
