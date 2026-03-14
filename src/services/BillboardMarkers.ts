import { cloneDeep } from 'lodash'
import { BillboardMarker } from '@/store/state'
import { ref } from 'vue'

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
