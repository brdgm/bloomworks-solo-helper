import getFlowerMatchCount from '@/util/getFlowerMatchCount'
import Flower from '@/services/enum/Flower'
import { expect } from 'chai'

describe('util/getFlowerMatchCount', () => {
  it('no flowers', () => {
    expect(getFlowerMatchCount([], [])).to.eq(0)
  })

  it('no match', () => {
    expect(getFlowerMatchCount([Flower.ORANGE], [Flower.BLUE])).to.eq(0)
  })

  it('single match', () => {
    expect(getFlowerMatchCount([Flower.ORANGE], [Flower.ORANGE])).to.eq(1)
  })

  it('multiple matches', () => {
    expect(getFlowerMatchCount(
      [Flower.ORANGE, Flower.BLUE, Flower.YELLOW],
      [Flower.BLUE, Flower.ORANGE, Flower.RED]
    )).to.eq(2)
  })

  it('duplicate flowers matched only once', () => {
    expect(getFlowerMatchCount(
      [Flower.ORANGE, Flower.ORANGE],
      [Flower.ORANGE]
    )).to.eq(1)
  })

  it('duplicate flowers in both lists', () => {
    expect(getFlowerMatchCount(
      [Flower.ORANGE, Flower.ORANGE],
      [Flower.ORANGE, Flower.ORANGE]
    )).to.eq(2)
  })

  it('flowers longer than flowersToMatch', () => {
    expect(getFlowerMatchCount(
      [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE],
      [Flower.BLUE, Flower.PURPLE]
    )).to.eq(2)
  })

  it('flowersToMatch longer than flowers', () => {
    expect(getFlowerMatchCount(
      [Flower.ORANGE],
      [Flower.ORANGE, Flower.BLUE, Flower.YELLOW]
    )).to.eq(1)
  })
})
