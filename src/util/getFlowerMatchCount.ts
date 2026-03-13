import Flower from '@/services/enum/Flower'

/**
 * Counts the number of matching flowers, taking duplicates in the flowers to match into account as well.
 * @param flowers Given flowers
 * @param flowersToMatch Flowers to match against
 * @returns number of matching flowers
 */
export default function getFlowerMatchCount(flowers: Flower[], flowersToMatch: Flower[]) : number {
  const flowersToMatchCopy = [...flowersToMatch]
  let matchCount = 0
  for (const flower of flowers) {
    const index = flowersToMatchCopy.indexOf(flower)
    if (index >= 0) {
      matchCount++
      flowersToMatchCopy.splice(index, 1)
    }
  }
  return matchCount
}
