import { cloneDeep } from 'lodash'
import { BotPersistence } from '@/store/state'
import { ref } from 'vue'
import Flower from './enum/Flower'
import CardDeck from './CardDeck'
import BotGarden from './BotGarden'
import Milestone from './enum/Milestone'

/**
 * Bot persistence wrapper.
 */
export default class BotPersistenceWrapper {

  private readonly _cardDeck : CardDeck
  private readonly _garden : BotGarden
  private readonly _claimedMilestones

  public constructor(cardDeck : CardDeck, garden : BotGarden, claimedMilestones : Milestone[]) {
    this._cardDeck = cardDeck
    this._garden = garden
    this._claimedMilestones = ref(claimedMilestones)
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

  /**
   * Gets persistence view.
   */
  public toPersistence() : BotPersistence {
    return {
      cardDeck: this._cardDeck.toPersistence(),
      garden: this._garden.toPersistence(),
      claimedMilestones: cloneDeep(this._claimedMilestones.value)
    }
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : BotPersistence, flowerOrder: Flower[]) : BotPersistenceWrapper {
    return new BotPersistenceWrapper(
      CardDeck.fromPersistence(persistence.cardDeck),
      BotGarden.fromPersistence(persistence.garden, flowerOrder),
      cloneDeep(persistence.claimedMilestones)
    )
  }

}
