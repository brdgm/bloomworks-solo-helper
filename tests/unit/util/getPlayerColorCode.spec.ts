import PlayerColor from '@/services/enum/PlayerColor'
import getPlayerColorCode from '@/util/getPlayerColorCode'
import { expect } from 'chai'

describe('util/getPlayerColorCode', () => {
  it('WHITE', () => {
    expect(getPlayerColorCode(PlayerColor.WHITE)).to.eq('#e6e7e8')
  })

  it('LIGHT_BLUE', () => {
    expect(getPlayerColorCode(PlayerColor.LIGHT_BLUE)).to.eq('#7ec8e3')
  })

  it('MEDIUM_BLUE', () => {
    expect(getPlayerColorCode(PlayerColor.MEDIUM_BLUE)).to.eq('#3a7ca5')
  })

  it('DARK_BLUE', () => {
    expect(getPlayerColorCode(PlayerColor.DARK_BLUE)).to.eq('#1a3a5c')
  })

  it('invalid', () => {
    expect(() => getPlayerColorCode('invalid' as PlayerColor)).to.throw('Invalid player color: invalid.')
  })
})
