import BotMode from '@/services/enum/BotMode'
import PlayerColor from '@/services/enum/PlayerColor'
import { BotPersistence, FlowerPrice, Round, State } from '@/store/state'
import mockMarketPrices from './mockMarketPrices'
import mockBotPersistence from './mockBotPersistence'

export default function mockState(params?: MockStateParams) : State {  
  return {
    language: 'en',
    baseFontSize: 1,
    setup: {
      botMode: params?.botMode?? BotMode.BASE,
      playerColor: params?.playerColor ?? PlayerColor.WHITE,
      botColor: params?.botColor ?? PlayerColor.DARK_BLUE,
      initialMarketPrices: mockMarketPrices(params?.initialMarketPrices),
      initialBotPersistence: params?.initialBotPersistence ?? mockBotPersistence()
    },
    rounds: params?.rounds ?? []
  }
}

export interface MockStateParams {
  botMode?: BotMode,
  playerColor?: PlayerColor,
  botColor?: PlayerColor,
  initialMarketPrices?: FlowerPrice[],
  initialBotPersistence?: BotPersistence,
  rounds?: Round[]
}
