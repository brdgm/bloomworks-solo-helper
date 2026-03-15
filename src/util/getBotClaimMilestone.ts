import Milestone from '@/services/enum/Milestone'
import Season from '@/services/enum/Season'

const SEASON_MILESTONE : Record<Season, Milestone> = {
  [Season.AUTUMN]: Milestone.AUTUMN,
  [Season.WINTER]: Milestone.WINTER,
  [Season.SPRING]: Milestone.SPRING,
  [Season.SUMMER]: Milestone.SUMMER
}

/**
 * Determines which milestone the bot should claim.
 * First tries the milestone matching the current season.
 * If already claimed, returns the topmost available milestone
 * (fifth floor first, then milestones in milestone season order).
 * Returns undefined if all milestones are already claimed.
 */
export default function getBotClaimMilestone(claimedMilestones: readonly Milestone[],
    currentSeason: Season, milestoneSeasonOrder: Season[]) : Milestone | undefined {
  // try milestone matching the current season
  const currentMilestone = SEASON_MILESTONE[currentSeason]
  if (!claimedMilestones.includes(currentMilestone)) {
    return currentMilestone
  }
  // fallback: topmost available (fifth floor first, then milestone season order)
  const priorityOrder = [
    Milestone.FIFTH_FLOOR,
    ...milestoneSeasonOrder.map(s => SEASON_MILESTONE[s])
  ]
  return priorityOrder.find(m => !claimedMilestones.includes(m))
}
