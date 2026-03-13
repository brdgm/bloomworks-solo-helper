import WindowStates from '@/services/WindowStates'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'

const INITIAL_WINDOW_5 = { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] }

describe('services/WindowStates', () => {
  it('new', () => {
    const dw = WindowStates.new()
    expect(dw.windowStates).to.deep.eq([INITIAL_WINDOW_5])
  })

  it('setWindowState-new', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [])

    expect(dw.getWindowState(1, WindowSelection.LEFT)).to.deep.eq({ floor: 1, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] })
    expect(dw.windowStates.length).to.eq(2)
  })

  it('setWindowState-update', () => {
    const dw = WindowStates.new()
    dw.setWindowState(2, WindowSelection.RIGHT, [Flower.PURPLE], [])
    dw.setWindowState(2, WindowSelection.RIGHT, [Flower.YELLOW, Flower.ORANGE], [Player.PLAYER])

    expect(dw.getWindowState(2, WindowSelection.RIGHT)).to.deep.eq({ floor: 2, windowSelection: WindowSelection.RIGHT, flowers: [Flower.YELLOW, Flower.ORANGE], deliveries: [Player.PLAYER] })
    expect(dw.windowStates.length).to.eq(2)
  })

  it('getWindowState-undefined', () => {
    const dw = WindowStates.new()
    expect(dw.getWindowState(3, WindowSelection.LEFT)).to.be.undefined
  })

  it('toPersistence', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.LEFT, [Flower.RED], [])
    dw.setWindowState(3, WindowSelection.RIGHT, [Flower.BLUE, Flower.PURPLE], [Player.PLAYER, Player.BOT])

    const persistence = dw.toPersistence()
    expect(persistence).to.deep.eq([
      INITIAL_WINDOW_5,
      { floor: 3, windowSelection: WindowSelection.RIGHT, flowers: [Flower.BLUE, Flower.PURPLE], deliveries: [Player.PLAYER, Player.BOT] },
      { floor: 1, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED], deliveries: [] }
    ])

    // verify it's a deep clone
    persistence[1].flowers.push(Flower.ORANGE)
    expect(dw.getWindowState(1, WindowSelection.LEFT)?.flowers).to.deep.eq([Flower.RED])
  })

  it('fromPersistence', () => {
    const persistence = [
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.YELLOW], deliveries: [Player.PLAYER] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.ORANGE], deliveries: [Player.BOT] }
    ]

    const dw = WindowStates.fromPersistence(persistence)
    expect(dw.getWindowState(2, WindowSelection.LEFT)).to.deep.eq({ floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.YELLOW], deliveries: [Player.PLAYER] })
    expect(dw.getWindowState(3, WindowSelection.LEFT)).to.deep.eq({ floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.ORANGE], deliveries: [Player.BOT] })
    expect(dw.windowStates.length).to.eq(2)

    // verify it's a deep clone from source
    persistence[0].flowers.push(Flower.BLUE)
    expect(dw.getWindowState(2, WindowSelection.LEFT)?.flowers).to.deep.eq([Flower.YELLOW])
  })

  it('removeWindowState', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [])
    dw.setWindowState(2, WindowSelection.LEFT, [Flower.YELLOW], [Player.PLAYER])
    dw.setWindowState(3, WindowSelection.RIGHT, [Flower.PURPLE, Flower.ORANGE], [Player.BOT])

    dw.removeWindowState(2, WindowSelection.LEFT)

    expect(dw.windowStates.length).to.eq(3)
    expect(dw.getWindowState(1, WindowSelection.LEFT)?.flowers).to.deep.eq([Flower.RED, Flower.BLUE])
    expect(dw.getWindowState(2, WindowSelection.LEFT)).to.be.undefined
    expect(dw.getWindowState(3, WindowSelection.RIGHT)?.flowers).to.deep.eq([Flower.PURPLE, Flower.ORANGE])
  })

  it('removeWindowState-nonExisting', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.LEFT, [Flower.RED], [])

    dw.removeWindowState(2, WindowSelection.RIGHT)

    expect(dw.windowStates.length).to.eq(2)
    expect(dw.getWindowState(1, WindowSelection.LEFT)?.flowers).to.deep.eq([Flower.RED])
  })

  it('removeWindowState-onlyEntry', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.RIGHT, [Flower.YELLOW, Flower.PURPLE], [])

    dw.removeWindowState(1, WindowSelection.RIGHT)

    expect(dw.windowStates.length).to.eq(1)
  })

  it('addDelivery', () => {
    const dw = WindowStates.new()
    dw.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [Player.BOT])

    dw.addDelivery(2, WindowSelection.LEFT, Player.PLAYER)

    expect(dw.getWindowState(2, WindowSelection.LEFT)?.deliveries).to.deep.eq([Player.BOT, Player.PLAYER])
  })

  it('addDelivery-multiple', () => {
    const dw = WindowStates.new()
    dw.setWindowState(3, WindowSelection.RIGHT, [Flower.PURPLE, Flower.ORANGE, Flower.YELLOW], [])

    dw.addDelivery(3, WindowSelection.RIGHT, Player.PLAYER)
    dw.addDelivery(3, WindowSelection.RIGHT, Player.BOT)
    dw.addDelivery(3, WindowSelection.RIGHT, Player.PLAYER)

    expect(dw.getWindowState(3, WindowSelection.RIGHT)?.deliveries).to.deep.eq([Player.PLAYER, Player.BOT, Player.PLAYER])
  })

  it('addDelivery-nonExisting', () => {
    const dw = WindowStates.new()

    expect(() => dw.addDelivery(1, WindowSelection.LEFT, Player.PLAYER)).to.throw('Window state for floor 1 and l not found.')
  })

  it('sorted-by-floor-desc-and-left-first', () => {
    const dw = WindowStates.new()
    dw.setWindowState(1, WindowSelection.RIGHT, [Flower.RED], [])
    dw.setWindowState(3, WindowSelection.LEFT, [Flower.BLUE], [])
    dw.setWindowState(3, WindowSelection.RIGHT, [Flower.YELLOW], [])
    dw.setWindowState(1, WindowSelection.LEFT, [Flower.PURPLE], [])
    dw.setWindowState(2, WindowSelection.LEFT, [Flower.ORANGE], [])

    const states = dw.windowStates
    expect(states.map(s => `${s.floor}${s.windowSelection}`)).to.deep.eq(['5l', '3l', '3r', '2l', '1l', '1r'])
  })

  it('fromPersistence-sorted', () => {
    const persistence = [
      { floor: 1, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED], deliveries: [] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.BLUE], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.YELLOW], deliveries: [] }
    ]

    const dw = WindowStates.fromPersistence(persistence)
    expect(dw.windowStates.map(s => `${s.floor}${s.windowSelection}`)).to.deep.eq(['3l', '2l', '1r'])
  })
})
