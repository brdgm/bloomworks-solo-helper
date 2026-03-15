import recordBotRoundTurnStats from '@/util/recordBotRoundTurnStats'
import { BotAction } from '@/services/BotActions'
import Action from '@/services/enum/Action'
import { RoundTurn } from '@/store/state'
import mockRoundTurn from '../helper/mockRoundTurn'
import { expect } from 'chai'

describe('util/recordBotRoundTurnStats', () => {
  it('no actions', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [])

    expect(turn.botBonusTurn).to.be.undefined
    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('single PAID action with VP', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.PAID, 3)
    ])

    expect(turn.botPaidCardVP).to.eq(3)
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('multiple PAID actions', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.PAID, 4),
      action(Action.PAID, 2)
    ])

    expect(turn.botPaidCardVP).to.eq(6)
  })

  it('single VP_5 action', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.VP_5, 5)
    ])

    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.eq(5)
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('multiple VP_5 actions', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.VP_5, 5),
      action(Action.VP_5, 5)
    ])

    expect(turn.botSoloBoardVP).to.eq(10)
  })

  it('DELIVERY action', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.DELIVERY, 7)
    ])

    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.eq(7)
  })

  it('WINDOW_BOX action', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.WINDOW_BOX, 4)
    ])

    expect(turn.botDeliveryVP).to.eq(4)
  })

  it('DELIVERY and WINDOW_BOX combined', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.DELIVERY, 7),
      action(Action.WINDOW_BOX, 3)
    ])

    expect(turn.botDeliveryVP).to.eq(10)
  })

  it('mixed actions', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.PAID, 3),
      action(Action.VP_5, 5),
      action(Action.DELIVERY, 6),
      action(Action.WINDOW_BOX, 2)
    ])

    expect(turn.botPaidCardVP).to.eq(3)
    expect(turn.botSoloBoardVP).to.eq(5)
    expect(turn.botDeliveryVP).to.eq(8)
  })

  it('actions without VP are ignored', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      { action: Action.PLANT },
      { action: Action.SOLD },
      { action: Action.PRICE },
      { action: Action.XP },
      { action: Action.BILLBOARD }
    ])

    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('actions with 0 VP are not recorded', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      action(Action.PAID, 0),
      action(Action.VP_5, 0),
      action(Action.DELIVERY, 0)
    ])

    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('actions with undefined VP are not recorded', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [
      { action: Action.PAID },
      { action: Action.VP_5 },
      { action: Action.DELIVERY }
    ])

    expect(turn.botPaidCardVP).to.be.undefined
    expect(turn.botSoloBoardVP).to.be.undefined
    expect(turn.botDeliveryVP).to.be.undefined
  })

  it('botTurn 0 sets botBonusTurn', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 0, [])

    expect(turn.botBonusTurn).to.eq(true)
  })

  it('botTurn 1 does not set botBonusTurn', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 1, [])

    expect(turn.botBonusTurn).to.be.undefined
  })

  it('botTurn 2 does not set botBonusTurn', () => {
    const turn = newTurn()
    recordBotRoundTurnStats(turn, 2, [])

    expect(turn.botBonusTurn).to.be.undefined
  })
})

function newTurn() : RoundTurn {
  return mockRoundTurn()
}

function action(actionType: Action, vp: number) : BotAction {
  return { action: actionType, vp }
}
