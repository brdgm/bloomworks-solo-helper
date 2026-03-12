import WindowStates from '@/services/WindowStates'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'

describe('services/WindowStates', () => {
  it('new', () => {
    const dw = WindowStates.new()
    expect(dw.windowStates).to.deep.eq([])
  })

  it('setWindowState-new', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_1L, [Flower.RED, Flower.BLUE], [])

    expect(dw.getWindowState(WindowSelection.WINDOW_1L)).to.deep.eq({ windowSelection: WindowSelection.WINDOW_1L, flowers: [Flower.RED, Flower.BLUE], deliveries: [] })
    expect(dw.windowStates.length).to.eq(1)
  })

  it('setWindowState-update', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_2R, [Flower.PURPLE], [])
    dw.setWindowState(WindowSelection.WINDOW_2R, [Flower.YELLOW, Flower.ORANGE], [Player.PLAYER])

    expect(dw.getWindowState(WindowSelection.WINDOW_2R)).to.deep.eq({ windowSelection: WindowSelection.WINDOW_2R, flowers: [Flower.YELLOW, Flower.ORANGE], deliveries: [Player.PLAYER] })
    expect(dw.windowStates.length).to.eq(1)
  })

  it('getWindowState-undefined', () => {
    const dw = WindowStates.new()
    expect(dw.getWindowState(WindowSelection.WINDOW_3L)).to.be.undefined
  })

  it('toPersistence', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_1L, [Flower.RED], [])
    dw.setWindowState(WindowSelection.WINDOW_3R, [Flower.BLUE, Flower.PURPLE], [Player.PLAYER, Player.BOT])

    const persistence = dw.toPersistence()
    expect(persistence).to.deep.eq([
      { windowSelection: WindowSelection.WINDOW_1L, flowers: [Flower.RED], deliveries: [] },
      { windowSelection: WindowSelection.WINDOW_3R, flowers: [Flower.BLUE, Flower.PURPLE], deliveries: [Player.PLAYER, Player.BOT] }
    ])

    // verify it's a deep clone
    persistence[0].flowers.push(Flower.ORANGE)
    expect(dw.getWindowState(WindowSelection.WINDOW_1L)?.flowers).to.deep.eq([Flower.RED])
  })

  it('fromPersistence', () => {
    const persistence = [
      { windowSelection: WindowSelection.WINDOW_2L, flowers: [Flower.YELLOW], deliveries: [Player.PLAYER] },
      { windowSelection: WindowSelection.WINDOW_3L, flowers: [Flower.RED, Flower.ORANGE], deliveries: [Player.BOT] }
    ]

    const dw = WindowStates.fromPersistence(persistence)
    expect(dw.getWindowState(WindowSelection.WINDOW_2L)).to.deep.eq({ windowSelection: WindowSelection.WINDOW_2L, flowers: [Flower.YELLOW], deliveries: [Player.PLAYER] })
    expect(dw.getWindowState(WindowSelection.WINDOW_3L)).to.deep.eq({ windowSelection: WindowSelection.WINDOW_3L, flowers: [Flower.RED, Flower.ORANGE], deliveries: [Player.BOT] })
    expect(dw.windowStates.length).to.eq(2)

    // verify it's a deep clone from source
    persistence[0].flowers.push(Flower.BLUE)
    expect(dw.getWindowState(WindowSelection.WINDOW_2L)?.flowers).to.deep.eq([Flower.YELLOW])
  })

  it('removeWindowState', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_1L, [Flower.RED, Flower.BLUE], [])
    dw.setWindowState(WindowSelection.WINDOW_2L, [Flower.YELLOW], [Player.PLAYER])
    dw.setWindowState(WindowSelection.WINDOW_3R, [Flower.PURPLE, Flower.ORANGE], [Player.BOT])

    dw.removeWindowState(WindowSelection.WINDOW_2L)

    expect(dw.windowStates.length).to.eq(2)
    expect(dw.getWindowState(WindowSelection.WINDOW_1L)?.flowers).to.deep.eq([Flower.RED, Flower.BLUE])
    expect(dw.getWindowState(WindowSelection.WINDOW_2L)).to.be.undefined
    expect(dw.getWindowState(WindowSelection.WINDOW_3R)?.flowers).to.deep.eq([Flower.PURPLE, Flower.ORANGE])
  })

  it('removeWindowState-nonExisting', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_1L, [Flower.RED], [])

    dw.removeWindowState(WindowSelection.WINDOW_2R)

    expect(dw.windowStates.length).to.eq(1)
    expect(dw.getWindowState(WindowSelection.WINDOW_1L)?.flowers).to.deep.eq([Flower.RED])
  })

  it('removeWindowState-onlyEntry', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_1R, [Flower.YELLOW, Flower.PURPLE], [])

    dw.removeWindowState(WindowSelection.WINDOW_1R)

    expect(dw.windowStates.length).to.eq(0)
  })

  it('addDelivery', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_2L, [Flower.RED, Flower.BLUE], [Player.BOT])

    dw.addDelivery(WindowSelection.WINDOW_2L, Player.PLAYER)

    expect(dw.getWindowState(WindowSelection.WINDOW_2L)?.deliveries).to.deep.eq([Player.BOT, Player.PLAYER])
  })

  it('addDelivery-multiple', () => {
    const dw = WindowStates.new()
    dw.setWindowState(WindowSelection.WINDOW_3R, [Flower.PURPLE, Flower.ORANGE, Flower.YELLOW], [])

    dw.addDelivery(WindowSelection.WINDOW_3R, Player.PLAYER)
    dw.addDelivery(WindowSelection.WINDOW_3R, Player.BOT)
    dw.addDelivery(WindowSelection.WINDOW_3R, Player.PLAYER)

    expect(dw.getWindowState(WindowSelection.WINDOW_3R)?.deliveries).to.deep.eq([Player.PLAYER, Player.BOT, Player.PLAYER])
  })

  it('addDelivery-nonExisting', () => {
    const dw = WindowStates.new()

    expect(() => dw.addDelivery(WindowSelection.WINDOW_1L, Player.PLAYER)).to.throw('Window state for 1L not found.')
  })
})
