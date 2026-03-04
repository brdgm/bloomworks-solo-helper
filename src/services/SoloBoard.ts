import Action from './enum/Action'

export default interface SoloBoard {
  id: string
  floorActions: FloorActions[]
  // index = number of actions taken by user
  botCardCount: number[]
}

export interface FloorActions {
  floor: number
  // index = number of actions taken by user
  floorAction: FloorAction[]
}

export interface FloorAction {
  income?: number
  action?: Action[]
}
