import getBuyFlowerCost from '@/util/getBuyFlowerCost'
import { expect } from 'chai'

describe('util/getBuyFlowerCost', () => {
  it('buy 1 flower at price 5', () => {
    expect(getBuyFlowerCost(5, 1)).to.eq(5)
  })

  it('buy 2 flowers at price 5', () => {
    // 5 + 6 = 11
    expect(getBuyFlowerCost(5, 2)).to.eq(11)
  })

  it('buy 3 flowers at price 5', () => {
    // 5 + 6 + 7 = 18
    expect(getBuyFlowerCost(5, 3)).to.eq(18)
  })

  it('buy 1 flower at price 1', () => {
    expect(getBuyFlowerCost(1, 1)).to.eq(1)
  })

  it('price capped at 12', () => {
    // price 11: 11 + 12 = 23
    expect(getBuyFlowerCost(11, 2)).to.eq(23)
  })

  it('price capped at 12 for multiple flowers', () => {
    // price 10: 10 + 11 + 12 + 12 = 45
    expect(getBuyFlowerCost(10, 4)).to.eq(45)
  })

  it('buy at price 12', () => {
    // 12 + 12 + 12 = 36
    expect(getBuyFlowerCost(12, 3)).to.eq(36)
  })

  it('buy 0 flowers', () => {
    expect(getBuyFlowerCost(5, 0)).to.eq(0)
  })
})
