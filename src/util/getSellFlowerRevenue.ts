/**
 * Calculates the total revenue for selling flowers.
 * Before selling, the price is reduced by 1. Each additional flower sells for 1 less.
 * The price per flower is never lower than 1.
 * @param currentPrice Current market price
 * @param count Number of flowers to sell
 * @returns Total revenue
 */
export default function getSellFlowerRevenue(currentPrice: number, count: number) : number {
  let total = 0
  for (let i = 0; i < count; i++) {
    total += Math.max(currentPrice - 1 - i, 1)
  }
  return total
}
