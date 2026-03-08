import BotMode from '@/services/enum/BotMode'
import SoloBoards from '@/services/SoloBoards'
import { expect } from 'chai'

describe('services/SoloBoards', () => {
  it('get', () => {
    const soloBoard = SoloBoards.get(BotMode.BASE)

    expect(soloBoard?.id).to.eq(BotMode.BASE)
  })

  it('getAll', () => {
    expect(SoloBoards.getAll().length).to.eq(2)
  })
})
