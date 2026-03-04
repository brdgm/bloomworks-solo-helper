import SoloBoards from '@/services/SoloBoards'
import { expect } from 'chai'

describe('services/SoloBoards', () => {
  it('get', () => {
    const soloBoard = SoloBoards.get('base')

    expect(soloBoard?.id).to.eq('base')
  })

  it('getAll', () => {
    expect(SoloBoards.getAll().length).to.eq(2)
  })
})
