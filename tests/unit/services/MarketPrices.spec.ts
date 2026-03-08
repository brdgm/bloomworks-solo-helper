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

  it('increasePrice', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    marketPrices.increasePrice(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(5)
  })

  it('increasePrice - capped at max', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: MarketPrices.MAX_PRICE },
    ]))

    marketPrices.increasePrice(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(MarketPrices.MAX_PRICE)
  })

  it('decreasePrice', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    marketPrices.decreasePrice(Flower.RED)
    expect(marketPrices.getPrice(Flower.RED)).to.eq(3)
  })

  it('decreasePrice - capped at min', () => {
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: MarketPrices.MIN_PRICE },
    ]))

    marketPrices.decreasePrice(Flower.RED)
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

  it('toPersistence/fromPersistence', () => {
    const marketPrices = MarketPrices.new()
    marketPrices.increasePrice(Flower.RED)
    marketPrices.decreasePrice(Flower.BLUE)

    const restored = MarketPrices.fromPersistence(marketPrices.toPersistence())
    expect(restored.getPrice(Flower.RED)).to.eq(marketPrices.getPrice(Flower.RED))
    expect(restored.getPrice(Flower.BLUE)).to.eq(marketPrices.getPrice(Flower.BLUE))
    expect(restored.flowerOrder).to.eql(marketPrices.flowerOrder)
  })
})
