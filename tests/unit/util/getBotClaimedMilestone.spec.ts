import { expect } from 'chai'
import Milestone from '@/services/enum/Milestone'
import Season from '@/services/enum/Season'
import getBotClaimedMilestone from '@/util/getBotClaimedMilestone'

const milestoneSeasonOrder = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER]

describe('util/getBotClaimedMilestone', () => {

  it('should return current season milestone if not claimed', () => {
    const result = getBotClaimedMilestone([], Season.SPRING, milestoneSeasonOrder)
    expect(result).to.eq(Milestone.SPRING)
  })

  it('should return current season milestone even when others are claimed', () => {
    const result = getBotClaimedMilestone(
      [Milestone.FIFTH_FLOOR, Milestone.AUTUMN],
      Season.WINTER, milestoneSeasonOrder
    )
    expect(result).to.eq(Milestone.WINTER)
  })

  it('should fall back to fifth floor if current season milestone is claimed', () => {
    const result = getBotClaimedMilestone(
      [Milestone.SPRING],
      Season.SPRING, milestoneSeasonOrder
    )
    expect(result).to.eq(Milestone.FIFTH_FLOOR)
  })

  it('should fall back to first milestone season order if fifth floor and current are claimed', () => {
    const result = getBotClaimedMilestone(
      [Milestone.SPRING, Milestone.FIFTH_FLOOR],
      Season.SPRING, milestoneSeasonOrder
    )
    // milestoneSeasonOrder: SPRING, SUMMER, AUTUMN, WINTER
    // SPRING is claimed, so next is SUMMER
    expect(result).to.eq(Milestone.SUMMER)
  })

  it('should skip already claimed milestones in priority order', () => {
    const result = getBotClaimedMilestone(
      [Milestone.AUTUMN, Milestone.FIFTH_FLOOR, Milestone.SPRING, Milestone.SUMMER],
      Season.AUTUMN, milestoneSeasonOrder
    )
    expect(result).to.eq(Milestone.WINTER)
  })

  it('should return undefined if all milestones are claimed', () => {
    const result = getBotClaimedMilestone(
      [Milestone.FIFTH_FLOOR, Milestone.SPRING, Milestone.SUMMER, Milestone.AUTUMN, Milestone.WINTER],
      Season.AUTUMN, milestoneSeasonOrder
    )
    expect(result).to.be.undefined
  })

  it('should respect different milestone season orders', () => {
    const customOrder = [Season.WINTER, Season.AUTUMN, Season.SUMMER, Season.SPRING]
    const result = getBotClaimedMilestone(
      [Milestone.SUMMER, Milestone.FIFTH_FLOOR, Milestone.WINTER],
      Season.SUMMER, customOrder
    )
    // fifth floor claimed, WINTER claimed, next is AUTUMN
    expect(result).to.eq(Milestone.AUTUMN)
  })

})
