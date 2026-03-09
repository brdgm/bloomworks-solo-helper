import { BotPersistence } from '@/store/state'
import CardDeck from '@/services/CardDeck'
import BotGarden from '@/services/BotGarden'
import Milestone from '@/services/enum/Milestone'
import mockCardDeck from './mockCardDeck'
import mockBotGarden from './mockBotGarden'

export default function mockBotPersistence(params?: MockBotPersistenceParams) : BotPersistence {
  return {
    cardDeck: (params?.cardDeck ?? mockCardDeck()).toPersistence(),
    garden: (params?.garden ?? mockBotGarden()).toPersistence(),
    claimedMilestones: params?.claimedMilestones ?? []
  }
}

export interface MockBotPersistenceParams {
  cardDeck?: CardDeck,
  garden?: BotGarden,
  claimedMilestones?: Milestone[]
}
