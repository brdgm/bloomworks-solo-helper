import { cloneDeep } from 'lodash'
import { WindowState } from '@/store/state'
import { ref } from 'vue'
import WindowSelection from './enum/WindowSelection'
import Flower from './enum/Flower'
import Player from './enum/Player'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import MarketPrices from './MarketPrices'

/**
 * Stores flowers of already defined windows.
 */
export default class WindowStates {

  private readonly _windowStates

  private constructor(windowStates : WindowState[]) {
    this._windowStates = ref(windowStates)
    this.sortFloorsWindows()
  }

  public get windowStates() : readonly WindowState[] {
    return this._windowStates.value
  }

  public getWindowState(floor: number, windowSelection: WindowSelection) : WindowState|undefined {
    return this._windowStates.value.find(dw => dw.floor === floor && dw.windowSelection === windowSelection)
  }

  public setWindowState(floor: number, windowSelection: WindowSelection, flowers: Flower[], deliveries: Player[]) : void {
    const existing = this._windowStates.value.find(dw => dw.floor === floor && dw.windowSelection === windowSelection)
    if (existing) {
      existing.flowers = flowers
      existing.deliveries = deliveries
    } else {
      this._windowStates.value.push({ floor, windowSelection, flowers, deliveries })
      this.sortFloorsWindows()
    }
  }

  public addDelivery(floor: number, windowSelection: WindowSelection, player: Player) : void {
    const existing = this._windowStates.value.find(dw => dw.floor === floor && dw.windowSelection === windowSelection)
    if (!existing) {
      throw new Error(`Window state for floor ${floor} and ${windowSelection} not found.`)
    }
    existing.deliveries.push(player)
  }

  public removeWindowState(floor: number, windowSelection: WindowSelection) : void {
    this._windowStates.value = this._windowStates.value.filter(dw => dw.floor !== floor || dw.windowSelection !== windowSelection)
  }

  /**
   * Get the best matching delivery window for the given flowers, based on the bot's defined windows and their priority.
   */
  public getBestMatchingDeliveryWindow(flowers: Flower[]) : WindowState|undefined {
    // get all defined windows that are not fully delivered yet, already ordered in bot's priority
    const windows = this._windowStates.value.filter(w => w.deliveries.length < 4)
      .toSorted((a, b) => {
        const matchA = getMatchCount(a.flowers, flowers)
        const matchB = getMatchCount(b.flowers, flowers)
        // sort windows by number of matching flowers, higher match has higher priority
        if (matchB !== matchA) return matchB - matchA
        // Sort windows by fewest missing flowers, as tie breaker. This ensures that if there are multiple windows with the same match count, the one with fewer missing flowers is prioritized.
        return (a.flowers.length - matchA) - (b.flowers.length - matchB)
      })
    return windows[0]
  }

  /**
   * Gets the best-matching undefined window for the given flowers.
   * The flowers are also selected for the window, prioritizing more expensive flowers (based on the given market prices) in case there are more flowers than the window can hold.
   */
  public getBestMatchingUndefinedWindow(flowers: Flower[], marketPrices: MarketPrices) : WindowState|undefined {
    // list all undefined windows, ordered top-to-bottom, left-to-right
    const windows : WindowState[] = []
    for (let floor = 4; floor >= 1; floor--) {
      for (const windowSelection of [WindowSelection.LEFT, WindowSelection.RIGHT]) {
        const existing = this._windowStates.value.find(dw => dw.floor === floor && dw.windowSelection === windowSelection)
        if (!existing) {
          windows.push({ floor, windowSelection, flowers: [], deliveries: [] })
        }
      }
    }
    // get the best-matching undefined window, skipping all windows larger then the given flowers
    const bestMatch = windows.filter(w => w.floor <= flowers.length)[0]
    if (bestMatch) {
      // sort the given flowers by price, higher price first, to prioritize matching more expensive flowers (otherwise keeping the order by bot flower priority)
      const flowersSorted = [...flowers].sort((a, b) => marketPrices.getPrice(b) - marketPrices.getPrice(a))
      bestMatch.flowers = flowersSorted.slice(0, bestMatch.floor)
    }
    return bestMatch
  }

  /**
   * Sorts the windows by floor (descending) and window position (left, right).
   */
  private sortFloorsWindows() : void {
    const selectionOrder = [WindowSelection.LEFT, WindowSelection.RIGHT]
    this._windowStates.value.sort((a, b) =>
      b.floor - a.floor || selectionOrder.indexOf(a.windowSelection) - selectionOrder.indexOf(b.windowSelection)
    )
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : WindowState[] {
    return cloneDeep(this._windowStates.value)
  }

  /**
   * Initialize with empty instance, only containing 5th floor state.
   * @returns WindowStates
   */
  public static new() : WindowStates {
    return new WindowStates([
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: getAllEnumValues(Flower), deliveries: [] }
    ])
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : WindowState[]) : WindowStates {
    return new WindowStates(cloneDeep(persistence))
  }

}

/**
 * Counts the number of matching flowers, taking duplicates in the flowers to match into account as well.
 * @param flowers Given flowers
 * @param flowersToMatch Flowers to match against
 * @returns number of matching flowers
 */
function getMatchCount(flowers: Flower[], flowersToMatch: Flower[]) : number {
  const flowersToMatchCopy = cloneDeep(flowersToMatch)
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
