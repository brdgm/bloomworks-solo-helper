import Player from '@/services/enum/Player'
import { Round, State } from '@/store/state'

export default function mockState(params?: MockStateParams) : State {  
  return {
    language: 'en',
    baseFontSize: 1,
    setup: {
      startPlayer: params?.startPlayer
    },
    rounds: params?.rounds ?? []
  }
}

export interface MockStateParams {
  startPlayer?: Player,
  rounds?: Round[]
}
