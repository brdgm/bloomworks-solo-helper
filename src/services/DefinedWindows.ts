import { cloneDeep } from 'lodash'
import { DefinedWindow } from '@/store/state'
import { ref } from 'vue'
import WindowSelection from './enum/WindowSelection'
import Flower from './enum/Flower'

/**
 * Stores flowers of already defined windows.
 */
export default class DefinedWindows {

  private readonly _definedWindows

  private constructor(definedWindows : DefinedWindow[]) {
    this._definedWindows = ref(definedWindows)
  }

  public get definedWindows() : readonly DefinedWindow[] {
    return this._definedWindows.value
  }

  public getDefinedWindow(windowSelection: WindowSelection) : Flower[]|undefined {
    return this._definedWindows.value.find(dw => dw.windowSelection === windowSelection)?.flowers
  }

  public setDefinedWindow(windowSelection: WindowSelection, flowers: Flower[]) : void {
    const existing = this._definedWindows.value.find(dw => dw.windowSelection === windowSelection)
    if (existing) {
      existing.flowers = flowers
    } else {
      this._definedWindows.value.push({ windowSelection, flowers })
    }
  }

  public removeDefinedWindow(windowSelection: WindowSelection) : void {
    this._definedWindows.value = this._definedWindows.value.filter(dw => dw.windowSelection !== windowSelection)
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : DefinedWindow[] {
    return cloneDeep(this._definedWindows.value)
  }

  /**
   * Initialize with empty instance.
   * @returns DefinedWindows
   */
  public static new() : DefinedWindows {
    return new DefinedWindows([])
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : DefinedWindow[]) : DefinedWindows {
    return new DefinedWindows(cloneDeep(persistence))
  }

}
