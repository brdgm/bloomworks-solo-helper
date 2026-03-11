import MarketPrices from '@/services/MarketPrices'
import Flower from '@/services/enum/Flower'
import { expect } from 'chai'
import mockMarketPrices from '../helper/mockMarketPrices'

describe('services/MarketPrices', () => {
  it('new', () => {
    const marketPrices = MarketPrices.new()

    expect(marketPrices.prices.length).to.eq(5)
    marketPrices.prices.forEach(item => {
      expect(item.price, `initial price for ${item.flower}`).to.eq(MarketPrices.STARTING_PRICE)
      expect(item.priceSell, `initial sell price for ${item.flower}`).to.eq(MarketPrices.STARTING_PRICE - 1)
    })
  })

  it('new - contains all flowers', () => {
    const marketPrices = MarketPrices.new()

    const flowers = marketPrices.flowerOrder
    expect(flowers).to.include.members([Flower.RED, Flower.PURPLE, Flower.YELLOW, Flower.BLUE, Flower.ORANGE])
  })

  it('flowerOrder', () => {
    const marketPrices = MarketPrices.fromPersistence([
      { flower: Flower.ORANGE, price: 4 },
      { flower: Flower.BLUE, price: 4 },
      { flower: Flower.RED, price: 4 },
      { flower: Flower.YELLOW, price: 4 },
      { flower: Flower.PURPLE, price: 4 },
    ])

    expect(marketPrices.flowerOrder).to.eql([
      Flower.ORANGE, Flower.BLUE, Flower.RED, Flower.YELLOW, Flower.PURPLE
    ])
  })

  it('getPrice', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 5 },
      { flower: Flower.PURPLE, price: 3 },
      { flower: Flower.YELLOW, price: 7 },
    ]))

    expect(marketPrices.getPrice(Flower.RED)).to.eq(5)
    expect(marketPrices.getPrice(Flower.PURPLE)).to.eq(3)
    expect(marketPrices.getPrice(Flower.YELLOW)).to.eq(7)
  })

  it('setPrice', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    marketPrices.setPrice(Flower.RED, 7)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(7)
  })

  it('setPrice - capped at max', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    marketPrices.setPrice(Flower.RED, 15)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(MarketPrices.MAX_PRICE)
  })

  it('setPrice - capped at min', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    marketPrices.setPrice(Flower.RED, -3)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(MarketPrices.MIN_PRICE)
  })

  it('priceSell - one less than price', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 6 },
      { flower: Flower.PURPLE, price: 3 },
    ]))

    const red = marketPrices.prices.find(p => p.flower === Flower.RED)!
    expect(red.priceSell).to.eq(5)
    const purple = marketPrices.prices.find(p => p.flower === Flower.PURPLE)!
    expect(purple.priceSell).to.eq(2)
  })

  it('priceSell - capped at min', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: MarketPrices.MIN_PRICE },
    ]))

    const red = marketPrices.prices.find(p => p.flower === Flower.RED)!
    expect(red.priceSell).to.eq(MarketPrices.MIN_PRICE)
  })

  it('getMostExpensiveFlower', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 5 },
      { flower: Flower.PURPLE, price: 8 },
      { flower: Flower.YELLOW, price: 3 },
    ]))

    expect(marketPrices.getMostExpensiveFlower()).to.eq(Flower.PURPLE)
  })

  it('getMostExpensiveFlower - tied, first in order wins', () => {
    const marketPrices = MarketPrices.fromPersistence([
      { flower: Flower.ORANGE, price: 6 },
      { flower: Flower.BLUE, price: 6 },
      { flower: Flower.RED, price: 4 },
      { flower: Flower.YELLOW, price: 6 },
      { flower: Flower.PURPLE, price: 4 },
    ])

    expect(marketPrices.getMostExpensiveFlower()).to.eq(Flower.ORANGE)
  })

  it('increase', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 5 },
    ]))

    marketPrices.increase(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(6)
  })

  it('increase - capped at max', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: MarketPrices.MAX_PRICE },
    ]))

    marketPrices.increase(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(MarketPrices.MAX_PRICE)
  })

  it('decrease', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 5 },
    ]))

    marketPrices.decrease(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(4)
  })

  it('decrease - capped at min', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: MarketPrices.MIN_PRICE },
    ]))

    marketPrices.decrease(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(MarketPrices.MIN_PRICE)
  })

  it('toPersistence/fromPersistence', () => {
    const marketPrices = MarketPrices.new()
    marketPrices.setPrice(Flower.RED, marketPrices.getPrice(Flower.RED) + 1)
    marketPrices.setPrice(Flower.BLUE, marketPrices.getPrice(Flower.BLUE) - 1)

    const restored = MarketPrices.fromPersistence(marketPrices.toPersistence())
    expect(restored.getPrice(Flower.RED)).to.eq(marketPrices.getPrice(Flower.RED))
    expect(restored.getPrice(Flower.BLUE)).to.eq(marketPrices.getPrice(Flower.BLUE))
    expect(restored.flowerOrder).to.eql(marketPrices.flowerOrder)
  })
})
