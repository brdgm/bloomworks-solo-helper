import getSellFlowerRevenue from '@/util/getSellFlowerRevenue'
import { expect } from 'chai'

describe('util/getSellFlowerRevenue', () => {
  it('sell 1 flower at price 5', () => {
    // 5 - 1 = 4
    expect(getSellFlowerRevenue(5, 1)).to.eq(4)
  })

  it('sell 2 flowers at price 5', () => {
    // 4 + 3 = 7
    expect(getSellFlowerRevenue(5, 2)).to.eq(7)
  })

  it('sell 3 flowers at price 5', () => {
    // 4 + 3 + 2 = 9
    expect(getSellFlowerRevenue(5, 3)).to.eq(9)
  })

  it('sell 1 flower at price 10', () => {
    // 10 - 1 = 9
    expect(getSellFlowerRevenue(10, 1)).to.eq(9)
  })

  it('revenue floored at 1', () => {
    // price 2: sell 1 => 1, sell 2 => 1 (floored)
    expect(getSellFlowerRevenue(2, 2)).to.eq(2)
  })

  it('revenue floored at 1 for multiple flowers', () => {
    // price 3: 2 + 1 + 1 + 1 = 5
    expect(getSellFlowerRevenue(3, 4)).to.eq(5)
  })

  it('sell at price 1', () => {
    // price 1: each flower sells at max(0, 1) = 1
    // Actually: max(1 - 1 - 0, 1) = max(0, 1) = 1
    // max(1 - 1 - 1, 1) = max(-1, 1) = 1
    expect(getSellFlowerRevenue(1, 3)).to.eq(3)
  })

  it('sell 0 flowers', () => {
    expect(getSellFlowerRevenue(5, 0)).to.eq(0)
  })
})
