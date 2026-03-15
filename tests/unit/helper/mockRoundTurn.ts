import Player from '@/services/enum/Player'
import { BotPersistence, FlowerPrice, RoundTurn } from '@/store/state'
import mockMarketPrices from './mockMarketPrices'

export default function mockRoundTurn(params?: MockRoundTurnParams) : RoundTurn {
  return {
    round: params?.round ?? 1,    
    turn: params?.turn ?? 1,
    player: params?.player ?? Player.PLAYER,
    marketPrices: mockMarketPrices(params?.marketPrices),
    playerDeliveryFloor: params?.playerDeliveryFloor,
    playerPass: params?.playerPass,
    botPersistence: params?.botPersistence
  }
}

export interface MockRoundTurnParams {
  round? : number,
  turn? : number,
  player? : Player,
  marketPrices?: FlowerPrice[],
  playerDeliveryFloor? : number,
  playerPass? : boolean,
  botPersistence?: BotPersistence
}
