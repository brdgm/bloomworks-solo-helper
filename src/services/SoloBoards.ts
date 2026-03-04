import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import SoloBoard from './SoloBoard'
import Action from './enum/Action'

/**
 * Solo boards
 */
const soloBoards : SoloBoard[] = [
  {
    id: 'base',
    floorActions: [
      {
        floor: 5,
        floorAction: [
          { income: 2 },
          { income: 2 },
          { },
          { },
          { },
          { action: [Action.VP_5] }
        ]
      },
      {
        floor: 4,
        floorAction: [
          { income: 3 },
          { income: 2 },
          { income: 2 },
          { },
          { },
          { action: [Action.XP, Action.BILLBOARD] }
        ]
      },
      {
        floor: 3,
        floorAction: [
          { income: 4 },
          { income: 3 },
          { income: 2 },
          { income: 2 },
          { action: [Action.XP] },
          { action: [Action.BILLBOARD] }
        ]
      },
      {
        floor: 2,
        floorAction: [
          { income: 5 },
          { income: 4 },
          { income: 3 },
          { income: 2, action: [Action.XP] },
          { income: 2, action: [Action.PLANT] },
          { action: [Action.BILLBOARD] }
        ]
      },
      {
        floor: 1,
        floorAction: [
          { income: 6 },
          { income: 5 },
          { income: 4, action: [Action.XP] },
          { income: 3, action: [Action.PLANT] },
          { income: 2, action: [Action.PLANT,Action.XP] },
          { action: [Action.BILLBOARD] }
        ]
      },
    ],
    botCardCount: [2, 3, 4, 4, 5, 5]
  },
  {
    id: 'advanced',
    floorActions: [
      {
        floor: 5,
        floorAction: [
          { income: 1 },
          { income: 1 },
          { },
          { },
          { },
          { action: [Action.VP_5] }
        ]
      },
      {
        floor: 4,
        floorAction: [
          { income: 2 },
          { income: 1 },
          { income: 1 },
          { },
          { },
          { action: [Action.XP, Action.BILLBOARD] }
        ]
      },
      {
        floor: 3,
        floorAction: [
          { income: 3 },
          { income: 2 },
          { income: 1 },
          { income: 1 },
          { action: [Action.XP] },
          { action: [Action.BILLBOARD] }
        ]
      },
      {
        floor: 2,
        floorAction: [
          { income: 4 },
          { income: 3 },
          { income: 2 },
          { income: 1, action: [Action.XP] },
          { income: 1, action: [Action.PLANT] },
          { action: [Action.BILLBOARD] }
        ]
      },
      {
        floor: 1,
        floorAction: [
          { income: 5 },
          { income: 4 },
          { income: 3, action: [Action.XP] },
          { income: 2, action: [Action.PLANT] },
          { income: 1, action: [Action.PLANT,Action.XP] },
          { action: [Action.BILLBOARD] }
        ]
      },
    ],
    botCardCount: [2, 3, 4, 4, 5, 5]
  }
]

const soloBoardsMap = new Map<string,SoloBoard>()
for (const soloBoard of soloBoards) {
  soloBoardsMap.set(soloBoard.id, soloBoard)
}

export default {

  /**
   * Get solo board by ID
   * @param id ID
   * @returns Solo board
   */
  get(id: string) : SoloBoard {
    return findMandatory(soloBoardsMap, id)
  },

  /**
   * Get all solo boards
   * @returns Solo boards
   */
  getAll() : SoloBoard[] {
    return soloBoards
  }

}
