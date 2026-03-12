import { cloneDeep } from 'lodash'
import { BotPersistence } from '@/store/state'
import { ref } from 'vue'
import Flower from './enum/Flower'
import CardDeck from './CardDeck'
import BotGarden from './BotGarden'
import Milestone from './enum/Milestone'
import WindowStates from './WindowStates'

/**
 * Bot persistence wrapper.
 */
export default class BotPersistenceWrapper {

  private readonly _cardDeck : CardDeck
  private readonly _garden : BotGarden
  private readonly _claimedMilestones
  private readonly _windowStates : WindowStates

  public constructor(cardDeck : CardDeck, garden : BotGarden, claimedMilestones : Milestone[], windowStates : WindowStates) {
    this._cardDeck = cardDeck
    this._garden = garden
    this._claimedMilestones = ref(claimedMilestones)
    this._windowStates = windowStates
  }

  public get cardDeck() : CardDeck {
    return this._cardDeck
  }

  public get garden() : BotGarden {
    return this._garden
  }

  public get claimedMilestones() : readonly Milestone[] {
    return this._claimedMilestones.value
  }

  public setClaimedMilestones(claimedMilestones: Milestone[]) {
    this._claimedMilestones.value = claimedMilestones
  }

  public get windowStates() : WindowStates {
    return this._windowStates
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : BotPersistence {
    return {
      cardDeck: this._cardDeck.toPersistence(),
      garden: this._garden.toPersistence(),
      claimedMilestones: cloneDeep(this._claimedMilestones.value),
      windowStates: this._windowStates.toPersistence()
    }
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : BotPersistence, flowerOrder: Flower[]) : BotPersistenceWrapper {
    return new BotPersistenceWrapper(
      CardDeck.fromPersistence(persistence.cardDeck),
      BotGarden.fromPersistence(persistence.garden, flowerOrder),
      cloneDeep(persistence.claimedMilestones),
      WindowStates.fromPersistence(persistence.windowStates ?? [])
    )
  }

}
