import { shuffle } from 'lodash'
import Card from './Card'
import Cards from './Cards'
import { CardDeckPersistence } from '@/store/state'
import { ref } from 'vue'
import CardType from './enum/CardType'

/**
 * Manages the solo card deck with action cards and advanced reserve cards.
 */
export default class CardDeck {

  private readonly _pile
  private readonly _played
  private readonly _discard
  private readonly _deckShuffleCount = ref(0)

  private constructor(pile : Card[], played : Card[], discard : Card[]) {
    this._pile = ref(pile)
    this._played = ref(played)
    this._discard = ref(discard)
  }

  public get currentCard() : Card|undefined {
    return this._played.value.at(-1)
  }

  public get pile() : readonly Card[] {
    return this._pile.value
  }

  public get played() : readonly Card[] {
    return this._played.value
  }

  public get discard() : readonly Card[] {
    return this._discard.value
  }

  public get deckShuffleCount() : number {
    return this._deckShuffleCount.value
  }

  /**
   * Draws next card and puts it in the played area.
   * Shuffles the discard pile back to the pile if the pile is empty and adds two new advanced cards.
   * @returns Next action card
   */
  public draw() : Card {
    if (this._pile.value.length === 0) {
      // adds 1 copy of each advanced card to the discard pile
      this._discard.value.push(...Cards.getAll(CardType.ADVANCED))
      this._pile.value = shuffle(this._discard.value)
      this._discard.value = []
      this._deckShuffleCount.value++
    }
    const card = this._pile.value.shift()
    if (!card) {
      throw new Error('No cards left to draw.')
    }
    this._played.value.push(card)
    return card
  }

  /**
   * Discards all played cards to the discard pile.
   * Removes cards marked as "remove" from the game instead of discarding them.
   */
  public discardPlayed() : void {
    this._discard.value.unshift(...this._played.value
        .filter(card => !card.remove))
    this._played.value = []
  }

  /**
   * Gets persistence view of card deck.
   */
  public toPersistence() : CardDeckPersistence {
    return {
      pile: this._pile.value.map(card => card.id),
      played: this._played.value.map(card => card.id),
      discard: this._discard.value.map(card => card.id)
    }
  }

  /**
   * Creates a shuffled new card deck.
   * @param difficultyLevel DifficultyLevel
   * @param expansions Expansions
   * @returns CardDeck
   */
  public static new() : CardDeck {
    const cards = shuffle(Cards.getAll(CardType.STANDARD))
    return new CardDeck(cards, [], [])
  }

  /**
   * Re-creates card deck from persistence.
   */
  public static fromPersistence(persistence : CardDeckPersistence) : CardDeck {
    return new CardDeck(
      persistence.pile.map(Cards.get),
      persistence.played.map(Cards.get),
      persistence.discard.map(Cards.get)
    )
  }

}
