import Season from '@/services/enum/Season'
import getNextSeason from '@/util/getNextSeason'
import { expect } from 'chai'

describe('util/getNextSeason', () => {
  it('SPRING -> SUMMER', () => {
    expect(getNextSeason(Season.SPRING)).to.eq(Season.SUMMER)
  })

  it('SUMMER -> AUTUMN', () => {
    expect(getNextSeason(Season.SUMMER)).to.eq(Season.AUTUMN)
  })

  it('AUTUMN -> WINTER', () => {
    expect(getNextSeason(Season.AUTUMN)).to.eq(Season.WINTER)
  })

  it('WINTER -> SPRING', () => {
    expect(getNextSeason(Season.WINTER)).to.eq(Season.SPRING)
  })
})
