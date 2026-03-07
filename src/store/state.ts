import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import BotMode from '@/services/enum/BotMode'
import Player from '@/services/enum/Player'
import Flower from '@/services/enum/Flower'
import Season from '@/services/enum/Season'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1,
      setup: {
        botMode: BotMode.BASE
      },
      rounds: []
    } as State
  },
  actions: {
    resetGame() {
      this.rounds = []
      this.setup.initialMarketPrices = undefined
      this.gameStatsSend = false
    },
    storeRound(round : Round) {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
    },
    storeRoundTurn(roundTurn : RoundTurn) : void {
      const round = this.rounds.find(item => item.round == roundTurn.round)
      if (!round) {
        throw new Error(`Round ${roundTurn.round} not found.`)
      }
      round.turns = round.turns.filter(item => item.turn < roundTurn.turn)
      round.turns.push(roundTurn)
    }
  },
  persist: true
})

export interface State {
  language: string
  baseFontSize: number
  setup: Setup
  rounds: Round[]
  gameStatsSend?: boolean
}
export interface Setup {
  botMode: BotMode,
  initialMarketPrices?: FlowerPrice[]
  debugMode?: boolean
}

export interface Round {
  round: number
  year: number
  season: Season
  turns: RoundTurn[]
}

export interface RoundTurn {
  round: number
  turn: number
  player: Player
  marketPrices: FlowerPrice[]
  playerDeliveryFloor?: number
  botPersistence?: BotPersistence
}

export interface FlowerPrice {
  flower: Flower
  price: number
}

export interface BotPersistence {
  garden: GardenSeason[]
  cardDeck: CardDeckPersistence
}

export interface GardenSeason {
  season: Season
  flowers: Flower[]
  bigExtension: number
  smallExtensions: number
}

export interface CardDeckPersistence {
  pile: string[]
  played: string[]
  discard: string[]
}
