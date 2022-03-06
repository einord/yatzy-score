import { StoreBase } from './store-base';

export interface Player {
    name: string;

    // Points
    aces?: number;
    twos?: number;
    threes?: number;
    fours?: number;
    fives?: number;
    sixes?: number;
    pair?: number;
    twoPairs?: number;
    threeOfAKind?: number;
    fourOfAKind?: number;
    smallStraight?: boolean;
    largeStraight?: boolean;
    fullHouse?: number;
    chance?: number;
    yahtzee?: boolean;
}

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
