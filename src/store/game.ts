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
    smallStraight?: number;
    largeStraight?: number;
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
            players: [
                { name: 'Bastian' },
                { name: 'Jonte' },
                { name: 'Jojjo' },
                { name: 'Petra' }
            ]
        };
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
