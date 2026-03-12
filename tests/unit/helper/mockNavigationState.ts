import MarketPrices from '@/services/MarketPrices'
import Action from '@/services/enum/Action'
import Flower from '@/services/enum/Flower'
import Season from '@/services/enum/Season'
import NavigationState from '@/util/NavigationState'
import BotGarden from '@/services/BotGarden'
import CardDeck from '@/services/CardDeck'
import DefinedWindows from '@/services/DefinedWindows'
import mockMarketPrices from './mockMarketPrices'
import mockBotGarden from './mockBotGarden'
import mockCardDeck from './mockCardDeck'

export default function mockNavigationState(params?: MockNavigationStateParams): NavigationState {
  const marketPrices = MarketPrices.fromPersistence(mockMarketPrices(params?.marketPrices))
  const garden = params?.garden ?? mockBotGarden()
  const cardDeck = params?.cardDeck ?? mockCardDeck()
  const definedWindows = params?.definedWindows ?? DefinedWindows.new()
  return {
    marketPrices,
    botPersistence: {
      garden,
      cardDeck,
      definedWindows
    },
    season: params?.season ?? Season.AUTUMN,
    botTurn: params?.botTurn ?? 1,
    soloBoardPassAction: params?.soloBoardPassAction ?? { income: 0, action: [], botCardCount: 0, botBurnCardCount: 0, floor: 1 }
  } as unknown as NavigationState
}

export interface MockNavigationStateParams {
  marketPrices?: { flower: Flower, price: number }[]
  garden?: BotGarden
  cardDeck?: CardDeck
  definedWindows?: DefinedWindows
  season?: Season
  botTurn?: number
  soloBoardPassAction?: { income: number, action: Action[], botCardCount: number, botBurnCardCount: number, floor: number }
}
