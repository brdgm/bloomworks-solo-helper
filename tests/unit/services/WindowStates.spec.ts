import WindowStates from '@/services/WindowStates'
import MarketPrices from '@/services/MarketPrices'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'
import mockMarketPrices from '../helper/mockMarketPrices'

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

  it('getBestMatchingDeliveryWindow-highestMatchCount', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.YELLOW, Flower.PURPLE], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] }
    ])

    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-tieBreaker-fewestMissing', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] }
    ])

    // both match 2, but floor 2 has 0 missing flowers vs floor 3 has 1 missing
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-skipsFullyDelivered', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [Player.PLAYER, Player.BOT, Player.PLAYER, Player.BOT] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.YELLOW], deliveries: [] }
    ])

    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(2)
  })

  it('getBestMatchingDeliveryWindow-noWindowsAvailable', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [Player.PLAYER, Player.BOT, Player.PLAYER, Player.BOT] }
    ])

    const result = dw.getBestMatchingDeliveryWindow([Flower.RED])

    expect(result).to.be.undefined
  })

  it('getBestMatchingDeliveryWindow-duplicateFlowers', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.RED, Flower.BLUE], deliveries: [] },
      { floor: 3, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [] }
    ])

    // only one RED available, so both windows match 1 flower
    // both have 2 missing → same tie, falls to original order (left first)
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED])

    expect(result?.floor).to.eq(3)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-duplicateFlowersToMatch', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.RED, Flower.BLUE], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] }
    ])

    // two REDs available: floor 3 matches 2, floor 2 matches 1
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.RED])

    expect(result?.floor).to.eq(3)
  })

  it('getBestMatchingDeliveryWindow-noMatchingFlowers', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.ORANGE], deliveries: [] }
    ])

    // no matching flowers at all → match count 0 for both, tie-breaker: floor 2 has 2 missing, floor 3 has 3 missing
    const result = dw.getBestMatchingDeliveryWindow([Flower.PURPLE])

    expect(result?.floor).to.eq(2)
  })

  it('getBestMatchingDeliveryWindow-partiallyDelivered', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [Player.PLAYER, Player.BOT, Player.PLAYER] },
      { floor: 3, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE], deliveries: [Player.PLAYER] }
    ])

    // both match 2, both have 1 missing → same sort key
    // left comes first in original ordering, so it should be returned
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(3)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-skips5thFloorWithSingleFlower', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] }
    ])

    // only 1 flower → 5th floor should be skipped, picks floor 2
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED])

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-allows5thFloorWithTwoFlowers', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] }
    ])

    // 2 flowers → 5th floor is allowed, both match 2, floor 2 has 0 missing vs floor 5 has 3 missing → floor 2 wins
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingDeliveryWindow-skips5thFloorWithSingleFlower-noOtherWindows', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] }
    ])

    // only 1 flower and only 5th floor available → no match
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED])

    expect(result).to.be.undefined
  })

  it('getBestMatchingDeliveryWindow-allows5thFloorWithTwoFlowers-only5thFloor', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] }
    ])

    // 2 flowers and only 5th floor → 5th floor is allowed
    const result = dw.getBestMatchingDeliveryWindow([Flower.RED, Flower.BLUE])

    expect(result?.floor).to.eq(5)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingUndefinedWindow-picksHighestUndefined', () => {
    // only floor 5 left is defined, all others undefined
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // 4 flowers → picks floor 4 left (highest undefined floor that fits)
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], marketPrices)

    expect(result?.floor).to.eq(4)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
    expect(result?.flowers).to.have.length(4)
  })

  it('getBestMatchingUndefinedWindow-skipsLargerFloors', () => {
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // only 2 flowers → can't fit floor 4 or 3, picks floor 2 left
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE], marketPrices)

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.BLUE])
  })

  it('getBestMatchingUndefinedWindow-skipsDefinedWindows', () => {
    const dw = WindowStates.new()
    dw.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], [])
    dw.setWindowState(4, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.PURPLE], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // 4 flowers but floor 4 both taken → picks floor 3 left
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
    expect(result?.flowers).to.have.length(3)
  })

  it('getBestMatchingUndefinedWindow-prioritizesExpensiveFlowers', () => {
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.ORANGE, price: 2 },
      { flower: Flower.BLUE, price: 8 },
      { flower: Flower.YELLOW, price: 5 },
      { flower: Flower.PURPLE, price: 3 },
      { flower: Flower.RED, price: 10 }
    ]))

    // 4 flowers for a floor-2 window → takes the 2 most expensive (RED=10, BLUE=8)
    const result = dw.getBestMatchingUndefinedWindow([Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.RED], marketPrices)

    expect(result?.floor).to.eq(4)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE])
  })

  it('getBestMatchingUndefinedWindow-selectsFlowersForSmallerWindow', () => {
    const dw = WindowStates.new()
    dw.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], [])
    dw.setWindowState(4, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.PURPLE], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.ORANGE, price: 2 },
      { flower: Flower.BLUE, price: 8 },
      { flower: Flower.YELLOW, price: 5 },
      { flower: Flower.PURPLE, price: 3 },
      { flower: Flower.RED, price: 10 }
    ]))

    // 4 flowers, floor 4 both taken → floor 3 picked, takes top 3 by price: RED=10, BLUE=8, YELLOW=5
    const result = dw.getBestMatchingUndefinedWindow([Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.RED], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.BLUE, Flower.YELLOW])
  })

  it('getBestMatchingUndefinedWindow-noUndefinedLeft', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED], deliveries: [] },
      { floor: 4, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], deliveries: [] },
      { floor: 4, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.PURPLE], deliveries: [] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [] },
      { floor: 3, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [] },
      { floor: 2, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED, Flower.YELLOW], deliveries: [] },
      { floor: 1, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED], deliveries: [] },
      { floor: 1, windowSelection: WindowSelection.RIGHT, flowers: [Flower.BLUE], deliveries: [] }
    ])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE], marketPrices)

    expect(result).to.be.undefined
  })

  it('getBestMatchingUndefinedWindow-tooFewFlowers', () => {
    // all windows undefined except floor 5 → but only 0 flowers given (empty)
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    const result = dw.getBestMatchingUndefinedWindow([], marketPrices)

    expect(result).to.be.undefined
  })

  it('getBestMatchingUndefinedWindow-prefersLeftOverRight', () => {
    const dw = WindowStates.new()
    dw.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // floor 4 left is taken with different flowers, so floor 4 right should be picked
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.WHITE], marketPrices)

    expect(result?.floor).to.eq(4)
    expect(result?.windowSelection).to.eq(WindowSelection.RIGHT)
  })

  it('getBestMatchingUndefinedWindow-duplicateFlowers-samePrices', () => {
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // 3 flowers with duplicates, all same price → floor 3 picked, keeps first 3 in sorted order
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.RED, Flower.BLUE], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.RED, Flower.BLUE])
  })

  it('getBestMatchingUndefinedWindow-duplicateFlowers-differentPrices', () => {
    const dw = WindowStates.new()
    dw.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], [])
    dw.setWindowState(4, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.PURPLE], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices([
      { flower: Flower.RED, price: 10 },
      { flower: Flower.BLUE, price: 3 }
    ]))

    // 4 flowers with duplicates, floor 4 taken → floor 3, top 3 by price: RED=10, RED=10, BLUE=3
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.RED, Flower.BLUE])
  })

  it('getBestMatchingUndefinedWindow-allDuplicateFlowers', () => {
    const dw = WindowStates.new()
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // 2 identical flowers → floor 2 picked
    const result = dw.getBestMatchingUndefinedWindow([Flower.YELLOW, Flower.YELLOW], marketPrices)

    expect(result?.floor).to.eq(2)
    expect(result?.flowers).to.deep.eq([Flower.YELLOW, Flower.YELLOW])
  })

  it('getBestMatchingUndefinedWindow-skipsSiblingWithSameFlowers', () => {
    const dw = WindowStates.new()
    dw.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // floor 4 right is undefined, but chosen flowers would match the left sibling → skip to floor 3
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.YELLOW, Flower.ORANGE], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
    expect(result?.flowers).to.have.length(3)
  })

  it('getBestMatchingUndefinedWindow-skipsSiblingWithSameFlowersDifferentOrder', () => {
    const dw = WindowStates.new()
    dw.setWindowState(3, WindowSelection.LEFT, [Flower.BLUE, Flower.RED, Flower.YELLOW], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // floor 3 right is undefined, but chosen flowers [RED, BLUE, YELLOW] match left sibling [BLUE, RED, YELLOW] regardless of order → skip
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.YELLOW], marketPrices)

    expect(result?.floor).to.eq(2)
    expect(result?.windowSelection).to.eq(WindowSelection.LEFT)
  })

  it('getBestMatchingUndefinedWindow-allowsSiblingWithDifferentFlowers', () => {
    const dw = WindowStates.new()
    dw.setWindowState(3, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.YELLOW], [])
    const marketPrices = MarketPrices.fromPersistence(mockMarketPrices())

    // floor 3 right is undefined, chosen flowers differ from sibling → allowed
    const result = dw.getBestMatchingUndefinedWindow([Flower.RED, Flower.BLUE, Flower.ORANGE], marketPrices)

    expect(result?.floor).to.eq(3)
    expect(result?.windowSelection).to.eq(WindowSelection.RIGHT)
    expect(result?.flowers).to.deep.eq([Flower.RED, Flower.BLUE, Flower.ORANGE])
  })

  it('getTotalDeliveriesByPlayer-noDeliveries', () => {
    const dw = WindowStates.new()
    dw.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [])

    expect(dw.getTotalDeliveriesByPlayer(Player.PLAYER)).to.eq(0)
    expect(dw.getTotalDeliveriesByPlayer(Player.BOT)).to.eq(0)
  })

  it('getTotalDeliveriesByPlayer-singleWindow', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [Player.PLAYER, Player.BOT, Player.PLAYER] }
    ])

    expect(dw.getTotalDeliveriesByPlayer(Player.PLAYER)).to.eq(2)
    expect(dw.getTotalDeliveriesByPlayer(Player.BOT)).to.eq(1)
  })

  it('getTotalDeliveriesByPlayer-multipleWindows', () => {
    const dw = WindowStates.fromPersistence([
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE, Flower.YELLOW], deliveries: [Player.PLAYER, Player.BOT] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [Flower.RED, Flower.BLUE], deliveries: [Player.BOT, Player.BOT] },
      { floor: 1, windowSelection: WindowSelection.RIGHT, flowers: [Flower.RED], deliveries: [Player.PLAYER] }
    ])

    expect(dw.getTotalDeliveriesByPlayer(Player.PLAYER)).to.eq(2)
    expect(dw.getTotalDeliveriesByPlayer(Player.BOT)).to.eq(3)
  })

  it('getTotalDeliveriesByPlayer-emptyState', () => {
    const dw = WindowStates.fromPersistence([])

    expect(dw.getTotalDeliveriesByPlayer(Player.PLAYER)).to.eq(0)
    expect(dw.getTotalDeliveriesByPlayer(Player.BOT)).to.eq(0)
  })
})
