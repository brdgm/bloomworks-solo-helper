import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import Player from '@/services/enum/Player'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1,
      setup: {},
      rounds: []
    } as State
  },
  actions: {
    resetGame() {
      this.rounds = []
      this.gameStatsSend = false
    },
    storeRound(round : Round) {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
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
  startPlayer?: Player
  debugMode?: boolean
}

export interface Round {
  round: number
}

export interface CardDeckPersistence {
  pile: number[]
  discard: number[]
}
