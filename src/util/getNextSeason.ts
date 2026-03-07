import Season from '@/services/enum/Season'

const SEASON_ORDER = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER]

/**
 * Gets the next season in season order.
 */
export default function getNextSeason(season: Season) : Season {
  const index = SEASON_ORDER.indexOf(season)
  return SEASON_ORDER[(index + 1) % SEASON_ORDER.length]
}
