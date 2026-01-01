import { StoreBase } from './store-base';

export interface Player {
    name: string;

    // Points
    aces?: number | number[];
    twos?: number | number[];
    threes?: number | number[];
    fours?: number | number[];
    fives?: number | number[];
    sixes?: number | number[];
    pair?: number | number[];
    twoPairs?: number | number[];
    threeOfAKind?: number | number[];
    fourOfAKind?: number | number[];
    smallStraight?: boolean;
    largeStraight?: boolean;
    fullHouse?: number | number[];
    chance?: number | number[];
    yahtzee?: boolean;
    struck?: Partial<Record<ScoreField, boolean>>;
}

export type ScoreField =
    | 'aces'
    | 'twos'
    | 'threes'
    | 'fours'
    | 'fives'
    | 'sixes'
    | 'pair'
    | 'twoPairs'
    | 'threeOfAKind'
    | 'fourOfAKind'
    | 'fullHouse'
    | 'chance';

/**
 * The global store interface.
 */
export interface GameStore extends Object {
    players: Player[];
}

class Store extends StoreBase<GameStore> {
    constructor() {
        super('game');
    }

    protected data(): GameStore {
        return {
            players: []
        };
    }

    /**
     * Determines if there are any players.
     */
    hasPlayers() {
        return (this.state.players?.length ?? 0) > 0;
    }

    /**
     * Clears the current game.
     */
    clearGame() {
        this.state.players = [];
    }

    /**
     * Adds a player to the game
     */
    addPlayer(player: Player) {
        if (player != null) {
            this.state.players.push(player);
        }
    }

    /**
     * Gets all the players in the game.
     * @returns The current players.
     */
    getPlayers() {
        return this.state.players;
    }
}

const gameStore: Store = new Store();
export default gameStore;
