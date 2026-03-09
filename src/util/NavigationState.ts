import { BotPersistence, FlowerPrice, RoundTurn, State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Season from '@/services/enum/Season'
import CardDeck from '@/services/CardDeck'
import BotGarden from '@/services/BotGarden'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Flower from '@/services/enum/Flower'
import MarketPrices from '@/services/MarketPrices'
import Player from '@/services/enum/Player'
import SoloBoard from '@/services/SoloBoard'
import SoloBoards from '@/services/SoloBoards'
import getSoloBoardPassAction, { SoloBoardPassAction } from './getSoloBoardPassAction'
import BotPersistenceWrapper from '@/services/BotPersistenceWrapper'

export default class NavigationState {

  readonly round : number
  readonly turn : number
  readonly season : Season
  readonly player : Player

  readonly playerTurns: number
  readonly playerDeliveryFloor: number

  readonly marketPrices : MarketPrices
  readonly botPersistence : BotPersistenceWrapper
  readonly soloBoard : SoloBoard
  readonly soloBoardPassAction : SoloBoardPassAction

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')
    this.season = getSeason(this.round, state)
    this.turn = getIntRouteParam(route, 'turn')
    this.player = route.name=="RoundTurnPlayer" ? Player.PLAYER : Player.BOT

    this.playerTurns = getPlayerTurns(this.round, this.turn, state)
    this.playerDeliveryFloor = getPlayerDeliveryFloor(this.round, this.turn, state)

    this.marketPrices = MarketPrices.fromPersistence(getFlowerPrices(this.round, this.turn, state))
    this.botPersistence = BotPersistenceWrapper.fromPersistence(getBotPersistence(this.round, this.turn, state), this.marketPrices.flowerOrder)
    this.soloBoard = SoloBoards.get(state.setup.botMode)
    this.soloBoardPassAction = getSoloBoardPassAction(this.soloBoard, this.playerTurns, this.playerDeliveryFloor)

    if (this.player == Player.BOT && this.botTurn > 0) {
      this.botPersistence.cardDeck.draw()
    }
  }

  get playerTurn() : number {
    if (this.player == Player.PLAYER) {
      return this.turn
    }
    return this.playerTurns
  }

  get botTurn() : number {
    if (this.player == Player.BOT) {
      return this.turn - this.playerTurns
        - 1  // player pass turn
        - (this.soloBoardPassAction.action.length > 0 ? 1 : 0)  // bot pass turn actions
    }
    return 0
  }

  get botTurns() : number {
    return this.soloBoardPassAction.botCardCount
  }

}

function getSeason(round: number, state: State) : Season {
  const roundData = state.rounds.find(r => r.round === round)
  return roundData ? roundData.season : Season.AUTUMN
}

function getPlayerTurns(round: number, turn: number, state: State) : number {
  return getTurns(round, turn, state).filter(t => t.player == Player.PLAYER && !t.playerPass).length
}

function getPlayerDeliveryFloor(round: number, turn: number, state: State) : number {
  return getTurns(round, turn, state).find(t => t.player == Player.PLAYER)?.playerDeliveryFloor ?? 1
}

function getFlowerPrices(round: number, turn: number, state: State) : FlowerPrice[] {
  const prices = getTurns(round, turn, state)[0]?.marketPrices
  if (prices) {
    return prices
  }
  if (round > 1) {
    return getFlowerPrices(round - 1, 0, state)
  }
  else {
    return state.setup.initialMarketPrices ?? MarketPrices.new().toPersistence()
  }
}

function getBotPersistence(round: number, turn: number, state: State) : BotPersistence {
  const botPersistence = getTurns(round, turn, state)[0]?.botPersistence
  if (botPersistence) {
    return botPersistence
  }
  if (round > 1) {
    return getBotPersistence(round - 1, 0, state)
  }
  else {
    return state.setup.initialBotPersistence ?? {
      cardDeck: CardDeck.new().toPersistence(),
      garden: BotGarden.new([], getAllEnumValues(Flower)).toPersistence(),
      claimedMilestones: []
    }
  }
}

/**
 * Get previous turns of round in reverse turn order.
 * If turn=0 gets all turns.
 */
function getTurns(round: number, turn: number, state: State) : RoundTurn[] {
  const roundData = state.rounds.find(r => r.round === round)
  if (!roundData) {
    return []
  }
  return roundData.turns
    .filter(t => t.turn < turn || turn == 0)
    .toSorted((a, b) => b.turn - a.turn)
}
