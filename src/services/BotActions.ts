import Flower from './enum/Flower'
import MarketPrices from './MarketPrices'
import BotGarden from './BotGarden'
import { CardAction } from './Card'
import BotAction from '@/components/round/BotAction.vue'
import Action from './enum/Action'
import Season from './enum/Season'
import NavigationState from '@/util/NavigationState'
import WindowStates from './WindowStates'
import WindowSelection from './enum/WindowSelection'
import PriceSelection from './enum/PriceSelection'
import { cloneDeep } from 'lodash'
import Player from './enum/Player'
import getFlowerMatchCount from '@/util/getFlowerMatchCount'
import getDistinctFlowers from '@/util/getDistinctFlowers'
import BillboardMarkers from './BillboardMarkers'

/**
 * Collects the bot's actions and manages the automatic actions.
 */
export default class BotActions {

  private readonly _marketPrices : MarketPrices
  private readonly _botGarden : BotGarden
  private readonly _windowStates : WindowStates
  private readonly _billboardMarkers : BillboardMarkers
  private readonly _season : Season
  private readonly _actions : BotAction[]

  public constructor(navigationState: NavigationState) {
    this._marketPrices = navigationState.marketPrices
    this._botGarden = navigationState.botPersistence.garden
    this._windowStates = navigationState.botPersistence.windowStates
    this._billboardMarkers = navigationState.botPersistence.billboardMarkers
    this._season = navigationState.season

    const actions = this.getCardActions(navigationState)
    this._actions = this.process(actions)
  }

  public get actions(): readonly BotAction[] {
    return this._actions
  }

  /**
   * Get actions for current bot turn - either from current solo card, or form solo board pass bonus.
   */
  private getCardActions(navigationState: NavigationState): CardAction[] {
      if (navigationState.botTurn == 0) {
        return navigationState.soloBoardPassAction.action.map(action => {
          if (action == Action.BILLBOARD) {
            const { floor } = navigationState.soloBoardPassAction
            return { action, floor }
          }
          else {
            return { action }
          }
        })
      }
      else {
        return navigationState.botPersistence.cardDeck.currentCard?.actions || []
      }
  }

  /**
   * Process card actions to bot actions (executing the automatic managed ones).
   */
  private process(actions: CardAction[]): BotAction[] {
    return actions.map(action => this.processAction(action))
  }

  private processAction(action: CardAction): BotAction {
    const botAction: BotAction = cloneDeep(action)
    switch (action.action) {
      case Action.PLANT:
        this.processPlant(botAction)
        break
      case Action.SOLD:
        this.processSold(botAction)
        break
      case Action.PAID:
        this.processPaid(botAction)
        break
      case Action.PRICE:
        this.processPrice(botAction)
        break
      case Action.DELIVERY:
        if (!this.processDelivery(botAction)) {
          // switch to window box if delivery is not possible
          botAction.action = Action.WINDOW_BOX
          this.processWindowBox(botAction)
        }
        break
      case Action.WINDOW_BOX:
        if (!this.processWindowBox(botAction)) {
          // switch to delivery if defining window box is not possible
          botAction.action = Action.DELIVERY
          this.processDelivery(botAction)
        }
        break
      case Action.VP_5:
        this.processVP5(botAction)
        break
      case Action.BILLBOARD:
        this.processBillboard(botAction)
        break
    }
    return botAction
  }

  /**
   * Plant most expensive flower in the garden, reduce price by 1
   */
  private processPlant(botAction: BotAction): void {
    botAction.flower = this._marketPrices.getMostExpensiveFlower()
    this._botGarden.plant(botAction.flower, this._season)
    this._marketPrices.decrease(botAction.flower)
  }

  /**
   * Get distinct list of flowers in current season, reduce price by 1 for each
   */
  private processSold(botAction: BotAction): void {
    botAction.flowers = getDistinctFlowers(this.getFlowersOfCurrentSeason())
    for (const flower of botAction.flowers) {
      this._marketPrices.decrease(flower)
    }
  }

  /**
   * Identify the most expensive flower in this season, reduce price by 1 and gain that number of VP
   */
  private processPaid(botAction: BotAction): void {
    botAction.flower = this.getMostExpensiveFlowerOfCurrentSeason()
    if (botAction.flower) {
      this._marketPrices.decrease(botAction.flower)
      botAction.vp = this._marketPrices.getPrice(botAction.flower)
    }
  }

  /**
   * If window is already defined: increase price of flowers in that window by 1, otherwise increase 1 least/most expensive flower
   */
  private processPrice(botAction: BotAction): void {
    const windowState = this._windowStates.getWindowState(botAction.floor ?? 1, botAction.windowSelection ?? WindowSelection.LEFT)
    if (windowState) {
      botAction.flowers = windowState.flowers
    }
    else if (botAction.priceSelection == PriceSelection.MOST_EXPENSIVE) {
      botAction.flowers = [this._marketPrices.getMostExpensiveFlower()]
    }
    else {
      botAction.flowers = [this._marketPrices.getCheapestFlower()]
    }
    for (const flower of botAction.flowers) {
      this._marketPrices.increase(flower)
    }
  }

  /**
   * Bot gets 5 VP.
   */
  private processVP5(botAction: BotAction): void {
    botAction.vp = 5
  }

  /**
   * Add billboard marker.
   */
  private processBillboard(botAction: BotAction): void {
    this._billboardMarkers.addMarker(botAction.floor ?? 1)
  }

  /**
   * Executes bot delivery.
   * @return true If the delivery was successful
   */
  private processDelivery(botAction: BotAction): boolean {
    const currentSeasonFlowers = this.getFlowersOfCurrentSeason()
    const window = this._windowStates.getBestMatchingDeliveryWindow(currentSeasonFlowers)
    if (window) {
      botAction.floor = window.floor
      botAction.windowSelection = window.windowSelection
      // for VP and XP, only the flowers actually present in the current season are counted
      botAction.vp = this.getVPFromMatchingFlowers(window.flowers, currentSeasonFlowers)
      botAction.xp = window.flowers.filter(flower => currentSeasonFlowers.includes(flower))
      this._windowStates.addDelivery(window.floor, window.windowSelection, Player.BOT)
      return true
    }
    return false
  }

  /**
   * Executes bot defining a new window box.
   * @return true If defining the window box was successful
   */
  private processWindowBox(botAction: BotAction): boolean {
    const currentSeasonFlowers = this.getFlowersOfCurrentSeason()
    const window = this._windowStates.getBestMatchingUndefinedWindow(currentSeasonFlowers, this._marketPrices)
    if (window) {
      botAction.floor = window.floor
      botAction.windowSelection = window.windowSelection
      botAction.flowers = window.flowers
      botAction.vp = this.getVPFromMatchingFlowers(window.flowers, currentSeasonFlowers)
      botAction.xp = getDistinctFlowers(window.flowers)
      this._windowStates.setWindowState(window.floor, window.windowSelection, window.flowers, [Player.BOT])
      return true
    }
    return false
  }

  /**
   * Get VPs for matching flowers on delivery.
   */
  private getVPFromMatchingFlowers(flowers: Flower[], flowersToMatch: Flower[]): number {
    switch (getFlowerMatchCount(flowers, flowersToMatch)) {
      case 1: return 2
      case 2: return 4
      case 3: return 7
      case 4: return 10
      case 5: return 16
      default: return 0
    }
  }

  private getFlowersOfCurrentSeason(): Flower[] {
    return this._botGarden.seasons.find(s => s.season === this._season)?.flowers || []
  }

  private getMostExpensiveFlowerOfCurrentSeason(): Flower|undefined {
    let mostExpensiveFlower
    let mostExpensivePrice = 0
    for (const flower of this.getFlowersOfCurrentSeason()) {
      const price = this._marketPrices.getPrice(flower)
      if (price > mostExpensivePrice) {
        mostExpensiveFlower = flower
        mostExpensivePrice = price
      }
    }
    return mostExpensiveFlower
  }

}

export interface BotAction extends CardAction {
  flower?: Flower
  flowers?: Flower[]
  vp?: number
  xp?: Flower[]
}
