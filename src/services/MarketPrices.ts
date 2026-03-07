import { cloneDeep, shuffle } from 'lodash'
import { FlowerPrice } from '@/store/state'
import { ref } from 'vue'
import Flower from './enum/Flower'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

/**
 * Manages market prices (and color priority of Lady Pei).
 */
export default class MarketPrices {

  static readonly MIN_PRICE = 1
  static readonly MAX_PRICE = 12

  private readonly _prices

  private constructor(prices : FlowerPrice[]) {
    this._prices = ref(prices)
  }

  public get prices() : readonly FlowerPrice[] {
    return this._prices.value
  }

  public getPrice(flower : Flower) : number {
    const price = this._prices.value.find(item => item.flower === flower)
    if (!price) {
      throw new Error(`Flower ${flower} not found in market prices.`)
    }
    return price.price
  }

  /**
   * Increase price (not beyond 12).
   */
  public increasePrice(flower : Flower) {
    const price = this._prices.value.find(item => item.flower === flower)
    if (!price) {
      throw new Error(`Flower ${flower} not found in market prices.`)
    }
    price.price = Math.min(MarketPrices.MAX_PRICE, price.price + 1)
  }

  /**
   * Decrease price (not below 1).
   */
  public decreasePrice(flower : Flower) {
    const price = this._prices.value.find(item => item.flower === flower)
    if (!price) {
      throw new Error(`Flower ${flower} not found in market prices.`)
    }
    price.price = Math.max(MarketPrices.MIN_PRICE, price.price - 1)
  }

  /**
   * Gets persistence view of market prices.
   */
  public toPersistence() : FlowerPrice[] {
    return cloneDeep(this._prices.value)
  }

  /**
   * Initialize market prices with a random order of folders and starting price of 4 for each flower.
   * @returns MarketPrices
   */
  public static new() : MarketPrices {
    const flowers = shuffle(getAllEnumValues(Flower))
    const prices : FlowerPrice[] = flowers.map(flower => ({ flower, price: 4 }))
    return new MarketPrices(prices)
  }

  /**
   * Re-creates market prices from persistence.
   */
  public static fromPersistence(persistence : FlowerPrice[]) : MarketPrices {
    return new MarketPrices(cloneDeep(persistence))
  }

}
