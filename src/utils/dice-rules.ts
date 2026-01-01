import { ScoreField } from '../store/game';

export interface DiceRulesResult {
    disabledFaces: Set<number>;
    maxDice: number;
}

const faceCounts = (dice: number[]) => {
    const counts: Record<number, number> = {};
    for (const die of dice) {
        counts[die] = (counts[die] ?? 0) + 1;
    }
    return counts;
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

    const disabledFaces = new Set<number>();

    const disableIf = (condition: boolean, face: number) => {
        if (condition) { disabledFaces.add(face); }
    };

    for (let face = 1; face <= 6; face++) {
        const current = counts[face] ?? 0;

        const addWouldExceedMax = total >= maxDice;

        let allowed = !addWouldExceedMax;

        switch (category) {
            case 'aces':
            case 'twos':
            case 'threes':
            case 'fours':
            case 'fives':
            case 'sixes': {
                const target = ['aces','twos','threes','fours','fives','sixes'].indexOf(category) + 1;
                allowed = face === target && total < maxDice;
                break;
            }
            case 'chance': {
                allowed = total < maxDice;
                break;
            }
            case 'pair': {
                const hasFace = distinct > 0 ? Number(Object.keys(counts)[0]) : null;
                allowed = total < 2 && (hasFace == null || hasFace === face) && current < 2;
                break;
            }
            case 'twoPairs': {
                if (distinct > 2) {
                    allowed = false;
                    break;
                }
                const canAddNewFace = distinct < 2;
                allowed = total < 4
                    && current < 2
                    && (canAddNewFace || current > 0);
                break;
            }
            case 'threeOfAKind': {
                const hasFace = distinct > 0 ? Number(Object.keys(counts)[0]) : null;
                allowed = total < 3 && (hasFace == null || hasFace === face) && current < 3;
                break;
            }
            case 'fourOfAKind': {
                const hasFace = distinct > 0 ? Number(Object.keys(counts)[0]) : null;
                allowed = total < 4 && (hasFace == null || hasFace === face) && current < 4;
                break;
            }
            case 'fullHouse': {
                if (distinct > 2) {
                    allowed = false;
                    break;
                }
                const canAddNewFace = distinct < 2;
                allowed = total < 5
                    && current < 3
                    && (canAddNewFace || current > 0);
                break;
            }
            default: {
                allowed = total < maxDice;
            }
        }

        disableIf(!allowed, face);
    }

    return { disabledFaces, maxDice };
}
