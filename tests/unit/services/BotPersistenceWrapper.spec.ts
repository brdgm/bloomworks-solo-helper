import BotPersistenceWrapper from '@/services/BotPersistenceWrapper'
import WindowStates from '@/services/WindowStates'
import Flower from '@/services/enum/Flower'
import Milestone from '@/services/enum/Milestone'
import Player from '@/services/enum/Player'
import WindowSelection from '@/services/enum/WindowSelection'
import { expect } from 'chai'
import mockBotGarden from '../helper/mockBotGarden'
import mockCardDeck from '../helper/mockCardDeck'

describe('services/BotPersistenceWrapper', () => {

  it('constructor and getters', () => {
    const cardDeck = mockCardDeck({ pile: ['plant-1', 'sold-1'] })
    const garden = mockBotGarden()
    const milestones = [Milestone.AUTUMN, Milestone.WINTER]
    const windowStates = WindowStates.new()

    const wrapper = new BotPersistenceWrapper(cardDeck, garden, milestones, windowStates)

    expect(wrapper.cardDeck).to.eq(cardDeck)
    expect(wrapper.garden).to.eq(garden)
    expect(wrapper.claimedMilestones).to.eql([Milestone.AUTUMN, Milestone.WINTER])
    expect(wrapper.windowStates).to.eq(windowStates)
  })

  it('setClaimedMilestones', () => {
    const wrapper = new BotPersistenceWrapper(
      mockCardDeck(), mockBotGarden(), [], WindowStates.new()
    )

    wrapper.setClaimedMilestones([Milestone.SPRING, Milestone.FIFTH_FLOOR])

    expect(wrapper.claimedMilestones).to.eql([Milestone.SPRING, Milestone.FIFTH_FLOOR])
  })

  it('toPersistence', () => {
    const cardDeck = mockCardDeck({ pile: ['plant-1'], discard: ['sold-1'] })
    const garden = mockBotGarden()
    const milestones = [Milestone.SUMMER]
    const windowStates = WindowStates.new()
    windowStates.setWindowState(2, WindowSelection.LEFT, [Flower.RED, Flower.BLUE], [Player.BOT])

    const wrapper = new BotPersistenceWrapper(cardDeck, garden, milestones, windowStates)
    const persistence = wrapper.toPersistence()

    expect(persistence.cardDeck.pile).to.eql(['plant-1'])
    expect(persistence.cardDeck.discard).to.eql(['sold-1'])
    expect(persistence.garden).to.have.length(4)
    expect(persistence.claimedMilestones).to.eql([Milestone.SUMMER])
    expect(persistence.windowStates).to.have.length(2)
  })

  it('toPersistence returns deep clone', () => {
    const wrapper = new BotPersistenceWrapper(
      mockCardDeck(), mockBotGarden(), [Milestone.AUTUMN], WindowStates.new()
    )

    const persistence = wrapper.toPersistence()
    persistence.claimedMilestones.push(Milestone.WINTER)

    expect(wrapper.claimedMilestones).to.eql([Milestone.AUTUMN])
  })

  it('fromPersistence', () => {
    const cardDeck = mockCardDeck({ pile: ['delivery-1'] })
    const garden = mockBotGarden()
    const windowStates = WindowStates.new()
    windowStates.setWindowState(1, WindowSelection.RIGHT, [Flower.PURPLE], [])
    const original = new BotPersistenceWrapper(
      cardDeck, garden, [Milestone.WINTER], windowStates
    )

    const persistence = original.toPersistence()
    const flowerOrder = [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED]
    const restored = BotPersistenceWrapper.fromPersistence(persistence, flowerOrder)

    expect(restored.cardDeck.pile.map(c => c.id)).to.eql(['delivery-1'])
    expect(restored.claimedMilestones).to.eql([Milestone.WINTER])
    expect(restored.windowStates.getWindowState(1, WindowSelection.RIGHT)?.flowers).to.eql([Flower.PURPLE])
  })

  it('fromPersistence handles missing windowStates', () => {
    const persistence = {
      cardDeck: { pile: [], discard: [] },
      garden: mockBotGarden().toPersistence(),
      claimedMilestones: [],
      windowStates: undefined as never
    }
    const flowerOrder = [Flower.ORANGE, Flower.BLUE, Flower.YELLOW, Flower.PURPLE, Flower.RED]

    const restored = BotPersistenceWrapper.fromPersistence(persistence, flowerOrder)

    expect(restored.windowStates.windowStates).to.have.length(0)
  })
})
