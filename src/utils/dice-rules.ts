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

export function diceRules(category: ScoreField, selected: number[]): DiceRulesResult {
    const counts = faceCounts(selected);
    const distinct = Object.keys(counts).length;
    const total = selected.length;

    const maxDice = (() => {
        switch (category) {
            case 'pair': return 2;
            case 'twoPairs': return 4;
            case 'threeOfAKind': return 3;
            case 'fourOfAKind': return 4;
            case 'fullHouse': return 5;
            default: return 5;
        }
    })();

    const addCount = (() => {
        switch (category) {
            case 'pair': return 2;
            case 'twoPairs': return 2;
            case 'threeOfAKind': return 3;
            case 'fourOfAKind': return 4;
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
        } else if (category === 'threeOfAKind') {
            allowed = total === 0;
        } else if (category === 'fourOfAKind') {
            allowed = total === 0;
        } else if (category === 'fullHouse') {
            allowed = total < maxDice
                && current < 3
                && (distinct < 2 || current > 0);
        }

        if (!allowed) { disabledFaces.add(face); }
    }

    const autoFill = category === 'fullHouse' ? computeFullHouseAutoFill(counts, total) : [];

    const isValid = (() => {
        if (numericCategories.has(category)) {
            const target = numericTarget(category);
            return total >= 1 && Object.keys(counts).every(f => Number(f) === target);
        }
        switch (category) {
            case 'chance': return total === 5;
            case 'pair': return total === 2 && distinct === 1;
            case 'twoPairs': return total === 4 && distinct === 2 && Object.values(counts).every(c => c === 2);
            case 'threeOfAKind': return total === 3 && distinct === 1;
            case 'fourOfAKind': return total === 4 && distinct === 1;
            case 'fullHouse': {
                if (total !== 5 || distinct !== 2) { return false; }
                const values = Object.values(counts).sort();
                return values[0] === 2 && values[1] === 3;
            }
            default: return false;
        }
    })();

    return { disabledFaces, maxDice, addCount, autoFill, isValid };
}
