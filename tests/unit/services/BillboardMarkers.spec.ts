import BillboardMarkers from '@/services/BillboardMarkers'
import Player from '@/services/enum/Player'
import WindowSelection from '@/services/enum/WindowSelection'
import WindowStates from '@/services/WindowStates'
import { WindowState } from '@/store/state'
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

  it('addMarkerToFloorWithLeastMarkers - all empty', () => {
    const markers = BillboardMarkers.new()
    const windowStates = WindowStates.fromPersistence([])

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // all floors tied at 0, highest floor wins
    expect(floor).to.eq(4)
    expect(markers.getMarkerCount(4)).to.eq(1)
  })

  it('addMarkerToFloorWithLeastMarkers - billboard markers only', () => {
    const markers = BillboardMarkers.fromPersistence([
      { floor: 3, count: 2 },
      { floor: 4, count: 1 }
    ])
    const windowStates = WindowStates.fromPersistence([])

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // floor 1=0, floor 2=0 → tied, highest floor wins → floor 2
    expect(floor).to.eq(2)
    expect(markers.getMarkerCount(2)).to.eq(1)
  })

  it('addMarkerToFloorWithLeastMarkers - bot deliveries counted', () => {
    const markers = BillboardMarkers.new()
    const windows: WindowState[] = [
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT, Player.BOT] },
      { floor: 2, windowSelection: WindowSelection.RIGHT, flowers: [], deliveries: [Player.BOT] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] }
    ]
    const windowStates = WindowStates.fromPersistence(windows)

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // floor 1=0, floor 2=3, floor 3=1, floor 4=0 → tied 1&4 at 0, highest wins → floor 4
    expect(floor).to.eq(4)
    expect(markers.getMarkerCount(4)).to.eq(1)
  })

  it('addMarkerToFloorWithLeastMarkers - only bot deliveries count, not player', () => {
    const markers = BillboardMarkers.new()
    const windows: WindowState[] = [
      { floor: 4, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.PLAYER, Player.PLAYER] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] }
    ]
    const windowStates = WindowStates.fromPersistence(windows)

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // floor 1=0, floor 2=0, floor 3=1, floor 4=0 (player deliveries not counted)
    // tied 1,2,4 at 0, highest wins → floor 4
    expect(floor).to.eq(4)
  })

  it('addMarkerToFloorWithLeastMarkers - combined markers and deliveries', () => {
    const markers = BillboardMarkers.fromPersistence([
      { floor: 1, count: 1 },
      { floor: 4, count: 2 }
    ])
    const windows: WindowState[] = [
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT, Player.BOT] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] }
    ]
    const windowStates = WindowStates.fromPersistence(windows)

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // floor 1=1, floor 2=2, floor 3=1, floor 4=2 → tied 1&3 at 1, highest wins → floor 3
    expect(floor).to.eq(3)
    expect(markers.getMarkerCount(3)).to.eq(1)
  })

  it('addMarkerToFloorWithLeastMarkers - ignores floor 5', () => {
    const markers = BillboardMarkers.new()
    const windows: WindowState[] = [
      { floor: 1, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] },
      { floor: 2, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] },
      { floor: 3, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] },
      { floor: 4, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [Player.BOT] },
      { floor: 5, windowSelection: WindowSelection.LEFT, flowers: [], deliveries: [] }
    ]
    const windowStates = WindowStates.fromPersistence(windows)

    const floor = markers.addMarkerToFloorWithLeastMarkers(windowStates)

    // all floors 1-4 tied at 1, highest wins → floor 4 (not floor 5)
    expect(floor).to.eq(4)
  })

})
