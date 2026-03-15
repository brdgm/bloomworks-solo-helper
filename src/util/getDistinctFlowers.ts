import Flower from '@/services/enum/Flower'

/**
 * Returns a distinct list of flowers from the given array.
 * @param flowers Array of flowers (may contain duplicates)
 * @returns Array of distinct flowers
 */
export default function getDistinctFlowers(flowers: Flower[]) : Flower[] {
  return [...new Set(flowers)]
}
