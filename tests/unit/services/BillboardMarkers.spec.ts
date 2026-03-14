import BillboardMarkers from '@/services/BillboardMarkers'
import { expect } from 'chai'

describe('services/BillboardMarkers', () => {

  it('new starts empty', () => {
    const markers = BillboardMarkers.new()

    expect(markers.getMarkerCount(1)).to.eq(0)
    expect(markers.getMarkerCount(5)).to.eq(0)
  })

  it('addMarker and getMarkerCount', () => {
    const markers = BillboardMarkers.new()

    markers.addMarker(2)
    markers.addMarker(2)
    markers.addMarker(4)

    expect(markers.getMarkerCount(2)).to.eq(2)
    expect(markers.getMarkerCount(4)).to.eq(1)
    expect(markers.getMarkerCount(3)).to.eq(0)
  })

  it('toPersistence', () => {
    const markers = BillboardMarkers.new()
    markers.addMarker(1)
    markers.addMarker(3)
    markers.addMarker(3)

    const persistence = markers.toPersistence()

    expect(persistence).to.eql([
      { floor: 1, count: 1 },
      { floor: 3, count: 2 }
    ])
  })

  it('toPersistence returns deep clone', () => {
    const markers = BillboardMarkers.new()
    markers.addMarker(2)

    const persistence = markers.toPersistence()
    persistence.push({ floor: 5, count: 99 })

    expect(markers.getMarkerCount(5)).to.eq(0)
  })

  it('fromPersistence', () => {
    const persistence = [
      { floor: 1, count: 3 },
      { floor: 4, count: 1 }
    ]

    const markers = BillboardMarkers.fromPersistence(persistence)

    expect(markers.getMarkerCount(1)).to.eq(3)
    expect(markers.getMarkerCount(4)).to.eq(1)
    expect(markers.getMarkerCount(2)).to.eq(0)
  })

  it('fromPersistence creates independent copy', () => {
    const persistence = [{ floor: 2, count: 1 }]

    const markers = BillboardMarkers.fromPersistence(persistence)
    markers.addMarker(2)

    expect(persistence[0].count).to.eq(1)
    expect(markers.getMarkerCount(2)).to.eq(2)
  })

})
