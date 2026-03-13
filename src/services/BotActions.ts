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

/**
 * Collects the bot's actions and manages the automatic actions.
 */
export default class BotActions {

  private readonly _marketPrices : MarketPrices
  private readonly _botGarden : BotGarden
  private readonly _windowStates : WindowStates
  private readonly _season : Season
  private readonly _actions : BotAction[]

  public constructor(navigationState: NavigationState) {
    this._marketPrices = navigationState.marketPrices
    this._botGarden = navigationState.botPersistence.garden
    this._windowStates = navigationState.botPersistence.windowStates
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
    const botActions: BotAction[] = []
    for (const action of actions) {
      const botAction: BotAction = action

      switch (action.action) {

        case Action.PLANT:
          // plant most expensive flower in the garden, reduce price by 1
          botAction.flower = this._marketPrices.getMostExpensiveFlower()
          this._botGarden.plant(botAction.flower, this._season)
          this._marketPrices.decrease(botAction.flower)
          break

        case Action.SOLD:
          // get distinct list of flowers in current season, reduce price by 1 for each
          const distinctFlowers = [...new Set(this.getFlowersOfCurrentSeason())]
          for (const flower of distinctFlowers) {
            this._marketPrices.decrease(flower)
          }
          break

        case Action.PAID:
          // identify the most expensive flower in this season, reduce price by 1 and gain that number of VP
          const mostExpensiveFlower = this.getMostExpensiveFlowerOfCurrentSeason()
          if (mostExpensiveFlower) {
            this._marketPrices.decrease(mostExpensiveFlower)
            botAction.vp = this._marketPrices.getPrice(mostExpensiveFlower)
          }
          break

        case Action.PRICE:
          // if windows is already defined: increase price of flowers in that window by 1, otherwise increase 1 least/most expensive flower
          const windowState = this._windowStates.getWindowState(action.floor ?? 1, action.windowSelection ?? WindowSelection.LEFT)
          if (windowState) {
            botAction.flowers = windowState.flowers
          }
          else if (action.priceSelection == PriceSelection.MOST_EXPENSIVE) {
            botAction.flowers = [this._marketPrices.getMostExpensiveFlower()]
          }
          else {
            botAction.flowers = [this._marketPrices.getCheapestFlower()]
          }
          for (const flower of botAction.flowers) {
            this._marketPrices.increase(flower)
          }
          break
      }

      botActions.push(botAction)
    }
    return botActions
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
}
