import { cloneDeep } from 'lodash'
import { BillboardMarker } from '@/store/state'
import { ref } from 'vue'
import Player from './enum/Player'
import WindowStates from './WindowStates'

/**
 * Manages billboard markers per floor.
 */
export default class BillboardMarkers {

  private readonly _markers

  private constructor(markers : BillboardMarker[]) {
    this._markers = ref(markers)
  }

  public addMarker(floor: number) : void {
    const existing = this._markers.value.find(m => m.floor === floor)
    if (existing) {
      existing.count++
    } else {
      this._markers.value.push({ floor, count: 1 })
    }
  }

/**
   * Adds a billboard marker to the floor (1-4) with the fewest total markers.
   * Total markers per floor = bot deliveries across all windows on that floor + billboard markers.
   * Ties are broken by choosing the highest floor.
   * @returns the chosen floor number
   */
  public addMarkerToFloorWithLeastMarkers(windowStates: WindowStates) : number {
    let bestFloor = 4
    let bestCount = Infinity
    for (let floor = 1; floor <= 4; floor++) {
      const botDeliveries = windowStates.windowStates
        .filter(w => w.floor === floor)
        .reduce((sum, w) => sum + w.deliveries.filter(d => d === Player.BOT).length, 0)
      const total = botDeliveries + this.getMarkerCount(floor)
      if (total <= bestCount) {
        bestCount = total
        bestFloor = floor
      }
    }
    this.addMarker(bestFloor)
    return bestFloor
  }

  public getMarkerCount(floor: number) : number {
    return this._markers.value.find(m => m.floor === floor)?.count ?? 0
  }

  public toPersistence() : BillboardMarker[] {
    return cloneDeep(this._markers.value)
  }

  public static new() : BillboardMarkers {
    return new BillboardMarkers([])
  }

  public static fromPersistence(persistence : BillboardMarker[]) : BillboardMarkers {
    return new BillboardMarkers(cloneDeep(persistence))
  }

}
