import DefinedWindows from '@/services/DefinedWindows'
import Flower from '@/services/enum/Flower'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'

describe('services/DefinedWindows', () => {
  it('new', () => {
    const dw = DefinedWindows.new()
    expect(dw.definedWindows).to.deep.eq([])
  })

  it('setDefinedWindow-new', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_1L, [Flower.RED, Flower.BLUE])

    expect(dw.getDefinedWindow(WindowSelection.WINDOW_1L)).to.deep.eq([Flower.RED, Flower.BLUE])
    expect(dw.definedWindows.length).to.eq(1)
  })

  it('setDefinedWindow-update', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_2R, [Flower.PURPLE])
    dw.setDefinedWindow(WindowSelection.WINDOW_2R, [Flower.YELLOW, Flower.ORANGE])

    expect(dw.getDefinedWindow(WindowSelection.WINDOW_2R)).to.deep.eq([Flower.YELLOW, Flower.ORANGE])
    expect(dw.definedWindows.length).to.eq(1)
  })

  it('getDefinedWindow-undefined', () => {
    const dw = DefinedWindows.new()
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_3L)).to.be.undefined
  })

  it('toPersistence', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_1L, [Flower.RED])
    dw.setDefinedWindow(WindowSelection.WINDOW_3R, [Flower.BLUE, Flower.PURPLE])

    const persistence = dw.toPersistence()
    expect(persistence).to.deep.eq([
      { windowSelection: WindowSelection.WINDOW_1L, flowers: [Flower.RED] },
      { windowSelection: WindowSelection.WINDOW_3R, flowers: [Flower.BLUE, Flower.PURPLE] }
    ])

    // verify it's a deep clone
    persistence[0].flowers.push(Flower.ORANGE)
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_1L)).to.deep.eq([Flower.RED])
  })

  it('fromPersistence', () => {
    const persistence = [
      { windowSelection: WindowSelection.WINDOW_2L, flowers: [Flower.YELLOW] },
      { windowSelection: WindowSelection.WINDOW_3L, flowers: [Flower.RED, Flower.ORANGE] }
    ]

    const dw = DefinedWindows.fromPersistence(persistence)
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_2L)).to.deep.eq([Flower.YELLOW])
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_3L)).to.deep.eq([Flower.RED, Flower.ORANGE])
    expect(dw.definedWindows.length).to.eq(2)

    // verify it's a deep clone from source
    persistence[0].flowers.push(Flower.BLUE)
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_2L)).to.deep.eq([Flower.YELLOW])
  })

  it('removeDefinedWindow', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_1L, [Flower.RED, Flower.BLUE])
    dw.setDefinedWindow(WindowSelection.WINDOW_2L, [Flower.YELLOW])
    dw.setDefinedWindow(WindowSelection.WINDOW_3R, [Flower.PURPLE, Flower.ORANGE])

    dw.removeDefinedWindow(WindowSelection.WINDOW_2L)

    expect(dw.definedWindows.length).to.eq(2)
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_1L)).to.deep.eq([Flower.RED, Flower.BLUE])
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_2L)).to.be.undefined
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_3R)).to.deep.eq([Flower.PURPLE, Flower.ORANGE])
  })

  it('removeDefinedWindow-nonExisting', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_1L, [Flower.RED])

    dw.removeDefinedWindow(WindowSelection.WINDOW_2R)

    expect(dw.definedWindows.length).to.eq(1)
    expect(dw.getDefinedWindow(WindowSelection.WINDOW_1L)).to.deep.eq([Flower.RED])
  })

  it('removeDefinedWindow-onlyEntry', () => {
    const dw = DefinedWindows.new()
    dw.setDefinedWindow(WindowSelection.WINDOW_1R, [Flower.YELLOW, Flower.PURPLE])

    dw.removeDefinedWindow(WindowSelection.WINDOW_1R)

    expect(dw.definedWindows.length).to.eq(0)
  })
})
