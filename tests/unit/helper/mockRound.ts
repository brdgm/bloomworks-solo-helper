import Season from '@/services/enum/Season'
import { Round, RoundTurn } from '@/store/state'

export default function mockRound(params?: MockRoundParams) : Round {
  return {
    round: params?.round ?? 1,
    year: params?.year ?? 1,
    season: params?.season ?? Season.AUTUMN,
    turns: params?.turns ?? []
  }
}

export interface MockRoundParams {
  round? : number,
  year? : number,
  season? : Season,
  turns? : RoundTurn[]
}
