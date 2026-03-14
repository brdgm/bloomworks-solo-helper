import { BotAction } from '@/services/BotActions'
import Action from '@/services/enum/Action'
import { RoundTurn } from '@/store/state'

/**
 * Records statistics for a bot's round turn based on the actions taken.
 */
export default function recordBotRoundTurnStats(turn: RoundTurn, botTurn: number, actions: readonly BotAction[]) : void {
  const botPaidCardVP = getActionVP(actions, Action.PAID)
  const botSoloBoardVP = getActionVP(actions, Action.VP_5)
  const botDeliveryVP = getActionVP(actions, Action.DELIVERY) + getActionVP(actions, Action.WINDOW_BOX)

  if (botTurn == 0) {
    turn.botBonusTurn = true
  }
  if (botPaidCardVP > 0) {
    turn.botPaidCardVP = botPaidCardVP
  }
  if (botSoloBoardVP > 0) {
    turn.botSoloBoardVP = botSoloBoardVP
  }
  if (botDeliveryVP > 0) {
    turn.botDeliveryVP = botDeliveryVP
  }
}

function getActionVP(actions: readonly BotAction[], action: Action) : number {
  return actions.filter(a => a.action === action).reduce((total, a) => total + (a.vp ?? 0), 0)
}
