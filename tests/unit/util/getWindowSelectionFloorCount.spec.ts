import WindowSelection from '@/services/enum/WindowSelection'
import getWindowSelectionFloorCount from '@/util/getWindowSelectionFloorCount'
import { expect } from 'chai'

describe('util/getWindowSelectionFloorCount', () => {
  it('WINDOW_1L', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_1L)).to.eq(1)
  })

  it('WINDOW_1R', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_1R)).to.eq(1)
  })

  it('WINDOW_2L', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_2L)).to.eq(2)
  })

  it('WINDOW_2R', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_2R)).to.eq(2)
  })

  it('WINDOW_3L', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_3L)).to.eq(3)
  })

  it('WINDOW_3R', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_3R)).to.eq(3)
  })

  it('WINDOW_4L', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_4L)).to.eq(4)
  })

  it('WINDOW_4R', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_4R)).to.eq(4)
  })

  it('WINDOW_5', () => {
    expect(getWindowSelectionFloorCount(WindowSelection.WINDOW_5)).to.eq(5)
  })
})
