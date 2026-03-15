import getDistinctFlowers from '@/util/getDistinctFlowers'
import Flower from '@/services/enum/Flower'
import { expect } from 'chai'

describe('util/getDistinctFlowers', () => {
  it('empty array', () => {
    expect(getDistinctFlowers([])).to.eql([])
  })

  it('single flower', () => {
    expect(getDistinctFlowers([Flower.ORANGE])).to.eql([Flower.ORANGE])
  })

  it('no duplicates', () => {
    expect(getDistinctFlowers([Flower.ORANGE, Flower.BLUE, Flower.YELLOW]))
      .to.eql([Flower.ORANGE, Flower.BLUE, Flower.YELLOW])
  })

  it('removes duplicates', () => {
    expect(getDistinctFlowers([Flower.ORANGE, Flower.BLUE, Flower.ORANGE, Flower.BLUE, Flower.YELLOW]))
      .to.eql([Flower.ORANGE, Flower.BLUE, Flower.YELLOW])
  })

  it('all same flower', () => {
    expect(getDistinctFlowers([Flower.RED, Flower.RED, Flower.RED]))
      .to.eql([Flower.RED])
  })
})
