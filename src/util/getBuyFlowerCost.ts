/**
 * Calculates the total cost for buying flowers.
 * The first flower costs the current price, each additional flower costs 1 more.
 * The price per flower is never higher than 12.
 * @param currentPrice Current market price
 * @param count Number of flowers to buy
 * @returns Total cost
 */
export default function getBuyFlowerCost(currentPrice: number, count: number) : number {
  let total = 0
  for (let i = 0; i < count; i++) {
    total += Math.min(currentPrice + i, 12)
  }
  return total
}
