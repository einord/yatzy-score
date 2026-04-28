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
    threePairs?: number | number[];
    threeOfAKind?: number | number[];
    fourOfAKind?: number | number[];
    fiveOfAKind?: number | number[];
    smallStraight?: boolean;
    largeStraight?: boolean;
    fullStraight?: boolean;
    fullHouse?: number | number[];
    house?: number | number[];
    tower?: number | number[];
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
    | 'threePairs'
    | 'threeOfAKind'
    | 'fourOfAKind'
    | 'fiveOfAKind'
    | 'fullHouse'
    | 'house'
    | 'tower'
    | 'chance';

export type GameMode = 'yatzy' | 'maxi';

/**
 * The global store interface.
 */
export interface GameStore extends Object {
    players: Player[];
    mode: GameMode;
}

class Store extends StoreBase<GameStore> {
    constructor() {
        super('game');
    }

    protected data(): GameStore {
        return {
            players: [],
            mode: 'yatzy'
        };
    }

    /**
     * Determines if there are any players.
     */
    hasPlayers() {
        return (this.state.players?.length ?? 0) > 0;
    }

    /**
     * Clears the current game and resets the mode to default Yatzy.
     */
    clearGame() {
        this.state.players = [];
        this.state.mode = 'yatzy';
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

    /**
     * Sets the active game mode (regular Yatzy or Maxi Yatzy).
     */
    setMode(mode: GameMode) {
        this.state.mode = mode;
    }

    /**
     * Returns the active game mode. Defaults to 'yatzy' for legacy stored games.
     */
    getMode(): GameMode {
        return this.state.mode ?? 'yatzy';
    }

    /**
     * Convenience flag indicating whether Maxi Yatzy rules apply.
     */
    isMaxi(): boolean {
        return this.getMode() === 'maxi';
    }
}

const gameStore: Store = new Store();
export default gameStore;
