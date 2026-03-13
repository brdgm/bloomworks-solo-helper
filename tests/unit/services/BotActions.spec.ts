import BotActions from '@/services/BotActions'
import WindowStates from '@/services/WindowStates'
import Action from '@/services/enum/Action'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import Season from '@/services/enum/Season'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'
import mockBotGarden from '../helper/mockBotGarden'
import mockCardDeck from '../helper/mockCardDeck'
import mockNavigationState from '../helper/mockNavigationState'

describe('services/BotActions', () => {

  describe('PLANT action', () => {
    it('plants most expensive flower and decreases its price', () => {
      const cardDeck = mockCardDeck({ pile: ['plant-1'] })
      cardDeck.draw()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 7 },
          { flower: Flower.PURPLE, price: 5 },
        ],
        season: Season.AUTUMN,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.PLANT)
      expect(action.flower).to.eq(Flower.RED)
      // price decreased by 1
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(6)
    })
  })

  describe('SOLD action', () => {
    it('decreases price for each distinct flower in current season', () => {
      const cardDeck = mockCardDeck({ pile: ['sold-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED] }
        ]
      })
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 6 },
          { flower: Flower.BLUE, price: 5 },
        ],
        season: Season.AUTUMN,
        garden,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      expect(botActions.actions[0].action).to.eq(Action.SOLD)
      // RED and BLUE each decreased by 1 (RED appears twice but only counted once)
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(5)
      expect(navigationState.marketPrices.getPrice(Flower.BLUE)).to.eq(4)
    })

    it('no flowers in current season - no price changes', () => {
      const cardDeck = mockCardDeck({ pile: ['sold-1'] })
      cardDeck.draw()
      const garden = mockBotGarden()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 6 },
        ],
        season: Season.AUTUMN,
        garden,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions[0].action).to.eq(Action.SOLD)
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(6)
    })
  })

  describe('PAID action', () => {
    it('no flowers in current season - no VP', () => {
      const cardDeck = mockCardDeck({ pile: ['adv-paid'] })
      cardDeck.draw()
      const garden = mockBotGarden()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 6 },
        ],
        season: Season.AUTUMN,
        garden,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.PAID)
      expect(action.vp).to.be.undefined
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(6)
    })

    it('decreases price of most expensive flower in current season and sets VP', () => {
      const cardDeck = mockCardDeck({ pile: ['adv-paid'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.PURPLE] }
        ]
      })
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 8 },
          { flower: Flower.PURPLE, price: 5 },
        ],
        season: Season.AUTUMN,
        garden,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.PAID)
      // RED was most expensive, price decreased from 8 to 7
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(7)
      // VP equals the price after decrease
      expect(action.vp).to.eq(7)
    })
  })

  describe('PRICE action', () => {
    it('increases price for each flower in defined window', () => {
      const cardDeck = mockCardDeck({ pile: ['price-1'] })
      cardDeck.draw()
      const windowStates = WindowStates.new()
      windowStates.setWindowState(3, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE], [])
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 4 },
          { flower: Flower.BLUE, price: 3 },
        ],
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      expect(botActions.actions[0].action).to.eq(Action.PRICE)
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(5)
      expect(navigationState.marketPrices.getPrice(Flower.BLUE)).to.eq(4)
    })

    it('window not yet defined - falls back to most expensive flower', () => {
      const cardDeck = mockCardDeck({ pile: ['price-1'] })
      cardDeck.draw()
      const windowStates = WindowStates.new()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 3 },
          { flower: Flower.BLUE, price: 6 },
        ],
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions[0].action).to.eq(Action.PRICE)
      expect(botActions.actions[0].flowers).to.eql([Flower.BLUE])
      // BLUE was most expensive, increased from 6 to 7
      expect(navigationState.marketPrices.getPrice(Flower.BLUE)).to.eq(7)
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(3)
    })

    it('window not yet defined - falls back to cheapest flower', () => {
      const cardDeck = mockCardDeck({ pile: ['price-2'] })
      cardDeck.draw()
      const windowStates = WindowStates.new()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 3 },
          { flower: Flower.BLUE, price: 6 },
        ],
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions[0].action).to.eq(Action.PRICE)
      expect(botActions.actions[0].flowers).to.eql([Flower.RED])
      // RED was cheapest, increased from 3 to 4
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(4)
      expect(navigationState.marketPrices.getPrice(Flower.BLUE)).to.eq(6)
    })
  })

  describe('DELIVERY action', () => {
    it('delivers to best matching defined window', () => {
      const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED] }
        ]
      })
      const windowStates = WindowStates.new()
      windowStates.setWindowState(3, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.PURPLE], [])
      windowStates.setWindowState(2, WindowSelection.RIGHT, [Flower.RED, Flower.YELLOW], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.DELIVERY)
      // floor 3 LEFT has 2 matching flowers (RED, BLUE) vs floor 2 RIGHT has 1 (RED)
      expect(action.floor).to.eq(3)
      expect(action.windowSelection).to.eq(WindowSelection.LEFT)
      // delivery was recorded
      const window = windowStates.getWindowState(3, WindowSelection.LEFT)
      expect(window?.deliveries).to.eql([Player.BOT])
    })

    it('delivers to window with fewer missing flowers as tiebreaker', () => {
      const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED] }
        ]
      })
      const windowStates = WindowStates.new()
      // 3-flower window: 1 match, 2 missing
      windowStates.setWindowState(3, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.PURPLE], [])
      // 2-flower window: 1 match, 1 missing
      windowStates.setWindowState(2, WindowSelection.RIGHT, [Flower.RED, Flower.YELLOW], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.DELIVERY)
      // both have 1 match, but floor 2 RIGHT has fewer missing flowers
      expect(action.floor).to.eq(2)
      expect(action.windowSelection).to.eq(WindowSelection.RIGHT)
    })

    it('skips fully delivered windows', () => {
      const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] }
        ]
      })
      const windowStates = WindowStates.new()
      // fill floor 5 so it is not eligible
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE],
        [Player.PLAYER, Player.BOT, Player.PLAYER, Player.BOT])
      windowStates.setWindowState(1, WindowSelection.RIGHT, [Flower.RED], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.DELIVERY)
      // floor 5 and floor 2 LEFT are fully delivered (4 deliveries), so floor 1 RIGHT is chosen
      expect(action.floor).to.eq(1)
      expect(action.windowSelection).to.eq(WindowSelection.RIGHT)
    })

    it('falls back to WINDOW_BOX when no delivery window is available', () => {
      const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] }
        ]
      })
      // only the default 5th floor window exists which cannot receive deliveries differently
      const windowStates = WindowStates.new()
      // fill all deliveries on floor 5 so no windows are available
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      // should have fallen back to WINDOW_BOX
      expect(action.action).to.eq(Action.WINDOW_BOX)
    })

    it('falls back to WINDOW_BOX and defines a new window', () => {
      const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE] }
        ]
      })
      const windowStates = WindowStates.new()
      // fill floor 5 so no delivery possible
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      windowStates.addDelivery(5, WindowSelection.LEFT, Player.BOT)
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.WINDOW_BOX)
      // should have defined a window (3 flowers → highest undefined floor ≤ 3 is floor 3)
      expect(action.floor).not.to.be.undefined
    })

    it('delivers using advanced delivery card', () => {
      const cardDeck = mockCardDeck({ pile: ['adv-delivery'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED] }
        ]
      })
      const windowStates = WindowStates.new()
      windowStates.setWindowState(1, WindowSelection.LEFT, [Flower.RED], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.DELIVERY)
      expect(action.floor).to.eq(1)
      expect(action.windowSelection).to.eq(WindowSelection.LEFT)
    })
  })

  describe('WINDOW_BOX action', () => {
    it('defines window box on highest available floor matching flower count', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE] }
        ]
      })
      const windowStates = WindowStates.new()
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 5 },
          { flower: Flower.BLUE, price: 3 },
          { flower: Flower.PURPLE, price: 7 },
        ],
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.WINDOW_BOX)
      // 3 flowers → floor 3 (highest undefined floor ≤ flower count)
      expect(action.floor).to.eq(3)
      expect(action.windowSelection).to.eq(WindowSelection.LEFT)
      // flowers sorted by price: PURPLE(7), RED(5), BLUE(3)
      const window = windowStates.getWindowState(3, WindowSelection.LEFT)
      expect(window?.flowers).to.eql([Flower.PURPLE, Flower.RED, Flower.BLUE])
      expect(window?.deliveries).to.eql([Player.BOT])
    })

    it('defines window box preferring more expensive flowers', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE, Flower.YELLOW] }
        ]
      })
      const windowStates = WindowStates.new()
      // fill floor 4
      windowStates.setWindowState(4, WindowSelection.LEFT, [Flower.RED, Flower.BLUE, Flower.PURPLE, Flower.YELLOW], [])
      windowStates.setWindowState(4, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE, Flower.PURPLE, Flower.YELLOW], [])
      const navigationState = mockNavigationState({
        marketPrices: [
          { flower: Flower.RED, price: 3 },
          { flower: Flower.BLUE, price: 8 },
          { flower: Flower.PURPLE, price: 5 },
          { flower: Flower.YELLOW, price: 1 },
        ],
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.WINDOW_BOX)
      // both floor 4 defined, so floor 3 left is next
      expect(action.floor).to.eq(3)
      expect(action.windowSelection).to.eq(WindowSelection.LEFT)
      // 4 flowers but floor 3 can only hold 3, sorted by price: BLUE(8), PURPLE(5), RED(3)
      const window = windowStates.getWindowState(3, WindowSelection.LEFT)
      expect(window?.flowers).to.eql([Flower.BLUE, Flower.PURPLE, Flower.RED])
    })

    it('skips floors larger than available flower count', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] }
        ]
      })
      const windowStates = WindowStates.new()
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.WINDOW_BOX)
      // only 2 flowers → can only define floor 2 (floor 3 and 4 require more flowers)
      expect(action.floor).to.eq(2)
      expect(action.windowSelection).to.eq(WindowSelection.LEFT)
    })

    it('falls back to DELIVERY when no undefined window is available for flower count', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] }
        ]
      })
      const windowStates = WindowStates.new()
      // fill all floors ≤ 2
      windowStates.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [])
      windowStates.setWindowState(2, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE], [])
      windowStates.setWindowState(1, WindowSelection.LEFT, [Flower.RED], [])
      windowStates.setWindowState(1, WindowSelection.RIGHT, [Flower.RED], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      // should have fallen back to DELIVERY since no undefined window available for 2 flowers
      expect(action.action).to.eq(Action.DELIVERY)
    })

    it('falls back to DELIVERY and delivers to window', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden({
        seasons: [
          { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] }
        ]
      })
      const windowStates = WindowStates.new()
      // fill all floors ≤ 2 so WINDOW_BOX fails
      windowStates.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [])
      windowStates.setWindowState(2, WindowSelection.RIGHT, [Flower.RED, Flower.BLUE], [])
      windowStates.setWindowState(1, WindowSelection.LEFT, [Flower.RED], [])
      windowStates.setWindowState(1, WindowSelection.RIGHT, [Flower.RED], [])
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      expect(action.action).to.eq(Action.DELIVERY)
      // delivery should target a defined window
      expect(action.floor).not.to.be.undefined
      expect(action.windowSelection).not.to.be.undefined
    })

    it('no flowers in current season - cannot define window box', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1'] })
      cardDeck.draw()
      const garden = mockBotGarden()
      const windowStates = WindowStates.new()
      const navigationState = mockNavigationState({
        season: Season.AUTUMN,
        garden,
        windowStates,
        cardDeck
      })

      const botActions = new BotActions(navigationState)

      const action = botActions.actions[0]
      // no flowers → WINDOW_BOX fails, falls back to DELIVERY
      // no defined windows with deliveries available either (only floor 5)
      expect(action.action).to.eq(Action.DELIVERY)
    })
  })

  describe('pass action (botTurn == 0)', () => {
    it('uses soloBoardPassAction actions', () => {
      const navigationState = mockNavigationState({
        botTurn: 0,
        soloBoardPassAction: {
          income: 0,
          action: [Action.XP, Action.VP_5],
          botCardCount: 2,
          botBurnCardCount: 0,
          floor: 1
        }
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(2)
      expect(botActions.actions[0].action).to.eq(Action.XP)
      expect(botActions.actions[1].action).to.eq(Action.VP_5)
    })

    it('BILLBOARD pass action includes floor', () => {
      const navigationState = mockNavigationState({
        botTurn: 0,
        soloBoardPassAction: {
          income: 0,
          action: [Action.BILLBOARD],
          botCardCount: 2,
          botBurnCardCount: 0,
          floor: 3
        }
      })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      expect(botActions.actions[0].action).to.eq(Action.BILLBOARD)
      expect(botActions.actions[0].floor).to.eq(3)
    })
  })

  describe('non-automatic actions', () => {
    it('passes through actions without automatic processing', () => {
      const cardDeck = mockCardDeck({ pile: ['xp-1'] })
      cardDeck.draw()
      const navigationState = mockNavigationState({ cardDeck })

      const botActions = new BotActions(navigationState)

      expect(botActions.actions.length).to.eq(1)
      expect(botActions.actions[0].action).to.eq(Action.XP)
    })
  })

  it('no current card returns empty actions', () => {
    const cardDeck = mockCardDeck()
    const navigationState = mockNavigationState({ cardDeck })

    const botActions = new BotActions(navigationState)

    expect(botActions.actions.length).to.eq(0)
  })

})
