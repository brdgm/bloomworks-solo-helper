import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import BotMode from '@/services/enum/BotMode'

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
  botMode: BotMode,
  debugMode?: boolean
}

export interface Round {
  round: number
}

export interface CardDeckPersistence {
  pile: string[]
  played: string[]
  discard: string[]
}
