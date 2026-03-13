import BotActions from '@/services/BotActions'
import WindowStates from '@/services/WindowStates'
import Action from '@/services/enum/Action'
import Flower from '@/services/enum/Flower'
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
