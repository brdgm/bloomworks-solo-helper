import Action from './enum/Action'
import CardType from './enum/CardType'
import PriceSelection from './enum/PriceSelection'
import WindowSelection from './enum/WindowSelection'

export default interface Card {
  id: string
  cardType: CardType
  action: Action
  count?: number
  windowSelection?: WindowSelection
  priceSelection?: PriceSelection
  remove?: boolean
  advanced?: boolean
}
