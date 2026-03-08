import { BotPersistence } from '@/store/state'
import CardDeck from '@/services/CardDeck'
import BotGarden from '@/services/BotGarden'
import mockCardDeck from './mockCardDeck'
import mockBotGarden from './mockBotGarden'

export default function mockBotPersistence(params?: MockBotPersistenceParams) : BotPersistence {
  return {
    cardDeck: (params?.cardDeck ?? mockCardDeck()).toPersistence(),
    garden: (params?.garden ?? mockBotGarden()).toPersistence()
  }
}

export interface MockBotPersistenceParams {
  cardDeck?: CardDeck,
  garden?: BotGarden
}
