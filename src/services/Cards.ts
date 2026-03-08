import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import Card from './Card'
import Action from './enum/Action'
import CardType from './enum/CardType'
import WindowSelection from './enum/WindowSelection'
import PriceSelection from './enum/PriceSelection'

/**
 * Solo cards
 */
const cards : Card[] = [
  // Standard cards
  {
    id: 'window-box-1',
    cardType: CardType.STANDARD,
    actions: [{action:Action.WINDOW_BOX}],
    remove: true
  },
  {
    id: 'window-box-2',
    cardType: CardType.STANDARD,
    actions: [{action:Action.WINDOW_BOX}],
    remove: true
  },
  {
    id: 'window-box-3',
    cardType: CardType.STANDARD,
    actions: [{action:Action.WINDOW_BOX}],
    remove: true
  },
  {
    id: 'window-box-4',
    cardType: CardType.STANDARD,
    actions: [{action:Action.WINDOW_BOX}]
  },
  {
    id: 'delivery-1',
    cardType: CardType.STANDARD,
    actions: [{action:Action.DELIVERY}]
  },
  {
    id: 'price-1',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_3R,
      priceSelection: PriceSelection.MOST_EXPENSIVE
    }]
  },
  {
    id: 'price-2',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_3L,
      priceSelection: PriceSelection.LEAST_EXPENSIVE
    }]
  },
  {
    id: 'price-3',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_2R,
      priceSelection: PriceSelection.MOST_EXPENSIVE
    }]
  },
  {
    id: 'price-4',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_2L,
      priceSelection: PriceSelection.LEAST_EXPENSIVE
    }]
  },
  {
    id: 'price-5',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_1R,
      priceSelection: PriceSelection.MOST_EXPENSIVE
    }],
    remove: true
  },
  {
    id: 'price-6',
    cardType: CardType.STANDARD,
    actions: [{
      action:Action.PRICE,
      windowSelection: WindowSelection.WINDOW_1L,
      priceSelection: PriceSelection.MOST_EXPENSIVE
    }],
    remove: true
  },
  {
    id: 'plant-1',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.PLANT,
    }]
  },
  {
    id: 'plant-2',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.PLANT
    }]
  },
  {
    id: 'plant-3',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.PLANT
    },{
      action: Action.PLANT
    }],
    remove: true
  },
  {
    id: 'plant-4',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.PLANT
    },{
      action: Action.PLANT
    }],
    remove: true
  },
  {
    id: 'sold-1',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.SOLD
    }]
  },
  {
    id: 'xp-1',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.XP
    }]
  },
  {
    id: 'xp-2',
    cardType: CardType.STANDARD,
    actions: [{
      action: Action.XP
    }]
  },
  // Advanced cards
  {
    id: 'adv-delivery',
    cardType: CardType.ADVANCED,
    actions: [{
      action: Action.DELIVERY
    }],
    remove: true
  },
  {
    id: 'adv-paid',
    cardType: CardType.ADVANCED,
    actions: [{
      action: Action.PAID
    }],
    remove: true
  }
]

const cardsMap = new Map<string,Card>()
for (const card of cards) {
  cardsMap.set(card.id, card)
}

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns Card
   */
  get(id: string) : Card {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @param cardType Card type
   * @returns Cards
   */
  getAll(cardType: CardType) : Card[] {
    return cards
        .filter(card => card.cardType === cardType)
  }

}
