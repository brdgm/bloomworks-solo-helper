import Action from '@/services/enum/Action'
import BotMode from '@/services/enum/BotMode'
import SoloBoards from '@/services/SoloBoards'
import getSoloBoardPassAction from '@/util/getSoloBoardPassAction'
import { expect } from 'chai'

describe('util/getSoloBoardPassAction', () => {
  const baseSoloBoard = SoloBoards.get(BotMode.BASE)

  it('floor 5, 0 turns', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 0, 5)
    expect(result.income).to.eq(2)
    expect(result.action).to.eql([])
    expect(result.botCardCount).to.eq(2)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('floor 5, 5 turns', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 5, 5)
    expect(result.income).to.eq(0)
    expect(result.action).to.eql([Action.VP_5])
    expect(result.botCardCount).to.eq(5)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('floor 1, 2 turns', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 2, 1)
    expect(result.income).to.eq(4)
    expect(result.action).to.eql([Action.XP])
    expect(result.botCardCount).to.eq(4)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('floor 2, 3 turns', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 3, 2)
    expect(result.income).to.eq(2)
    expect(result.action).to.eql([Action.XP])
    expect(result.botCardCount).to.eq(4)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('floor 3, 4 turns', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 4, 3)
    expect(result.income).to.eq(0)
    expect(result.action).to.eql([Action.XP])
    expect(result.botCardCount).to.eq(5)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('turns beyond 5 adds burn cards', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 7, 5)
    expect(result.income).to.eq(0)
    expect(result.action).to.eql([Action.VP_5])
    expect(result.botCardCount).to.eq(5)
    expect(result.botBurnCardCount).to.eq(6)
  })

  it('turns beyond 5 caps turnsUpTo5 at 5', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 8, 1)
    expect(result.income).to.eq(0)
    expect(result.action).to.eql([Action.BILLBOARD])
    expect(result.botCardCount).to.eq(5)
    expect(result.botBurnCardCount).to.eq(9)
  })

  it('invalid floor returns defaults', () => {
    const result = getSoloBoardPassAction(baseSoloBoard, 2, 99)
    expect(result.income).to.eq(0)
    expect(result.action).to.eql([])
    expect(result.botCardCount).to.eq(4)
    expect(result.botBurnCardCount).to.eq(0)
  })

  it('advanced solo board, floor 2, 4 turns', () => {
    const advancedSoloBoard = SoloBoards.get(BotMode.ADVANCED)
    const result = getSoloBoardPassAction(advancedSoloBoard, 4, 2)
    expect(result.income).to.eq(1)
    expect(result.action).to.eql([Action.PLANT])
    expect(result.botCardCount).to.eq(5)
    expect(result.botBurnCardCount).to.eq(0)
  })
})
