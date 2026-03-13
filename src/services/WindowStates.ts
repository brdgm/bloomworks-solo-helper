import { cloneDeep } from 'lodash'
import { WindowState } from '@/store/state'
import { ref } from 'vue'
import WindowSelection from './enum/WindowSelection'
import Flower from './enum/Flower'
import Player from './enum/Player'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

/**
 * Stores flowers of already defined windows.
 */
export default class WindowStates {

  private readonly _windowStates

  private constructor(windowStates : WindowState[]) {
    this._windowStates = ref(windowStates)
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
