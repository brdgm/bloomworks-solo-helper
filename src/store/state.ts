import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import BotMode from '@/services/enum/BotMode'
import Player from '@/services/enum/Player'
import PlayerColor from '@/services/enum/PlayerColor'
import Flower from '@/services/enum/Flower'
import Season from '@/services/enum/Season'
import Milestone from '@/services/enum/Milestone'
import WindowSelection from '@/services/enum/WindowSelection'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1,
      setup: {
        botMode: BotMode.BASE,
        playerColor: PlayerColor.WHITE,
        botColor: PlayerColor.DARK_BLUE
      },
      rounds: []
    } as State
  },
  actions: {
    resetGame() {
      this.rounds = []
      this.setup.milestoneSeasonOrder = undefined
      this.setup.initialMarketPrices = undefined
      this.setup.initialBotPersistence = undefined
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
  finalScoringAmount?: FinalScoringAmount
  gameStatsSend?: boolean
}
export interface Setup {
  botMode: BotMode
  playerColor: PlayerColor
  botColor: PlayerColor
  milestoneSeasonOrder?: Season[]
  initialMarketPrices?: FlowerPrice[]
  initialBotPersistence?: BotPersistence
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
  playerPass?: boolean
  botPersistence: BotPersistence
}

export interface FlowerPrice {
  flower: Flower
  price: number
}

export interface BotPersistence {
  garden: GardenSeason[]
  cardDeck: CardDeckPersistence
  claimedMilestones: Milestone[]
  windowStates: WindowState[]
  billboardMarkers: BillboardMarker[]
}

export interface GardenSeason {
  season: Season
  flowers: Flower[]
  bigExtension: number
  smallExtensions: number
}

export interface CardDeckPersistence {
  pile: string[]
  discard: string[]
}

export interface WindowState {
  floor: number
  windowSelection: WindowSelection
  flowers: Flower[]
  deliveries: Player[]
}

export interface BillboardMarker {
  floor: number
  count: number
}

export interface FinalScoringAmount {
  scoringTrackVP: number[]
  prosperityVP: number[]
  populationVP: number[]
  cultureVP: number[]
  influenceSteps: number[]
  politicsSteps: number[]
  warSteps: number[]
  wonderVPs: number[]
  yellowBuildingVPs: number[]
  diplomacyCardCount: number[]
}
