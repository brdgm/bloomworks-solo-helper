import NavigationState from '@/util/NavigationState'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import Season from '@/services/enum/Season'
import { expect } from 'chai'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'
import mockRoundTurn from '../helper/mockRoundTurn'
import mockCardDeck from '../helper/mockCardDeck'
import mockBotPersistence from '../helper/mockBotPersistence'
import mockBotGarden from '../helper/mockBotGarden'

describe('util/NavigationState', () => {

  it('round and turn', () => {
    const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
    const state = mockState({ rounds: [
      mockRound({ round: 1 }),
    ] })
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round).to.eq(1)
    expect(navigationState.turn).to.eq(3)
  })

  describe('season', () => {
    it('returns season from round data', () => {
      const route = mockRouteLocation({ params: { round: '2', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, season: Season.SPRING }),
        mockRound({ round: 2, season: Season.SUMMER }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.season).to.eq(Season.SUMMER)
    })

    it('defaults to AUTUMN when round not found', () => {
      const route = mockRouteLocation({ params: { round: '5', turn: '1' } })
      const state = mockState({ rounds: [] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.season).to.eq(Season.AUTUMN)
    })
  })

  describe('marketPrices', () => {
    it('uses market prices from previous bot turn in same round', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT,
            marketPrices: [
              { flower: Flower.RED, price: 6 },
              { flower: Flower.PURPLE, price: 3 },
              { flower: Flower.YELLOW, price: 4 },
              { flower: Flower.BLUE, price: 4 },
              { flower: Flower.ORANGE, price: 4 },
            ],
            botPersistence: mockBotPersistence(),
          }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(6)
      expect(navigationState.marketPrices.getPrice(Flower.PURPLE)).to.eq(3)
    })

    it('falls back to previous round when no bot turn in current round', () => {
      const route = mockRouteLocation({ params: { round: '2', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.BOT,
            marketPrices: [
              { flower: Flower.ORANGE, price: 10 },
              { flower: Flower.RED, price: 2 },
              { flower: Flower.PURPLE, price: 4 },
              { flower: Flower.YELLOW, price: 4 },
              { flower: Flower.BLUE, price: 4 },
            ],
            botPersistence: mockBotPersistence(),
          }),
        ] }),
        mockRound({ round: 2, turns: [] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.marketPrices.getPrice(Flower.ORANGE)).to.eq(10)
      expect(navigationState.marketPrices.getPrice(Flower.RED)).to.eq(2)
    })

    it('falls back to initial market prices from setup', () => {
      const initialPrices = [
        { flower: Flower.BLUE, price: 8 },
        { flower: Flower.YELLOW, price: 5 },
        { flower: Flower.RED, price: 4 },
        { flower: Flower.PURPLE, price: 4 },
        { flower: Flower.ORANGE, price: 4 },
      ]
      const route = mockRouteLocation({ params: { round: '1', turn: '1' } })
      const state = mockState({
        initialMarketPrices: initialPrices,
        rounds: [
          mockRound({ round: 1, turns: [] }),
        ],
      })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.marketPrices.getPrice(Flower.BLUE)).to.eq(8)
      expect(navigationState.marketPrices.getPrice(Flower.YELLOW)).to.eq(5)
    })
  })

  describe('cardDeck', () => {
    it('uses card deck from previous bot turn in same round', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-1', 'delivery-1'], played: ['price-1'] })
      const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT,
            botPersistence: mockBotPersistence({ cardDeck }),
          }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.cardDeck.pile.map(c => c.id)).to.eql(['window-box-1', 'delivery-1'])
      expect(navigationState.cardDeck.played.map(c => c.id)).to.eql(['price-1'])
    })

    it('falls back to previous round when no bot turn in current round', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-2'], discard: ['price-2'] })
      const route = mockRouteLocation({ params: { round: '2', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.BOT,
            botPersistence: mockBotPersistence({ cardDeck }),
          }),
        ] }),
        mockRound({ round: 2, turns: [] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.cardDeck.pile.map(c => c.id)).to.eql(['window-box-2'])
      expect(navigationState.cardDeck.discard.map(c => c.id)).to.eql(['price-2'])
    })

    it('falls back to initial bot persistence from setup', () => {
      const cardDeck = mockCardDeck({ pile: ['window-box-3', 'window-box-4'] })
      const route = mockRouteLocation({ params: { round: '1', turn: '1' } })
      const state = mockState({
        initialBotPersistence: mockBotPersistence({ cardDeck }),
        rounds: [
          mockRound({ round: 1, turns: [] }),
        ],
      })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.cardDeck.pile.map(c => c.id)).to.eql(['window-box-3', 'window-box-4'])
    })
  })

  describe('botGarden', () => {
    it('uses bot garden from previous bot turn in same round', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE] },
      ] })
      const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT,
            botPersistence: mockBotPersistence({ garden }),
          }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      const spring = navigationState.botGarden.seasons.find(s => s.season === Season.SPRING)!
      expect(spring.flowers).to.eql([Flower.RED, Flower.BLUE])
    })

    it('falls back to previous round when no bot turn in current round', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SUMMER, flowers: [Flower.YELLOW] },
      ] })
      const route = mockRouteLocation({ params: { round: '2', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.BOT,
            botPersistence: mockBotPersistence({ garden }),
          }),
        ] }),
        mockRound({ round: 2, turns: [] }),
      ] })
      const navigationState = new NavigationState(route, state)

      const summer = navigationState.botGarden.seasons.find(s => s.season === Season.SUMMER)!
      expect(summer.flowers).to.eql([Flower.YELLOW])
    })

    it('falls back to initial bot persistence from setup', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.WINTER, flowers: [Flower.ORANGE] },
      ] })
      const route = mockRouteLocation({ params: { round: '1', turn: '1' } })
      const state = mockState({
        initialBotPersistence: mockBotPersistence({ garden }),
        rounds: [
          mockRound({ round: 1, turns: [] }),
        ],
      })
      const navigationState = new NavigationState(route, state)

      const winter = navigationState.botGarden.seasons.find(s => s.season === Season.WINTER)!
      expect(winter.flowers).to.eql([Flower.ORANGE])
    })
  })

  describe('playerTurns', () => {
    it('returns 0 when no turns exist', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerTurns).to.eq(0)
    })

    it('counts only player turns before current turn', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '5' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT, botPersistence: mockBotPersistence() }),
          mockRoundTurn({ turn: 3, player: Player.PLAYER }),
          mockRoundTurn({ turn: 4, player: Player.BOT, botPersistence: mockBotPersistence() }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerTurns).to.eq(2)
    })

    it('does not count turns at or after current turn', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT, botPersistence: mockBotPersistence() }),
          mockRoundTurn({ turn: 3, player: Player.PLAYER }),
          mockRoundTurn({ turn: 4, player: Player.BOT, botPersistence: mockBotPersistence() }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerTurns).to.eq(1)
    })
  })

  describe('playerDeliveryFloor', () => {
    it('defaults to 1 when no player turns exist', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '1' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerDeliveryFloor).to.eq(1)
    })

    it('returns delivery floor from most recent player turn', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '5' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER, playerDeliveryFloor: 2 }),
          mockRoundTurn({ turn: 2, player: Player.BOT, botPersistence: mockBotPersistence() }),
          mockRoundTurn({ turn: 3, player: Player.PLAYER, playerDeliveryFloor: 4 }),
          mockRoundTurn({ turn: 4, player: Player.BOT, botPersistence: mockBotPersistence() }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerDeliveryFloor).to.eq(4)
    })

    it('defaults to 1 when player turn has no delivery floor set', () => {
      const route = mockRouteLocation({ params: { round: '1', turn: '3' } })
      const state = mockState({ rounds: [
        mockRound({ round: 1, turns: [
          mockRoundTurn({ turn: 1, player: Player.PLAYER }),
          mockRoundTurn({ turn: 2, player: Player.BOT, botPersistence: mockBotPersistence() }),
        ] }),
      ] })
      const navigationState = new NavigationState(route, state)

      expect(navigationState.playerDeliveryFloor).to.eq(1)
    })
  })

})
