import Action from './enum/Action'
import CardType from './enum/CardType'
import PriceSelection from './enum/PriceSelection'
import WindowSelection from './enum/WindowSelection'

export default interface Card {
  id: string
  cardType: CardType
  actions: CardAction[]
  remove?: boolean
  advanced?: boolean
}

export interface CardAction {
  action: Action
  floor?: number
  windowSelection?: WindowSelection
  priceSelection?: PriceSelection
}
