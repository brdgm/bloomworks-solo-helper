import Action from '@/services/enum/Action'
import SoloBoard from '@/services/SoloBoard'

/**
 * Get bot actions, income and bot card count from solo board when player passes.
 */
export default function getSoloBoardPassAction(soloBoard: SoloBoard, playerTurns: number, playerDeliveryFloor: number) : SoloBoardPassAction {
  let turnsUpTo5 = playerTurns
  let turnsBeyond5 = 0
  if (playerTurns > 5) {
    turnsUpTo5 = 5
    turnsBeyond5 = playerTurns - 5
  }

  const floorActions = soloBoard.floorActions.find(floorAction => floorAction.floor === playerDeliveryFloor)
  const income = floorActions?.floorAction[turnsUpTo5]?.income ?? 0
  const action = floorActions?.floorAction[turnsUpTo5]?.action ?? []
  const botCardCount = soloBoard.botCardCount[turnsUpTo5] ?? 0
  const botBurnCardCount = turnsBeyond5 > 0 ? 3 : 0
  const floor = playerDeliveryFloor

  return {
    income,
    action,
    botCardCount,
    botBurnCardCount,
    floor
  }
}

export interface SoloBoardPassAction {
  income: number
  action: Action[]
  botCardCount: number
  botBurnCardCount: number
  floor: number
}
