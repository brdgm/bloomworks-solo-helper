import { cloneDeep } from 'lodash'
import { WindowState } from '@/store/state'
import { ref } from 'vue'
import WindowSelection from './enum/WindowSelection'
import Flower from './enum/Flower'
import Player from './enum/Player'

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

  public getWindowState(windowSelection: WindowSelection) : WindowState|undefined {
    return this._windowStates.value.find(dw => dw.windowSelection === windowSelection)
  }

  public setWindowState(windowSelection: WindowSelection, flowers: Flower[], deliveries: Player[]) : void {
    const existing = this._windowStates.value.find(dw => dw.windowSelection === windowSelection)
    if (existing) {
      existing.flowers = flowers
      existing.deliveries = deliveries
    } else {
      this._windowStates.value.push({ windowSelection, flowers, deliveries })
    }
  }

  public removeWindowState(windowSelection: WindowSelection) : void {
    this._windowStates.value = this._windowStates.value.filter(dw => dw.windowSelection !== windowSelection)
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : WindowState[] {
    return cloneDeep(this._windowStates.value)
  }

  /**
   * Initialize with empty instance.
   * @returns WindowStates
   */
  public static new() : WindowStates {
    return new WindowStates([])
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : WindowState[]) : WindowStates {
    return new WindowStates(cloneDeep(persistence))
  }

}
